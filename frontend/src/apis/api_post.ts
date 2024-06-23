import {
  TaskCreationInterface,
  TaskInterface,
  UserInterface,
  WorkspaceCreationInterface,
  WorkspaceInterface,
} from "../types/types";

const BASE_URL = `http://${process.env.REACT_APP_CONNECTION_IP}:8000`;

export async function addWorkspace(
  workspace: WorkspaceCreationInterface,
  token: string
) {
  try {
    const newWorkspace: WorkspaceInterface = await postData(
      workspace,
      `/workspaces?token=${token}`
    );
    return newWorkspace;
  } catch (error: any) {
    console.error("Error adding workspace:", error.message);
    throw error;
  }
}

export async function addWorkspaceUsers(
  workspace_id: number,
  users: UserInterface[]
) {
  try {
    await postData(users, `/workspaces/${workspace_id}/users`);
    return { "Message:": "Users added to workspace" };
  } catch (error: any) {
    console.error("Error adding users:", error.message);
    throw error;
  }
}

export async function addTask(task: TaskCreationInterface) {
  try {
    const createdTask: TaskInterface = await postData(task, `/tasks`);
    return createdTask;
  } catch (error: any) {
    console.error("Error adding task:", error.message);
    throw error;
  }
}

async function postData<T>(data: T, url: string) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthorized.");
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `${response.status} - ${response.statusText}: ${errorMessage}`
    );
  }
  return response.json();
}
