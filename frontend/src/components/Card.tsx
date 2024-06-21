import Task, { TaskInterface } from "./Task";

type CardProps = {
  title: string;
  tasks: TaskInterface[];
};

const Card = ({ title, tasks }: CardProps) => {
  return (
    <div className="bg-gray-200 my-2 border-gray-800 border-2 rounded-md">
      <div className="min-w-64 h-96 p-2">
        <h1 className="text-xl">{title}</h1>
        {tasks.map((task) => (
          <Task title={task.title} desc={task.desc} />
        ))}
      </div>
    </div>
  );
};

export default Card;
