export interface TaskInterface {
  title: string;
  desc: string;
}

type TaskProps = TaskInterface;

const Task = ({ title, desc }: TaskProps) => {
  return (
    <div className="bg-gray-200 p-4">
      <h1>{title}</h1>
      <span>{desc}</span>
    </div>
  );
};

export default Task;
