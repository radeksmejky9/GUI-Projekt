import React, { useState, useEffect } from 'react';

const Login: React.FC = () => {
    const [userCredentials, setUserCredentials] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem('token');
    useEffect(() => {
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('token');
                    throw new Error('Token has expired');
                }
            } catch (err) {
                console.error('Token validation failed:', err);
                localStorage.removeItem('token');
                setError('Session expired. Please log in again.');
            }
        }
    }, [token]);
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
                throw new Error(errorData.detail || 'Login failed');
            }

            const tokenData = await response.json();
            localStorage.setItem('token', tokenData.access_token);
            window.location.href = '/dashboard';
        } catch (error: any) {
            setError(error.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Login</h2>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {/* Username */}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={userCredentials.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="rounded-md shadow-sm -space-y-px mt-4">
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={userCredentials.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
function jwtDecode(token: string): any {
    throw new Error('Function not implemented.');
}

