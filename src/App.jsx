import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'


//Routes
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import NotFound from './pages/NotFound.jsx';
import Landing from './pages/Landing.jsx';
import Profile from './pages/profile/Profile.jsx'
import UserAccountInfo from './pages/profile/UserAccountInfo.jsx';
import Promotions from './pages/profile/Promotions.jsx';
import GodEvents from './pages/profile/GodEvents.jsx';
import Learning from './pages/Learning.jsx';
import Login from './pages/Login.jsx';
import OldLogin from './pages/OldLogin.jsx';
import Signup from './pages/Signup.jsx';
import Manage from './pages/manage/Manage.jsx';
import Events from './pages/events/Events.jsx';
import RequireAuth from './layouts/RequireAuth.jsx';
import Unauthorized from './pages/Unauthorized.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <NotFound />,
  },
  {
    path: "/mafia",
    children: [
      {
        index: true,
        element: <Navigate to="/mafia/profile" replace />,
      },

      {
        element: <AuthLayout />,
        children: [
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
            path: "unauthorized",
            element: <Unauthorized />,
          },
        ]
      },

      // Routes that require user authentication to access

      {
        element: <MainLayout />,
        children: [
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
            path: 'profile',
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
            ]
          },
          {
            element: <RequireAuth allowedRoles={[0, 1]} />,
            children: [
              {
                path: 'god-events',
                element: <GodEvents />
              },
            ]
          },
        ]
      },
    ]
  },

]);


function App() {

  return (
    <div className='font-sans min-h-screen bg-gradient-main'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
