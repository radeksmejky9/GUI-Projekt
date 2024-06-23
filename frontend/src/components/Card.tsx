import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {
  CardInterface,
  TaskCreationInterface,
  TaskInterface,
} from "../types/types";
import Task from "./Task";
import { useMemo } from "react";

interface Props {
  card: CardInterface;
  tasks: TaskInterface[];
  createTask: (task: TaskCreationInterface, card_id: number) => void;
  updateTaskContent: (id: number, field: string, value: string) => void;
  removeTask: (task: TaskInterface) => void;
}

function Card({
  card,
  tasks,
  createTask,
  updateTaskContent,
  removeTask,
}: Props) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    /*attributes,
    listeners,
    transform,
    transition,
    isDragging,*/
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  /*const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-lime-400 opacity-40 border-2 border-pink-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }*/
  reorder();
  return (
    <div
      ref={setNodeRef}
      className="bg-gray-200 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col m-1"
    >
      {/* Header */}
      <div className="bg-gray-400 text-xl rounded-t-md p-2 font-bold border-b-4 border-gray-200 flex justify-between items-center">
        <h1>{card.name}</h1>
      </div>

      {/* Body */}
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

      {/* Footer */}
      <div
        onClick={() => {
          const newTask = {
            name: "New Task",
            description: "Enter task description",
            deadline: new Date().toISOString(),
            start_date: new Date().toISOString(),
            completion_date:
              card.name == "Done"
                ? new Date().toISOString()
                : new Date(0).toISOString(),
            order: tasks.length + 1,
          };

          createTask(newTask, card.id);
        }}
        className="flex items-center justify-center bg-gray-400 hover:bg-lime-500 rounded-b-md p-2 cursor-pointer"
      >
        Add Task
      </div>
    </div>
  );

  function reorder() {
    var orderMin = 1;
    tasks.forEach((task) => (task.order = orderMin++));
  }
}

export default Card;
