import React, { useState } from 'react';

const SignUpForm: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        profile_picture_url: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(JSON.stringify(newUser))
        try {
            const response = await fetch('http://localhost:8000/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <div>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={newUser.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={newUser.email}
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
                    value={newUser.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="first_name">First Name</label>
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={newUser.first_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="last_name">Last Name</label>
                <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={newUser.last_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="profile_picture_url">Profile Picture URL</label>
                <input
                    type="text"
                    id="profile_picture_url"
                    name="profile_picture_url"
                    value={newUser.profile_picture_url}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Sign Up</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default SignUpForm;
