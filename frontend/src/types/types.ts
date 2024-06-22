export type TaskInterface = {
  id: Id;
  name: string;
  description: string;
  order: number;
  card_name: Id;
};

export type CardInterface = {
  id: Id;
  order: number;
  name: string;
};

export type Id = string | number;
