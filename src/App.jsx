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
import ManageEvents from './pages/manage/ManageEvents.jsx';
import CreateEvent from './pages/manage/createEvent.jsx';
import EditEvent from './pages/manage/EditEvent.jsx';
import SingleEvent from './pages/events/SingleEvent.jsx';
import Players from './pages/events/Players.jsx';
import PlayerEvents from './pages/PlayerEvents.jsx';


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
            element: <RequireAuth allowedRoles={[2]} />,
            children: [
              {
                path: "player-events",
                children: [
                  {
                    index: true,
                    element: <PlayerEvents />,
                  },
                ]

              },
            ]
          },
          {
            path: "events",
            children: [
              {
                index: true,
                element: <Events />,
              },
              {
                path: ':eventId',
                children: [
                  {
                    index: true,
                    element: <SingleEvent />,
                  },
                  {
                    path: ':eventId',
                    element: <Players />,
                  },
                ]
              },
            ]
          },
          {
            element: <RequireAuth allowedRoles={[0, 1]} />,
            children: [
              {
                path: "manage",
                children: [
                  {
                    index: true,
                    element: <Manage />,
                  },
                  {
                    path: "events",
                    children: [
                      {
                        index: true,
                        element: <ManageEvents />
                      },
                      {
                        path: "create",
                        element: <CreateEvent />
                      },
                      {
                        path: ":eventId",
                        element: <EditEvent />,
                      },
                    ]
                  }
                ]

              },
            ]
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
    ]
  },

]);


function App() {

  return (
    <div className='font-sans min-h-screen'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
