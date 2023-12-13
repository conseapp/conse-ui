import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


//Routes
import MainLayout from './layouts/MainLayout.jsx';
import NotFound from './pages/NotFound.jsx';
import Landing from './pages/Landing.jsx';
import Profile from './pages/Profile/Profile.jsx';
import UserAccountInfo from './pages/profile/UserAccountInfo.jsx';
import Promotions from './pages/profile/Promotions.jsx';
import ProfileLayout from './layouts/ProfileLayout.jsx';
import GodEvents from './pages/profile/GodEvents.jsx';
import Learning from './pages/Learning.jsx';
import Login from './pages/Login.jsx';
import OldLogin from './pages/OldLogin.jsx';
import Signup from './pages/Signup.jsx';
import Manage from './pages/manage/Manage.jsx';
import Events from './pages/events/Events.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <NotFound />,
  },
  {
    path: "/mafia",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Profile />,
      },
      {
        path: "learning",
        element: <Learning />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "manage",
        element: <Manage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "old-login",
        element: <OldLogin />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: 'profile',
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <Profile />
          },
          {
            path: 'user-acount-info',
            element: <UserAccountInfo />
          },
          {
            path: 'promotions',
            element: <Promotions />
          },
          {
            path: 'god-events',
            element: <GodEvents />
          },
        ]
      },
    ]
  },
]);


function App() {

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
