export type TaskInterface = {
  id: Id;
  title: string;
  desc: string;
  order: number;
  card_id: Id;
};

export type CardInterface = {
  id: Id;
  order: number;
  title: string;
};

export type Id = string | number;
