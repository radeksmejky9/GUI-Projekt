import {
  TaskCreationInterface,
  WorkspaceCreationInterface,
} from "../types/types";

const BASE_URL = `http://${process.env.REACT_APP_CONNECTION_IP}:8000`;

export async function updateTask(task: TaskCreationInterface, task_id: number) {
  try {
    await putData(task, `/tasks/${task_id}`);
    return { "Message:": "Task updated succesfully." };
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
    await putData(workspace, `/workspaces/${workspace_id}`);
    return { "Message:": "Workspace updated succesfully." };
  } catch (error: any) {
    console.error("Error updating task:", error.message);
    throw error;
  }
}

async function putData<T>(data: T, url: string) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthorized.");
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method: "PUT",
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
