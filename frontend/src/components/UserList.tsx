import React, { useEffect, useState } from 'react';
import { User } from '../types/models';

const UserList: React.FC = () => {
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8000/getUsers');
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
        </div>
    );
};

export default UserList;
