import * as TaskModel from '../models/task.model';
import { ICreateTaskRequest, IUpdateTaskRequest } from '../types/task.types';
import { publishToQueue } from '../utils/rabbitmq';
import { getCache, setCache, deleteCache } from '../utils/redis';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3002';

// Helper to check if a user is in a manager's team
const isUserInTeam = async (managerId: string, userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${USER_SERVICE_URL}/api/users/${userId}`);
    if (!response.ok) return false;
    const result = await response.json();
    return result.data && result.data.managerId === managerId;
  } catch (error) {
    console.error('Error checking team membership:', error);
    return false;
  }
};

export const createNewTask = async (managerId: string, taskData: ICreateTaskRequest) => {
  const { userId } = taskData;

  // Verify that the target user belongs to this manager's team
  const inTeam = await isUserInTeam(managerId, userId);
  if (!inTeam) {
    const error: any = new Error('Forbidden: You can only assign tasks to your own team members');
    error.statusCode = 403;
    throw error;
  }

  const task = await TaskModel.createTask({
    ...taskData,
    creatorId: managerId
  });

  // Invalidate cache
  await deleteCache(`tasks:user:${task.userId}`);
  await deleteCache(`tasks:manager:${managerId}`);

  // Notify via RabbitMQ
  await publishToQueue('notifications', {
    userId: task.userId,
    message: `New task assigned: ${task.title}`,
    type: 'INFO'
  });

  return task;
};

export const getTeamTasks = async (managerId: string) => {
  const cacheKey = `tasks:manager:${managerId}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const tasks = await TaskModel.findTasksByCreator(managerId);
  await setCache(cacheKey, tasks, 300); // 5 mins
  return tasks;
};

export const getMyTasks = async (userId: string) => {
  const cacheKey = `tasks:user:${userId}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const tasks = await TaskModel.findTasksByUser(userId);
  await setCache(cacheKey, tasks, 300); // 5 mins
  return tasks;
};

export const updateTaskStatus = async (managerId: string, taskId: string, updateData: IUpdateTaskRequest) => {
  const task = await TaskModel.findTaskById(taskId);
  if (!task) {
    const error: any = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  // Manager can only modify tasks they created (for their team)
  if (task.creatorId !== managerId) {
    const error: any = new Error('Forbidden: You can only modify tasks for your own team members');
    error.statusCode = 403;
    throw error;
  }

  const updatedTask = await TaskModel.updateTask(taskId, updateData);

  // Invalidate cache
  await deleteCache(`tasks:user:${updatedTask.userId}`);
  await deleteCache(`tasks:manager:${managerId}`);

  return updatedTask;
};
