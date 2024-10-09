import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/HomePage";
import RoomsPage from "../pages/RoomsPage";
import SingleRoomPage from "../pages/SingleRoomPage";
import AuthPage from "../pages/AuthPage";
import Dashboard from "../pages/dashboard/Dashboard";
import Users from "../pages/dashboard/Users";
import Rooms from "../pages/dashboard/Rooms";
import Bookings from "../pages/dashboard/Bookings";
import ReportsDashboard from "../pages/dashboard/Report";
import ProfilePage from "../pages/Profile";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/rooms",
        element: <RoomsPage />
    },
    {
        path: '/rooms/:roomId',
        element: <SingleRoomPage />
    },
    {
        path: '/auth',
        element: <AuthPage />
    },
    {
        path: '/dashboard',
        children: [
            {
                path: '',
                element: <Dashboard />
            },
            {
                path: 'users',
                element: <Users />
            },
            {
                path: 'rooms',
                element: <Rooms />
            },
            {
                path: 'bookings',
                element: <Bookings />
            },
            {
                path: 'reports',
                element: <ReportsDashboard />
            }
        ]
    },
    {
        path: '/profile',
        element: <ProfilePage />
    }
])