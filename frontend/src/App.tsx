import React from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/UserList";
import Layout from "./components/Layout";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "*", element: <div>Not Found</div> },
      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
