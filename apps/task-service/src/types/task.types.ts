export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface ITask {
  id: string;
  title: string;
  description?: string | null;
  status: Status;
  userId: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTaskRequest {
  title: string;
  description?: string;
  userId: string;
}

export interface IUpdateTaskRequest {
  title?: string;
  description?: string;
  status?: Status;
}
