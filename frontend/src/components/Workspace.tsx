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
import {
  CardInterface,
  TaskInterface,
  WorkspaceInterface,
  TaskCreationInterface,
} from "../types/types";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addCard,
  addTask,
  fetchCards,
  fetchTasks,
  fetchWorkspace,
  updateTask,
} from "../apis/api";
import { createPortal } from "react-dom";
import Task from "./Task";
import { arrayMove } from "@dnd-kit/sortable";

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
const defaultWorkspace: WorkspaceInterface = { id: "", name: "" };

function Workspace() {
  /*const cardsIds = useMemo(() => cards.map((card) => card.id), [cards]);*/
  /*const [activeCard, setActiveCard] = useState<CardInterface | null>(null);*/

  const [cards, setCards] = useState<CardInterface[]>([]);
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [workspace, setWorkspace] =
    useState<WorkspaceInterface>(defaultWorkspace);
  const { workspace_id } = useParams<{ workspace_id: any }>();
  const [activeTask, setActiveTask] = useState<TaskInterface | null>(null);
  const hasAddedDefaultCards = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workspaceData = await fetchWorkspace(workspace_id);
        setWorkspace(workspaceData);

        const cardsData = await fetchCards(workspace_id);
        if (cardsData.length === 0 && !hasAddedDefaultCards.current) {
          hasAddedDefaultCards.current = true;
          const promises = defaultCards.map((card) =>
            addCard({ name: card.name, order: card.order }, workspace_id)
          );
          await Promise.all(promises);
          setCards(defaultCards);
        } else {
          setCards(cardsData);
        }
      } catch (error: any) {
        console.error("Error:", error.message);
      }
    };

    if (workspace_id) {
      fetchData();
    }
  }, [workspace_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksData: TaskInterface[] = await fetchTasks(workspace_id);

        setTasks(tasksData);
      } catch (error: any) {
        console.error("Error:", error.message);
      }
    };

    if (cards.length > 0 && workspace_id) {
      fetchData();
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
          <h1 className="text-3xl text-center font-bold mx-4 my-6">
            {workspace.name}
          </h1>
        </div>
        <div className="m-auto flex gap-4 overflow-y-scroll">
          {/*<SortableContext items={cardsIds}>*/}
          <div className="m-auto flex items-center p-4">
            {cards
              .sort((a, b) => a.order - b.order)
              .map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.card_id === card.id)}
                  updateTaskContent={updateTaskContent}
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
          {activeTask && (
            <Task task={activeTask} updateTaskContent={updateTaskContent} />
          )}
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

  function createTask(newTask: TaskCreationInterface, card_id: number) {
    addTask(newTask, card_id).then((task) => {
      setTasks([...tasks, task]);
    });
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
    const overId = Number(over.id);

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);

        if (tasks[activeIndex].card_id !== tasks[overIndex].card_id) {
          tasks[activeIndex].card_id = tasks[overIndex].card_id;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverACard = over.data.current?.type === "Card";
    // Im dropping a Task over a card
    if (isActiveATask && isOverACard) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        tasks[activeIndex].card_id = overId;
        console.log({ ...tasks[activeIndex] });
        if (tasks[activeIndex].card_id === cards[cards.length - 1].id) {
          tasks[activeIndex].completion_date = new Date().toISOString();
        } else {
          tasks[activeIndex].completion_date = new Date(0).toISOString();
        }
        updateTask({ ...tasks[activeIndex] }, tasks[activeIndex].id);
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
  function updateTaskContent(id: number, field: string, value: string) {
    // Find the task to update
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      console.error(`Task with id ${id} not found.`);
      return;
    }

    const updatedTask = { ...tasks[index] };
    updatedTask[field] = value;

    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTask;

    setTasks(updatedTasks);
    updateTask(updatedTask, id);
  }
  // function reorderCards() {
  //   var orderMin = 1;
  //   cards.forEach((card) => (card.order = orderMin++));
  // }
}

export default Workspace;
