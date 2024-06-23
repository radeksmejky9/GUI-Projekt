import { useEffect, useState } from "react";
import Modal from "react-modal";
import { UserInterface } from "../../types/types";

interface Props {
  users: UserInterface[];
  getUsers: () => Promise<UserInterface[]>;
  isOpen: boolean;
  onRequestAddUsers: (users: UserInterface[]) => void;
  onRequestClose: () => void;
}

function SelectUserModal({
  users,
  getUsers,
  isOpen,
  onRequestAddUsers,
  onRequestClose,
}: Props) {
  const [allUsers, setAllUsers] = useState<UserInterface[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);

  useEffect(() => {
    if (isOpen) {
      console.log(users);
      getUsers()
        .then((fetchedUsers: UserInterface[]) => {
          setAllUsers(fetchedUsers);
        })
        .catch((error: any) => {
          console.error("Error fetching users:", error);
        });
      users.forEach((user) => {
        toggleUserSelection(user);
      });
    }
  }, [isOpen, getUsers, users]);

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select Users Modal"
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Select Users</h2>
        <div className="overflow-y-auto max-h-[200px]">
          {allUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center mb-2 cursor-pointer rounded-md overflow-hidden ${
                selectedUsers.some(
                  (selectedUser) => selectedUser.id === user.id
                )
                  ? "bg-blue-400"
                  : ""
              }`}
              style={{ maxWidth: "200px" }} // Limiting width
              onClick={() => toggleUserSelection(user)}
            >
              {user.profile_picture_url ? (
                <img
                  src={user.profile_picture_url}
                  alt="User Profile"
                  className="h-8 w-8 rounded-full mr-2"
                />
              ) : (
                <img
                  src={"https://i.imgur.com/V4RclNb.png"}
                  alt="User Profile"
                  className="h-8 w-8 rounded-full mr-2"
                />
              )}
              <span className="ml-2">{user.username}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg"
            onClick={onRequestClose}
          >
            Close
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={() => {
              onRequestAddUsers(selectedUsers);
              onRequestClose();
            }}
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  );

  function toggleUserSelection(user: UserInterface) {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  }
}

export default SelectUserModal;
