export type CardInterface = {
  id: number;
  order: number;
  name: string;
};
export type TaskInterface = {
  id: number;
  name: string;
  description: string;
  deadline?: string;
  start_date: string;
  completion_date: string;
  card_id: number;
  order: number;
  [key: string | number]: any;
};

export type WorkspaceInterface = {
  id: number;
  name: string;
};

export type TaskCreationInterface = {
  name: string;
  description: string;
  deadline?: string;
  start_date: string;
  completion_date?: string;
  order: number;
};

export type CardCreationInterface = {
  name: string;
  order: number;
};

export type WorkspaceCreationInterface = {
  name: string;
};

export type Id = string | number;
