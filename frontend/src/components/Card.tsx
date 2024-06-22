import { useSortable } from "@dnd-kit/sortable";
import { CardInterface } from "../types/types";
import { CSS } from "@dnd-kit/utilities";
import Task from "./Task";

interface Props {
  card: CardInterface;
}

function Card({ card }: Props) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-lime-200 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col mx-2"
    >
      <div>
        <div
          {...attributes}
          {...listeners}
          className="bg-lime-400 cursor-grab text-center"
        >
          <h1 className="text-xl">{card.title}</h1>
        </div>
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
          {card.tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Card;
