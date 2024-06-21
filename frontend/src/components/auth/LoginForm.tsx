import React, { useState } from 'react';

const LoginForm: React.FC = () => {
    const [userCredentials, setUserCredentials] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null); // Use null instead of empty string for better type checking

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: userCredentials.username,
                    password: userCredentials.password,
                }).toString(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed'); // Adjust this as per your API response structure
            }

            const tokenData = await response.json();
            localStorage.setItem('token', tokenData.access_token);
            window.location.href = '/dashboard';
        } catch (error: any) {
            setError(error.message || 'Login failed'); // Fallback error message
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={userCredentials.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={userCredentials.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
