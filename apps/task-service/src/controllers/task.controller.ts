import { Request, Response, NextFunction } from 'express';
import * as TaskService from '../services/task.service';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const managerId = (req.user as any).userId;
    const task = await TaskService.createNewTask(managerId, req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const getTeamTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const managerId = (req.user as any).userId;
    const tasks = await TaskService.getTeamTasks(managerId);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId;
    const tasks = await TaskService.getMyTasks(userId);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const managerId = (req.user as any).userId;
    const taskId = req.params.id;
    const task = await TaskService.updateTaskStatus(managerId, taskId, req.body);
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};
