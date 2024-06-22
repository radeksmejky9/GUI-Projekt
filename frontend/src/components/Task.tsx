import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskInterface } from "../types/types";
import { useState } from "react";

type Props = {
  task: TaskInterface;
  updateTaskContent: (id: number, field: string, value: string) => void;
};

function Task({ task, updateTaskContent }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

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
    disabled: editMode,
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
      bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
      "
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-gray-200 my-2 p-2 border-2 border-gray-800 rounded-md h-[100px] min-h-[100px] min-h-[100px] overflow-y-auto overflow-x-hidden"
      >
        <input
          className="text-lg text-left border outline-none w-full px-2 py-1"
          defaultValue={task.name}
          onChange={(e) => updateTaskContent(task.id, "name", e.target.value)}
          placeholder="Your task name here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              toggleEditMode();
            }
          }}
        ></input>
        <div>
          <textarea
            className="text-lg text-left border outline-none w-full px-2 py-1"
            defaultValue={task.description}
            onChange={(e) =>
              updateTaskContent(task.id, "description", e.target.value)
            }
            placeholder="Your task description here"
            onBlur={toggleEditMode}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                toggleEditMode();
              }
            }}
          ></textarea>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      className="bg-gray-200 my-2 p-2 border-2 border-gray-800 rounded-md h-[100px] min-h-[100px] min-h-[100px] overflow-y-auto overflow-x-hidden"
    >
      <h1 className="text-lg text-left">{task.name}</h1>
      <div>
        <span>{task.description}</span>
      </div>
    </div>
  );
}

export default Task;
