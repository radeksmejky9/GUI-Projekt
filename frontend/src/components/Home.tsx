import { addWorkspace, fetchWorkspaces } from "../apis/api";
import { WorkspaceInterface } from "../types/types";
import { useState, useEffect } from "react";

function Home() {
  const [workspaces, setWorkspaces] = useState<WorkspaceInterface[]>([]);
  useEffect(() => {
    fetchWorkspaces()
      .then((data) => setWorkspaces(data))
      .catch((error: any) =>
        console.error("Error fetching cards:", error.message)
      );
  }, []);
  if (localStorage.getItem("token") != null)
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">My Workspaces</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl mb-4 font-semibold break-all overflow-y-auto max-h-[100px]">
                {workspace.name}
              </h2>
              <a
                href={`/workspace/${workspace.id}`}
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                View Workspace
              </a>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 right-0 m-8">
          <button
            className="px-8 py-6 bg-gray-800 text-center flex text-white rounded-2xl hover:bg-gray-900"
            onClick={() => {
              var token = localStorage.getItem("token");
              if (token)
                addWorkspace({ name: "New Workspace" }, token).then((data) => {
                  setWorkspaces([...workspaces, data]);
                });
            }}
          >
            Add Workspace
          </button>
        </div>
      </div>
    );
  else
    return (
      <div className="p-4 text-red-500 font-bold">
        Please login to use this feature!
      </div>
    );
}

export default Home;
