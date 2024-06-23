import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {
  CardInterface,
  TaskCreationInterface,
  TaskInterface,
} from "../types/types";
import Task from "./Task";
import { useMemo } from "react";

interface Props {
  workspace_id: number;
  card: CardInterface;
  tasks: TaskInterface[];
  createTask: (task: TaskCreationInterface) => void;
  updateTaskContent: (id: number, field: string, value: string) => void;
  removeTask: (task: TaskInterface) => void;
}

function Card({
  workspace_id,
  card,
  tasks,
  createTask,
  updateTaskContent,
  removeTask,
}: Props) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const { setNodeRef } = useSortable({
    id: card.name,
    data: {
      type: "Card",
      card,
    },
  });

  reorderTasks();
  return (
    <div
      ref={setNodeRef}
      className="bg-gray-200 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col m-1"
    >
      <div className="bg-gray-400 text-xl rounded-t-md p-2 font-bold border-b-4 border-gray-200 flex justify-between items-center">
        <h1>{card.name}</h1>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks
            .sort((a, b) => a.order - b.order)
            .map((task) => (
              <Task
                key={task.id}
                task={task}
                updateTaskContent={updateTaskContent}
                removeTask={removeTask}
              />
            ))}
        </SortableContext>
      </div>

      <div
        onClick={() => {
          const newTask = {
            name: "New Task",
            description: "Enter task description",
            start_date: new Date().toISOString(),
            completion_date:
              card.name == "Done"
                ? new Date().toISOString()
                : new Date(0).toISOString(),
            card_name: card.name,
            order: tasks.length + 1,
            workspace_id: workspace_id,
          };

          createTask(newTask);
        }}
        className="flex items-center justify-center bg-gray-400 hover:bg-gray-500 rounded-b-md p-2 cursor-pointer"
      >
        Add Task
      </div>
    </div>
  );

  function reorderTasks() {
    var orderMin = 1;
    tasks.forEach((task) => (task.order = orderMin++));
  }
}

export default Card;
