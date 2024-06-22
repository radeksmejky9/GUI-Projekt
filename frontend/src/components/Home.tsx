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

  return (
    <div className="p-4">
      <button
        onClick={() => {
          var token = localStorage.getItem("token");
          if (token) addWorkspace({ name: "New Workspace" }, token);
        }}
      >
        +
      </button>
      <h1 className="text-3xl font-bold mb-6">My Workspaces</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl mb-4 font-semibold">{workspace.name}</h2>
            <a
              href={`/workspace/${workspace.id}`}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              View Workspace
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
