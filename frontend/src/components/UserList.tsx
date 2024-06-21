import React, { useEffect, useState } from "react";
import { User } from "../types/models";
import Workspace from "./Workspace";

const UserList: React.FC = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const apiUrl = process.env.REACT_APP_CONNECTION_IP;
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://${apiUrl}:8000/getUsers`);
        const users = (await response.json()) as User[];
        setUsers(users);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (error) {
    return <div>Something went wrong.</div>;
  }
  if (isLoading) {
    return <div>Something went wrong.</div>;
  }

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
      <Workspace title={"My Workspace"} />
    </div>
  );
};

export default UserList;
