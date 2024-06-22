import Card from "./Card";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useMemo, useState, useEffect } from "react";
import { CardInterface, Id, TaskInterface } from "../types/types";
import { createPortal } from "react-dom";
import Task from "./Task";

type Props = {
  title: string;
  workspace_id: number;
};
const defaultCards: CardInterface[] = [];

const defaultTasks: TaskInterface[] = [];

async function fetchCards(workspace_id: number) {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/workspaces/${workspace_id}/cards`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch cards");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching cards:", error.message);
    throw error;
  }
}

async function fetchTasks(workspace_id: number) {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/workspaces/${workspace_id}/tasks`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching tasks:", error.message);
    throw error;
  }
}

function Workspace({ title, workspace_id }: Props) {
  const [cards, setCards] = useState<CardInterface[]>(defaultCards);
  const [tasks, setTasks] = useState<TaskInterface[]>(defaultTasks);
  const cardsIds = useMemo(() => cards.map((card) => card.id), [cards]);

  const [activeCard, setActiveCard] = useState<CardInterface | null>(null);
  const [activeTask, setActiveTask] = useState<TaskInterface | null>(null);

  useEffect(() => {
    if (workspace_id) {
      fetchCards(workspace_id)
        .then((data) => setCards(data))
        .catch((error) =>
          console.error("Error fetching cards:", error.message)
        );
    }
  }, [workspace_id]);

  useEffect(() => {
    console.log("cards length:", cards.length);
    console.log("workspace_id:", workspace_id);

    if (cards.length > 0 && workspace_id) {
      fetchTasks(workspace_id)
        .then((data) => setTasks(data))
        .catch((error) =>
          console.error("Error fetching tasks:", error.message)
        );
    }
  }, [cards, workspace_id]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  reorderCards();
  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      sensors={sensors}
    >
      <div>
        <div>
          <h1 className="text-3xl font-bold mx-4 my-6 ml-6">{title}</h1>
        </div>
        <div className="m-auto flex gap-4 overflow-y-scroll">
          <SortableContext items={cardsIds}>
            <div className="m-auto flex items-center p-4">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.card_id === card.id)}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      </div>
      {createPortal(
        <DragOverlay>
          {activeCard && (
            <Card
              card={activeCard}
              createTask={createTask}
              tasks={tasks.filter((task) => task.card_id === activeCard.id)}
            />
          )}
          {activeTask && <Task task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );

  function createNewCard(id: Id, title: string = "New Card", order: number) {
    const cardToAdd: CardInterface = {
      id: id,
      title: title,
      order: order,
    };

    setCards([...cards, cardToAdd]);
  }

  function createTask(cardId: Id, order: number) {
    const newTask: TaskInterface = {
      id: tasks.length + 1,
      name: "New Task",
      description: "Description of Task",
      card_id: cardId,
      order: order,
    };
    console.log(newTask.order);
    setTasks([...tasks, newTask]);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current.card);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setCards((cards) => {
      const activeColumnIndex = cards.findIndex((card) => card.id === activeId);
      const overColumnIndex = cards.findIndex((card) => card.id === overId);
      return arrayMove(cards, activeColumnIndex, overColumnIndex);
    });
  }
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].card_id != tasks[overIndex].card_id) {
          tasks[activeIndex].card_id = tasks[overIndex].card_id;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Card";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        console.log(isOverAColumn);
        tasks[activeIndex].card_id = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function reorderCards() {
    var orderMin = 1;
    cards.forEach((card) => (card.order = orderMin++));
  }
}

export default Workspace;
