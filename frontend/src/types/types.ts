export type CardInterface = {
  id: Id;
  order: number;
  name: string;
};
export type TaskInterface = {
  id: Id;
  name: string;
  description: string;
  order: number;
  card_name: Id;
};

export type WorkspaceInterface = {
  id: Id;
  name: string;
};

export type TaskCreationInterface = {
  name: string;
  description: string;
  deadline?: string;
  start_date: string;
  completion_date?: string;
  card_id: Id;
  order: number;
};

export type Id = string | number;
