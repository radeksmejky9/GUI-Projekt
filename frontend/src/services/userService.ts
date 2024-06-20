import { User } from '../types/models';

const API_URL = 'http://fastapi:8000/';

export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
};
