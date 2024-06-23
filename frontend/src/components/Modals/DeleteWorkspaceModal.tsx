import Modal from "react-modal";
import { WorkspaceInterface } from "../../types/types";

interface Props {
  workspace?: WorkspaceInterface;
  isOpen: boolean;
  onRequestDelete: (workspace: WorkspaceInterface) => void;
  onRequestClose: () => void;
}

function DeleteWorkspaceModal({
  workspace,
  isOpen,
  onRequestClose,
  onRequestDelete,
}: Props) {
  if (!workspace) {
    return (
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Delete Workspace Modal"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
      >
        <div className="p-6 bg-white rounded-lg shadow-lg w-96">
          <div className="overflow-y-auto max-h-[200px]">
            No workspace found.
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg"
              onClick={onRequestClose}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  } else {
    return (
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Delete Workspace Modal"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
      >
        <div className="p-6 bg-white rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">
            Delete{" "}
            <span className="font-bold mx-1 text-red-600">
              {workspace.name}
            </span>
          </h2>
          <div className="overflow-y-auto max-h-[200px]">
            Are you sure you want to delete this workspace?{" "}
            <span className="font-bold mx-1 text-red-600">
              This action is irreversible.
            </span>
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg"
              onClick={onRequestClose}
            >
              Close
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              onClick={() => onRequestDelete(workspace)}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default DeleteWorkspaceModal;
