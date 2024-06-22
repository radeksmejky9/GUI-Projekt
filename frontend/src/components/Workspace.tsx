import Card from "./Card";
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { CardInterface, TaskInterface } from "../types/types";
import { createPortal } from "react-dom";
import Task from "./Task";

const defaultCards: CardInterface[] = [
  {
    id: 1,
    name: "To-do",
    order: 1,
  },
  {
    id: 2,
    name: "Doing",
    order: 2,
  },
  {
    id: 3,
    name: "Bugs",
    order: 3,
  },
  {
    id: 4,
    name: "Done",
    order: 4,
  },
];

type Props = {
  title: string;
  workspace_id: number;
};
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
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  /*const cardsIds = useMemo(() => cards.map((card) => card.id), [cards]);*/

  /*const [activeCard, setActiveCard] = useState<CardInterface | null>(null);*/
  const [activeTask, setActiveTask] = useState<TaskInterface | null>(null);

  useEffect(() => {
    if (workspace_id) {
      fetchCards(workspace_id)
        .then((data) => {
          if (data.length === 0) {
            setCards(defaultCards);
          } else {
            setCards(data);
          }
        })
        .catch((error) =>
          console.error("Error fetching cards:", error.message)
        );
    }
  }, [workspace_id]);

  useEffect(() => {
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
  //reorderCards();
  return (
    <DndContext
      onDragStart={onDragStart}
      /*onDragEnd={onDragEnd}*/
      onDragOver={onDragOver}
      sensors={sensors}
    >
      <div>
        <div>
          <h1 className="text-3xl font-bold mx-4 my-6 ml-6">{title}</h1>
        </div>
        <div className="m-auto flex gap-4 overflow-y-scroll">
          {/*<SortableContext items={cardsIds}>*/}
          <div className="m-auto flex items-center p-4">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                createTask={createTask}
                tasks={tasks.filter((task) => task.card_name === card.name)}
              />
            ))}
          </div>
          {/*</SortableContext>*/}
        </div>
      </div>
      {createPortal(
        <DragOverlay>
          {/*activeCard && (
            <Card
              card={activeCard}
              createTask={createTask}
              tasks={tasks.filter((task) => task.card_name === activeCard.name)}
            />
          )*/}
          {activeTask && <Task task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );

  // function createNewCard(id: Id, name: string = "New Card", order: number) {
  //   const cardToAdd: CardInterface = {
  //     id: id,
  //     name: name,
  //     order: order,
  //   };

  //   setCards([...cards, cardToAdd]);
  // }

  function createTask(cardName: string, order: number) {
    const newTask: TaskInterface = {
      id: tasks.length + 1,
      name: "New Task",
      description: "Description of Task",
      card_name: cardName,
      order: order,
    };
    setTasks([...tasks, newTask]);
  }

  function onDragStart(event: DragStartEvent) {
    /*if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current.card);
      return;
    }*/

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  // function onDragEnd(event: DragEndEvent) {
  //   setActiveCard(null);
  //   setActiveTask(null);

  //   const { active, over } = event;
  //   if (!over) return;

  //   const activeId = active.id;
  //   const overId = over.id;

  //   if (activeId === overId) return;

  //   setCards((cards) => {
  //     const activeColumnIndex = cards.findIndex((card) => card.id === activeId);
  //     const overColumnIndex = cards.findIndex((card) => card.id === overId);
  //     return arrayMove(cards, activeColumnIndex, overColumnIndex);
  //   });
  // }
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId =
      over.data.current?.type === "Card"
        ? over.data.current?.card.name
        : over.id;
    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);

        if (tasks[activeIndex].card_name !== tasks[overIndex].card_name) {
          tasks[activeIndex].card_name = tasks[overIndex].card_name;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverACard = over.data.current?.type === "Card";
    if (isOverACard) console.log(over.data);

    // Im dropping a Task over a card
    if (isActiveATask && isOverACard) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        tasks[activeIndex].card_name = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  // function reorderCards() {
  //   var orderMin = 1;
  //   cards.forEach((card) => (card.order = orderMin++));
  // }
}

export default Workspace;
