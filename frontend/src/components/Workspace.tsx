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
  UserInterface,
} from "../types/types";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addCard,
  addTask,
  addUsersToWorkspace,
  deleteTask,
  deleteUsersFromWorkspace,
  fetchCards,
  fetchTasks,
  fetchUsers,
  fetchWorkspace,
  fetchWorkspaceUsers,
  updateTask,
  updateWorkspace,
} from "../apis/api";
import { createPortal } from "react-dom";
import Task from "./Task";
import { arrayMove } from "@dnd-kit/sortable";
import Chart from "./Chart";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jsonwebtoken";
import SelectUserModal from "./modals/SelectUserModal";

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
    name: "Testing",
    order: 3,
  },
  {
    id: 4,
    name: "Done",
    order: 4,
  },
];
const defaultWorkspace: WorkspaceInterface = {
  id: -1,
  owner_id: -1,
  name: "Please login to use this feature!",
};

function Workspace() {
  const { workspace_id } = useParams<{ workspace_id: any }>();
  const [users, SetUsers] = useState<UserInterface[]>([]);
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [workspace, setWorkspace] =
    useState<WorkspaceInterface>(defaultWorkspace);
  const [activeTask, setActiveTask] = useState<TaskInterface | null>(null);
  const hasAddedDefaultCards = useRef(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };
  const token = localStorage.getItem("token");

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

        const workspaceUsers = await fetchWorkspaceUsers(workspace_id);
        SetUsers(workspaceUsers);
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
  if (token != null) {
    const decodedToken = jwtDecode<JwtPayload>(token);
    return (
      <div className="">
        {tasks.length > 0 && workspace_id && (
          <Chart workspace_id={workspace_id} tasks={tasks} />
        )}
        <DndContext
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          sensors={sensors}
        >
          <div>
            {editMode ? (
              <div className="text-center items-center mt-6">
                <input
                  autoFocus
                  className="text-center text-4xl w-full outline-none text-red-500 pb-2"
                  onChange={(e) =>
                    updateWorkspaceName(workspace.id, e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      toggleEditMode();
                    }
                  }}
                  defaultValue={workspace.name}
                />
                <div className="w-1/2 m-auto h-[1px] bg-red-500"></div>
              </div>
            ) : (
              <div className="text-center mt-6">
                <h1
                  onClick={toggleEditMode}
                  className="text-4xl border-b inline-block pb-2 border-black"
                >
                  {workspace.name}
                </h1>

                {workspace.id == decodedToken.id && (
                  <div className="text-3xl">
                    <button onClick={() => openModal()}>Add User</button>
                    <SelectUserModal
                      users={users}
                      getUsers={getUsers}
                      isOpen={modalIsOpen}
                      onAfterOpen={() => {}}
                      onRequestAddUsers={addUsers}
                      onRequestClose={closeModal}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="m-auto flex gap-4 overflow-y-scroll">
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
                      removeTask={removeTask}
                    />
                  ))}
              </div>
            </div>
          </div>
          {createPortal(
            <DragOverlay>
              {activeTask && (
                <Task
                  task={activeTask}
                  updateTaskContent={updateTaskContent}
                  removeTask={removeTask}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-6xl text-center">
          Please login to use this feature!
        </h1>
      </div>
    );
  }
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
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = Number(over.id);

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

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

  function updateWorkspaceName(id: number, value: string) {
    workspace.name = value.trim();
    updateWorkspace(workspace, id);
    setWorkspace(workspace);
  }

  function removeTask(task: TaskInterface) {
    deleteTask(task.id);
    setTasks(tasks.filter((t) => t.id !== task.id));
  }

  async function getUsers(): Promise<UserInterface[]> {
    const users = await fetchUsers();
    const editedUsers: UserInterface[] = users
      .filter((user) => user.id !== workspace.owner_id)
      .map((user) => ({ ...user }));
    return editedUsers;
  }

  function addUsers(users: UserInterface[]) {
    deleteUsersFromWorkspace(workspace.id).then(() =>
      addUsersToWorkspace(workspace.id, users)
    );
  }
}

export default Workspace;
