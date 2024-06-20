import { User } from "../types/models";

export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`http://localhost:8000/getUsers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users data");
    }

    return await response.json();
};
