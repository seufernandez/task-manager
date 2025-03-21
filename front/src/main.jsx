import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import { UserProvider } from './hooks/useUser';
import { PrivateRoute } from './components/PrivateRoute';
import SingleTaskPage from './pages/SingleTaskPage';
import { Toaster } from 'react-hot-toast';
import CreateTask from './pages/CreateTask';
import Register from './pages/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/tasks',
    element: <PrivateRoute element={<Tasks />} />,
  },
  {
    path: '/task/:id',
    element: <PrivateRoute element={<SingleTaskPage />} />,
  },
  {
    path: '/create-task',
    element: <PrivateRoute element={<CreateTask />} />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
    <Toaster position="top-right" duration={5000}/>
      <RouterProvider router={router}/>
    </UserProvider>
  </React.StrictMode>,
);
