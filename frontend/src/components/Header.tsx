import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';


const Header: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode<any>(token);

                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('token');
                } else {
                    setUsername(decodedToken.username);
                }
            } catch (err) {
                console.error('Token validation failed:', err);
                localStorage.removeItem('token');
            }
        }
    }, []);

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <a href="/" className="text-white text-lg font-bold">Page Name</a>
                    <a href="/workspaces" className="text-gray-300 hover:text-white">Workspaces</a>
                    <a href="/people" className="text-gray-300 hover:text-white">People</a>
                </div>
                <div>
                    {username ? (
                        <span className="text-gray-300">Welcome, {username}</span>
                    ) : (
                        <>
                            <a href="/login" className="text-gray-300 hover:text-white mr-4">Login</a>
                            <a href="/register" className="text-gray-300 hover:text-white">Register</a>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
