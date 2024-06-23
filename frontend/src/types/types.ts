export type UserInterface = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  profile_picture_url?: string;
};

export type CardInterface = {
  name: string;
};
export type TaskInterface = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  completion_date: string;
  card_name: string;
  order: number;
  [key: string | number]: any;
};

export type TaskCreationInterface = {
  name: string;
  description: string;
  completion_date: string;
  start_date: string;
  order: number;
  card_name: string;
};

export type WorkspaceInterface = {
  id: number;
  name: string;
  owner_id: number;
};

export type WorkspaceCreationInterface = {
  name: string;
};
