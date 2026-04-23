import { Request, Response, NextFunction } from 'express';
import * as TaskService from '../services/task.service';
import { createTaskSchema, updateTaskSchema } from '../utils/validation';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = createTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const userId = req.user!.userId;
    const task = await TaskService.createTask(userId, req.body);
    
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const tasks = await TaskService.getTasks(userId);
    
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const task = await TaskService.getTaskById(req.params.id, userId);
    
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const userId = req.user!.userId;
    const task = await TaskService.updateTask(req.params.id, userId, req.body);
    
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    await TaskService.deleteTask(req.params.id, userId);
    
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
