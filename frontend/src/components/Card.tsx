import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CardInterface, Id, TaskInterface } from "../types/types";
import { CSS } from "@dnd-kit/utilities";
import Task from "./Task";
import { useMemo } from "react";

interface Props {
  card: CardInterface;
  tasks: TaskInterface[];
  createTask: (cardId: Id, order: number) => void;
}

function Card({ card, tasks, createTask }: Props) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  const style = {
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
  }

  reorder();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-lime-200 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col m-1"
    >
      {/* Header */}
      <div
        {...attributes}
        {...listeners}
        className="bg-lime-400 cursor-grab text-xl rounded-md rounded-b-none p-2 font-bold border-4 border-lime-200 justify-between flex items-center"
      >
        <div className="flex gap-2">
          <h1 className="">
            {card.title} {card.order}
          </h1>
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks
            .sort((task) => task.order)
            .map((task) => (
              <Task key={task.id} task={task} />
            ))}
        </SortableContext>
      </div>
      {/* Footer */}
      <div
        onClick={() => createTask(card.id, tasks.length + 1)}
        className="items-center flex bg-lime-400 gap-2 rounded-md hover:bg-lime-500 p-2 cursor-pointer"
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
