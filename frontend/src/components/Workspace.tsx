import Card from "./Card";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { CardInterface, TaskInterface } from "../types/types";
import { createPortal } from "react-dom";

type WorkspaceProps = {
  title: string;
};

const defaultCards: CardInterface[] = [
  {
    id: 1,
    title: "hi",
    tasks: [
      { id: 1, title: "Task 1", desc: "Description of Task 1" },
      { id: 2, title: "Task 2", desc: "Description of Task 2" },
      { id: 3, title: "Task 3", desc: "Description of Task 3" },
    ],
  },
  {
    id: 2,
    title: "hello",
    tasks: [
      { id: 1, title: "Task 1", desc: "Description of Task 1" },
      { id: 2, title: "Task 2", desc: "Description of Task 2" },
      { id: 3, title: "Task 3", desc: "Description of Task 3" },
    ],
  },
  {
    id: 3,
    title: "welcome",
    tasks: [
      { id: 1, title: "Task 1", desc: "Description of Task 1" },
      { id: 2, title: "Task 2", desc: "Description of Task 2" },
      { id: 3, title: "Task 3", desc: "Description of Task 3" },
    ],
  },
  {
    id: 4,
    title: "hi",
    tasks: [
      { id: 1, title: "Task 1", desc: "Description of Task 1" },
      { id: 2, title: "Task 2", desc: "Description of Task 2" },
      { id: 3, title: "Task 3", desc: "Description of Task 3" },
    ],
  },
  {
    id: 5,
    title: "hello",
    tasks: [
      { id: 1, title: "Task 1", desc: "Description of Task 1" },
      { id: 2, title: "Task 2", desc: "Description of Task 2" },
      { id: 3, title: "Task 3", desc: "Description of Task 3" },
    ],
  },
  {
    id: 6,
    title: "welcome",
    tasks: [
      { id: 1, title: "Task 1", desc: "Description of Task 1" },
      { id: 2, title: "Task 2", desc: "Description of Task 2" },
      { id: 3, title: "Task 3", desc: "Description of Task 3" },
    ],
  },
  {
    id: 7,
    title: "welcome",
    tasks: [
      { id: 1, title: "Task 1", desc: "Description of Task 1" },
      { id: 2, title: "Task 2", desc: "Description of Task 2" },
      { id: 3, title: "Task 3", desc: "Description of Task 3" },
    ],
  },
];

const Workspace = ({ title }: WorkspaceProps) => {
  const [cards, setCards] = useState<CardInterface[]>(defaultCards);
  const cardsId = useMemo(() => cards.map((card) => card.id), [cards]);
  const [activeCard, setActiveCard] = useState<CardInterface | null>(null);

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div>
        <div>
          <h1 className="text-3xl font-bold mx-4 my-6 ml-6">{title}</h1>
        </div>
        <div className="m-auto flex gap-4 overflow-auto">
          <SortableContext items={cardsId}>
            <div className="m-auto flex items-center p-4">
              {cards.map((card) => (
                <Card key={card.id} card={card} />
              ))}
            </div>
          </SortableContext>
        </div>
      </div>
      {createPortal(
        <DragOverlay>{activeCard && <Card card={activeCard} />}</DragOverlay>,
        document.body
      )}
    </DndContext>
  );

  function createNewCard(
    id: number,
    title: string = "New Card",
    tasks: TaskInterface[] = []
  ) {
    const cardToAdd: CardInterface = {
      id: id,
      title: title,
      tasks: tasks,
    };

    setCards([...cards, cardToAdd]);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "CardInterface") {
      setActiveCard(event.active.data.current.card);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) return;

    setCards((cards) => {
      const activeColumnIndex = cards.findIndex((card) => card.id === activeId);

      const overColumnIndex = cards.findIndex((card) => card.id === overId);

      return arrayMove(cards, activeColumnIndex, overColumnIndex);
    });
  }
};

export default Workspace;
