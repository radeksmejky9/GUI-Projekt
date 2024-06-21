export type TaskInterface = {
  id: number;
  title: string;
  desc: string;
};

export type CardInterface = {
  id: number;
  title: string;
  tasks: TaskInterface[];
};
