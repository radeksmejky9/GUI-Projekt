import {
  TaskInterface,
  UserInterface,
  WorkspaceInterface,
} from "../types/types";

const BASE_URL = `http://${process.env.REACT_APP_CONNECTION_IP}:8000`;

export async function fetchUsers() {
  try {
    const users: UserInterface[] = await fetchData("/users");
    return users;
  } catch (error: any) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
}

export async function fetchWorkspaceUsers(workspace_id: number) {
  try {
    const users: UserInterface[] = await fetchData(
      `/workspaces/${workspace_id}/users`
    );
    return users;
  } catch (error: any) {
    console.error("Error fetching workspace users:", error.message);
    throw error;
  }
}

export async function fetchTasks(workspace_id: number) {
  try {
    const tasks: TaskInterface[] = await fetchData(
      `/workspaces/${workspace_id}/tasks`
    );
    return tasks;
  } catch (error: any) {
    console.error("Error fetching tasks:", error.message);
    throw error;
  }
}

export async function fetchWorkspaces() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthorized.");
  }

  try {
    const [ownedWorkspaces, memberWorkspaces] = await Promise.all([
      fetchData(`/ownedworkspaces?token=${token}`),
      fetchData(`/memberworkspaces?token=${token}`),
    ]);
    return [...ownedWorkspaces, ...memberWorkspaces] as WorkspaceInterface[];
  } catch (error: any) {
    console.error("Error fetching workspaces:", error.message);
    throw error;
  }
}

export async function fetchWorkspace(workspace_id: number) {
  try {
    const workspace = await fetchData(`/workspaces/${workspace_id}`);
    return workspace as WorkspaceInterface;
  } catch (error: any) {
    console.error("Error fetching workspace:", error.message);
    throw error;
  }
}

async function fetchData(url: string) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthorized.");
  }

  const response = await fetch(`${BASE_URL}${url}`);
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
