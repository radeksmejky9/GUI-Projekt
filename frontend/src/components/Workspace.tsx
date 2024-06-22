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
import { useMemo, useState } from "react";
import { CardInterface, Id, TaskInterface } from "../types/types";
import { createPortal } from "react-dom";
import Task from "./Task";

type Props = {
  title: string;
};
const defaultCards: CardInterface[] = [
  {
    id: "todo",
    order: 1,
    title: "Groceries",
  },
  {
    id: "done",
    order: 2,
    title: "Chores",
  },
  {
    id: "kek",
    order: 3,
    title: "Work",
  },
  {
    id: "asdasd",
    order: 4,
    title: "Work",
  },
];

const defaultTasks: TaskInterface[] = [
  {
    id: 1,
    title: "Buy groceries",
    desc: "Buy milk, eggs, and bread from the store",
    card_id: "todo",
    order: 1,
  },
  {
    id: 2,
    title: "Clean kitchen",
    desc: "Wash dishes and wipe down counters",
    card_id: "todo",
    order: 2,
  },
  {
    id: 3,
    title: "Finish report",
    desc: "Complete the financial report for Q2",
    card_id: "todo",
    order: 3,
  },
  {
    id: 4,
    title: "Walk the dog",
    desc: "Take the dog for a 30-minute walk",
    card_id: "done",
    order: 1,
  },
  {
    id: 5,
    title: "Read book",
    desc: "Read the next chapter of the novel",
    card_id: "done",
    order: 2,
  },
  {
    id: 6,
    title: "Call plumber",
    desc: "Schedule an appointment to fix the leak",
    card_id: "done",
    order: 3,
  },
  {
    id: 7,
    title: "Workout",
    desc: "Do a 45-minute workout session",
    card_id: "kek",
    order: 1,
  },
  {
    id: 8,
    title: "Plan vacation",
    desc: "Research and plan the summer vacation",
    card_id: "kek",
    order: 2,
  },
  {
    id: 9,
    title: "Grocery shopping",
    desc: "Buy vegetables and fruits",
    card_id: "kek",
    order: 3,
  },
  {
    id: 10,
    title: "Pay bills",
    desc: "Pay electricity and water bills online",
    card_id: "kek",
    order: 4,
  },
  {
    id: 11,
    title: "Prepare presentation",
    desc: "Create slides for Monday's meeting",
    card_id: "kek",
    order: 5,
  },
  {
    id: 12,
    title: "Attend yoga class",
    desc: "Join the evening yoga session",
    card_id: "kek",
    order: 6,
  },
  {
    id: 13,
    title: "Fix bike",
    desc: "Repair the flat tire on the bicycle",
    card_id: "kek",
    order: 7,
  },
  {
    id: 14,
    title: "Update resume",
    desc: "Add recent job experience to the resume",
    card_id: "kek",
    order: 8,
  },
  {
    id: 15,
    title: "Organize files",
    desc: "Sort and file important documents",
    card_id: "kek",
    order: 9,
  },
  {
    id: 16,
    title: "Schedule meeting",
    desc: "Arrange a team meeting for project discussion",
    card_id: "kek",
    order: 10,
  },
  {
    id: 17,
    title: "Write blog post",
    desc: "Draft a new article for the blog",
    card_id: "kek",
    order: 11,
  },
  {
    id: 18,
    title: "Clean garage",
    desc: "Declutter and organize the garage",
    card_id: "kek",
    order: 12,
  },
  {
    id: 19,
    title: "Check emails",
    desc: "Respond to urgent emails",
    card_id: "kek",
    order: 13,
  },
  {
    id: 20,
    title: "Plan dinner",
    desc: "Decide and prep for tonight's dinner",
    card_id: "kek",
    order: 14,
  },
  {
    id: 21,
    title: "Study for exam",
    desc: "Review notes for the upcoming exam",
    card_id: "kek",
    order: 15,
  },
];

function Workspace({ title }: Props) {
  const [cards, setCards] = useState<CardInterface[]>(defaultCards);
  const [tasks, setTasks] = useState<TaskInterface[]>(defaultTasks);
  const cardsIds = useMemo(() => cards.map((card) => card.id), [cards]);

  const [activeCard, setActiveCard] = useState<CardInterface | null>(null);
  const [activeTask, setActiveTask] = useState<TaskInterface | null>(null);

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
        <div className="m-auto flex gap-4 overflow-auto">
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
      title: "New Task",
      desc: "Description of Task",
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
