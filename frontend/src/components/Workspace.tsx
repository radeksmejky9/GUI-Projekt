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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import Task from "./Task";
import { arrayMove } from "@dnd-kit/sortable";
import Chart from "./Chart";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jsonwebtoken";
import SelectUserModal from "./modals/SelectUserModal";
import {
  fetchTasks,
  fetchUsers,
  fetchWorkspace,
  fetchWorkspaceUsers,
} from "../apis/api_get";
import { addTask, addWorkspaceUsers } from "../apis/api_post";
import { updateTask, updateWorkspace } from "../apis/api_put";
import { deleteTask, deleteUsersFromWorkspace } from "../apis/api_delete";

const defaultCards: CardInterface[] = [
  {
    name: "To-do",
  },
  {
    name: "Doing",
  },
  {
    name: "Testing",
  },
  {
    name: "Done",
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
  const cards = defaultCards;
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [workspace, setWorkspace] =
    useState<WorkspaceInterface>(defaultWorkspace);
  const [activeTask, setActiveTask] = useState<TaskInterface | null>(null);
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

                {workspace.owner_id === decodedToken.id && (
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
                {cards.map((card) => (
                  <Card
                    key={card.name}
                    workspace_id={workspace_id}
                    card={card}
                    createTask={createTask}
                    tasks={tasks.filter((task) => task.card_name === card.name)}
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

  function createTask(newTask: TaskCreationInterface) {
    addTask(newTask).then((task: TaskInterface) => {
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
    const overId =
      over.data.current?.type === "Card"
        ? over.data.current?.card.name
        : over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);

        if (tasks[activeIndex].card_name !== tasks[overIndex].card_name) {
          tasks[activeIndex].card_name = tasks[overIndex].card_name;
          updateTask({ ...tasks[activeIndex] }, tasks[activeIndex].id);
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        updateTask({ ...tasks[activeIndex] }, tasks[activeIndex].id);
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverACard = over.data.current?.type === "Card";
    if (isActiveATask && isOverACard) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        tasks[activeIndex].card_name = overId;
        if (tasks[activeIndex].card_name === cards[cards.length - 1].name) {
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
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      console.error(`Task with id ${id} not found.`);
      return;
    }
    console.log(value);
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
    const users: UserInterface[] = await fetchUsers();
    const editedUsers: UserInterface[] = users
      .filter((user) => user.id !== workspace.owner_id)
      .map((user) => ({ ...user }));
    return editedUsers;
  }

  function addUsers(users: UserInterface[]) {
    deleteUsersFromWorkspace(workspace.id).then(() =>
      addWorkspaceUsers(workspace.id, users)
    );
  }
}

export default Workspace;
