import { TaskCreationInterface } from "../types/types";

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
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/workspaces`
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
      throw new Error("Failed to fetch workspaces");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching tasks:", error.message);
    throw error;
  }
}

export async function addTask(task: TaskCreationInterface) {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_CONNECTION_IP}:8000/tasks`,
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

    return await response.json();
  } catch (error: any) {
    console.error("Error adding task:", error.message);
    throw error;
  }
}
