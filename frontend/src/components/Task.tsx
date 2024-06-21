import { TaskInterface } from "../types/types";

type Props = {
  task: TaskInterface;
};

const Task = ({ task }: Props) => {
  return (
    <div className="bg-gray-200 my-2 p-2 border-2 border-gray-800 rounded-md">
      <h1 className="text-lg text-left">{task.title}</h1>
      <span>{task.desc}</span>
    </div>
  );
};

export default Task;
