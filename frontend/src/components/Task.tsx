import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskInterface } from "../types/types";
import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";

type Props = {
  task: TaskInterface;
  updateTaskContent: (id: number, field: string, value: string) => void;
  removeTask(task: TaskInterface): void;
};

function Task({ task, updateTaskContent, removeTask }: Props) {
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
        className="opacity-30 my-2 p-4 max-h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative "
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
        className="bg-gray-200 my-2 p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
      >
        <input
          className="text-lg font-semibold text-left text-gray-800 border border-gray-300 outline-none w-full px-3 py-2 mb-3 rounded-md"
          defaultValue={task.name == "New Task" ? "" : task.name}
          onChange={(e) => updateTaskContent(task.id, "name", e.target.value)}
          placeholder="Your task name here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              toggleEditMode();
            }
          }}
        />
        <textarea
          className="text-lg text-left text-gray-600 border border-gray-300 outline-none w-full px-3 py-2 rounded-md"
          defaultValue={
            task.description == "Enter task description" ? "" : task.description
          }
          placeholder="Your task description here"
          onChange={(e) =>
            updateTaskContent(task.id, "description", e.target.value)
          }
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              toggleEditMode();
            }
          }}
          style={{ minHeight: "50px" }}
        />
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
      className="max-h-[100px] min-h-[100px] relative bg-gray-200 my-2 p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
    >
      <h1 className="text-lg font-semibold text-left text-gray-800">
        {task.name}
      </h1>
      <div className="mt-2 overflow-y-auto h-[50px] break-all">
        <p className="text-gray-600">{task.description}</p>
      </div>
      {mouseIsOver && (
        <button
          className="absolute top-2 right-2 p-1 stroke-red-500 border-2 border-red-500 rounded-full hover:bg-red-600 hover:border-red-600 hover:stroke-white transition-colors duration-200 ease-in-out"
          onClick={() => removeTask(task)}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export default Task;
