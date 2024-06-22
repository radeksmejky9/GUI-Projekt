import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskInterface } from "../types/types";
import { useState } from "react";

type Props = {
  task: TaskInterface;
};

function Task({ task }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
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
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
      "
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      className="bg-gray-200 my-2 p-2 border-2 border-gray-800 rounded-md"
    >
      <h1 className="text-lg text-left">{task.name}</h1>
      <div>
        <span>{task.description}</span>
        <span className="text-red-500">{task.order}</span>
      </div>
    </div>
  );
}

export default Task;
