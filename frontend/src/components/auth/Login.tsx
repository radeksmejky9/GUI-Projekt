import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [userCredentials, setUserCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          throw new Error("Token has expired");
        }
      } catch (e: any) {
        console.error("Token validation failed:", e);
        localStorage.removeItem("token");
        setError("Session expired. Please log in again.");
      }
      if (token) {
        window.location.href = "/";
      }
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCredentials((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_CONNECTION_IP}:8000/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: userCredentials.username,
            password: userCredentials.password,
          }).toString(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const tokenData = await response.json();
      localStorage.setItem("token", tokenData.access_token);
      window.location.href = "/";
    } catch (error: any) {
      setError(error.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign In
          </h2>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Username */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={userCredentials.username}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="rounded-md shadow-sm -space-y-px mt-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
