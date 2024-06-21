export interface TaskInterface {
  title: string;
  desc: string;
}

type TaskProps = TaskInterface;

const Task = ({ title, desc }: TaskProps) => {
  return (
    <div className="bg-gray-200 my-2 p-2 border-2 border-gray-800 rounded-md">
      <h1 className="text-lg text-left">{title}</h1>
      <span>{desc}</span>
    </div>
  );
};

export default Task;
