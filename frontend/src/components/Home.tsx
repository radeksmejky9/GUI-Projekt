import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jsonwebtoken";
import { addWorkspace, deleteWorkspace, fetchWorkspaces } from "../apis/api";
import TrashIcon from "./icons/TrashIcon";
import { WorkspaceInterface } from "../types/types";
import { useState, useEffect } from "react";
import DeleteWorkspaceModal from "./modals/DeleteWorkspaceModal";

function Home() {
  const [workspaces, setWorkspaces] = useState<WorkspaceInterface[]>([]);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<number | null>(
    null
  );

  const openModal = (workspaceId: number) => {
    setWorkspaceToDelete(workspaceId);
  };

  const closeModal = () => {
    setWorkspaceToDelete(null);
  };

  useEffect(() => {
    fetchWorkspaces()
      .then((data) => setWorkspaces(data))
      .catch((error: any) =>
        console.error("Error fetching cards:", error.message)
      );
  }, []);

  const token = localStorage.getItem("token");

  if (token != null) {
    if (workspaces.length === 0) {
      return (
        <div className="p-4">
          <div className="flex items-center justify-center h-[calc(100vh-150px)]">
            <p className="text-lg text-center">Wow, such empty.</p>
            <p className="text-lg text-center">¯\_(ツ)_/¯</p>
          </div>
          <div className="fixed bottom-0 right-0 m-8">
            <button
              className="px-8 py-6 bg-gray-800 text-center flex text-white rounded-2xl hover:bg-gray-900"
              onClick={() => {
                var token = localStorage.getItem("token");
                if (token)
                  addWorkspace({ name: "New Workspace" }, token).then(
                    (data) => {
                      setWorkspaces([...workspaces, data]);
                    }
                  );
              }}
            >
              Add Workspace
            </button>
          </div>
        </div>
      );
    } else {
      const decodedToken = jwtDecode<JwtPayload>(token);
      return (
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-6">My Workspaces</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold break-all overflow-y-auto max-h-[100px]">
                    {workspace.name}
                  </h2>
                  {decodedToken.id === workspace.owner_id && (
                    <div>
                      <button
                        className="top-2 right-2 p-1 stroke-red-500 border-2 border-red-500 rounded-full hover:bg-red-600 hover:border-red-600 hover:stroke-white transition-colors duration-200 ease-in-out"
                        onClick={() => openModal(workspace.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  )}
                </div>
                <a
                  href={`/workspace/${workspace.id}`}
                  className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                >
                  View Workspace
                </a>
              </div>
            ))}
          </div>

          {workspaceToDelete && (
            <DeleteWorkspaceModal
              workspace={workspaces.find((w) => w.id === workspaceToDelete)}
              isOpen={true}
              onRequestDelete={removeWorkspace}
              onRequestClose={closeModal}
            />
          )}

          <div className="fixed bottom-0 right-0 m-8">
            <button
              className="px-8 py-6 bg-gray-800 text-center flex text-white rounded-2xl hover:bg-gray-900"
              onClick={() => {
                var token = localStorage.getItem("token");
                if (token)
                  addWorkspace({ name: "New Workspace" }, token).then(
                    (data) => {
                      setWorkspaces([...workspaces, data]);
                    }
                  );
              }}
            >
              Add Workspace
            </button>
          </div>
        </div>
      );
    }
  } else
    return (
      <div className="p-4 text-red-500 font-bold text-center">
        Please login to use this feature!
      </div>
    );

  function removeWorkspace(workspace: WorkspaceInterface) {
    deleteWorkspace(workspace.id).then(() => {
      setWorkspaces(workspaces.filter((w) => w.id !== workspace.id));
      closeModal();
    });
  }
}

export default Home;
