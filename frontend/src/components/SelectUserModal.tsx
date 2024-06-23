import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { UserInterface } from "../types/types";

interface Props {
  getUsers: () => Promise<UserInterface[]>;
  isOpen: boolean;
  onAfterOpen: () => void;
  onRequestClose: () => void;
}

function SelectUserModal({
  getUsers,
  isOpen,
  onAfterOpen,
  onRequestClose,
}: Props) {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);

  useEffect(() => {
    if (isOpen) {
      getUsers()
        .then((fetchedUsers: UserInterface[]) => {
          console.log(fetchedUsers);
          setUsers(fetchedUsers);
        })
        .catch((error: any) => {
          console.error("Error fetching users:", error);
          // Handle error if needed
        });
    }
  }, [isOpen, getUsers]);

  const toggleUserSelection = (user: UserInterface) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select Users Modal"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Select Users</h2>
        <div>
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center mb-2 cursor-pointer ${
                selectedUsers.includes(user) ? "bg-blue-200" : ""
              }`}
              onClick={() => toggleUserSelection(user)}
            >
              {user.profile_picture_url ? (
                <img
                  src={user.profile_picture_url}
                  className="h-8 w-8 rounded-full mr-2"
                />
              ) : (
                <img
                  src={"https://i.imgur.com/V4RclNb.png"}
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
              console.log("Selected Users: ", selectedUsers);
              onRequestClose();
            }}
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default SelectUserModal;
