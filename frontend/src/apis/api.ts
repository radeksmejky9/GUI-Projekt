import {
  CardCreationInterface,
  TaskCreationInterface,
  TaskInterface,
  UserInterface,
  WorkspaceCreationInterface,
  WorkspaceInterface,
} from "../types/types";

export async function fetchUsers() {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/users`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch cards");
    }
    const users: UserInterface[] = await response.json();
    return users;
  } catch (error: any) {
    console.error("Error fetching cards:", error.message);
    throw error;
  }
}
export async function fetchCards(workspace_id: number) {
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

export async function fetchTasks(workspace_id: number) {
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

export async function fetchWorkspaces() {
  try {
    const response = await fetch(
      `http://${
        process.env.REACT_APP_CONNECTION_IP
      }:8000/token/${localStorage.getItem("token")}/workspaces`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch workspaces");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching tasks:", error.message);
    throw error;
  }
}

export async function fetchWorkspace(workspace_id: number) {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/workspaces/${workspace_id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch workspace");
    }
    const createdWorkspace: WorkspaceInterface = await response.json();
    return createdWorkspace;
  } catch (error: any) {
    console.error("Error fetching tasks:", error.message);
    throw error;
  }
}

export async function addCard(
  card: CardCreationInterface,
  workspace_id: number
) {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/workspaces/${workspace_id}/cards`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add card");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error adding card:", error.message);
    throw error;
  }
}

export async function addWorkspace(
  workspace: WorkspaceCreationInterface,
  token: string
) {
  if (token === "") {
    console.log("Token is empty");
    return;
  }
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/workspaces/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workspace),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add workspace");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error adding workspace:", error.message);
    throw error;
  }
}

export async function addTask(task: TaskCreationInterface, card_id: number) {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/cards/${card_id}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add task");
    }
    const createdTask: TaskInterface = await response.json();
    return createdTask;
  } catch (error: any) {
    console.error("Error adding task:", error.message);
    throw error;
  }
}

export async function updateTask(task: TaskCreationInterface, task_id: number) {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/tasks/${task_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error updating task:", error.message);
    throw error;
  }
}

export async function updateWorkspace(
  workspace: WorkspaceCreationInterface,
  workspace_id: number
) {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/workspaces/${workspace_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workspace),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error updating task:", error.message);
    throw error;
  }
}

export async function deleteWorkspace(workspace_id: number) {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/workspaces/${workspace_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete workspace: ${errorData.detail}`);
    }

    const data = await response.json();
    console.log(data.detail);
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function deleteTask(task_id: number) {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/tasks/${task_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete task: ${errorData.detail}`);
    }

    const data = await response.json();
    console.log(data.detail);
  } catch (error: any) {
    console.error(error.message);
  }
}
