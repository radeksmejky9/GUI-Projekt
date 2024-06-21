import Card from "./Card";

type WorkspaceProps = {
  title: string;
};

const Workspace = ({ title }: WorkspaceProps) => {
  const cards = [
    {
      title: "hi",
      tasks: [
        { title: "Task 1", desc: "Description of Task 1" },
        { title: "Task 2", desc: "Description of Task 2" },
        { title: "Task 3", desc: "Description of Task 3" },
      ],
    },
    {
      title: "hello",
      tasks: [
        { title: "Task 1", desc: "Description of Task 1" },
        { title: "Task 2", desc: "Description of Task 2" },
        { title: "Task 3", desc: "Description of Task 3" },
      ],
    },
    {
      title: "welcome",
      tasks: [
        { title: "Task 1", desc: "Description of Task 1" },
        { title: "Task 2", desc: "Description of Task 2" },
        { title: "Task 3", desc: "Description of Task 3" },
      ],
    },
  ];

  return (
    <div>
      <h1 className="text-2xl mx-4">{title}</h1>
      <div className="gap-4 bg-green-100 text-center flex overflow-x-auto space-x-4 px-4">
        {cards.map((card) => (
          <Card title={card.title} tasks={card.tasks} />
        ))}
      </div>
    </div>
  );
};

export default Workspace;
