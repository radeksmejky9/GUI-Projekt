const BASE_URL = `http://${process.env.REACT_APP_CONNECTION_IP}:8000`;

export async function deleteWorkspace(workspace_id: number) {
  try {
    await deleteData(`/workspaces/${workspace_id}`);
    return { "Message:": "Workspace deleted succesfully." };
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function deleteTask(task_id: number) {
  try {
    await deleteData(`/tasks/${task_id}`);
    return { "Message:": "Task deleted succesfully." };
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function deleteUsersFromWorkspace(workspace_id: number) {
  try {
    await deleteData(`/workspaces/${workspace_id}/users`);
    return { "Message:": "Users from workspace deleted succesfully." };
  } catch (error: any) {
    console.error(error.message);
  }
}

async function deleteData(url: string) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthorized.");
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
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
