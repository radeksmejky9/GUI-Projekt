import Task, { TaskInterface } from "./Task";

type CardProps = {
  title: string;
  tasks: TaskInterface[];
};

const Card = ({ title, tasks }: CardProps) => {
  return (
    <div className="bg-gray-200 p-4">
      <div className="min-w-48 h-96">
        <h1>{title}</h1>

        {tasks.map((task) => (
          <Task title={task.title} desc={task.desc} />
        ))}
      </div>
    </div>
  );
};

export default Card;
