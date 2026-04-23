import * as TaskModel from '../models/task.model';
import { ICreateTaskRequest, IUpdateTaskRequest, ITask } from '../types/task.types';

export const createTask = async (userId: string, data: ICreateTaskRequest): Promise<ITask> => {
  return await TaskModel.createTask(userId, data);
};

export const getTasks = async (userId: string): Promise<ITask[]> => {
  return await TaskModel.findTasksByUserId(userId);
};

export const getTaskById = async (taskId: string, userId: string): Promise<ITask> => {
  const task = await TaskModel.findTaskById(taskId);
  
  if (!task) {
    const error: any = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (task.userId !== userId) {
    const error: any = new Error('Unauthorized access to task');
    error.statusCode = 403;
    throw error;
  }

  return task;
};

export const updateTask = async (taskId: string, userId: string, data: IUpdateTaskRequest): Promise<ITask> => {
  // Ensure task exists and belongs to user
  await getTaskById(taskId, userId);
  
  return await TaskModel.updateTask(taskId, data);
};

export const deleteTask = async (taskId: string, userId: string): Promise<void> => {
  // Ensure task exists and belongs to user
  await getTaskById(taskId, userId);
  
  await TaskModel.deleteTask(taskId);
};
