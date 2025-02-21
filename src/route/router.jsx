import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import AuthenticationPage from "../pages/AuthenticationPage";
import AddTask from "../pages/dashboard/AddTask";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "./PrivateRoute";
import AddTaskForm from "../pages/dashboard/AddTaskForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <AuthenticationPage />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "addTask",
        element: <AddTask />,
      },
      {
        path: "addTaskForm",
        element: <AddTaskForm />,
      },
    ]
  }
]);
