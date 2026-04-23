export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface ITask {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTaskRequest {
  title: string;
  description?: string;
}

export interface IUpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
