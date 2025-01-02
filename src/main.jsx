import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Components/Login.jsx'
import Home from './Components/Home.jsx'
import Profile from './Components/Profile.jsx'

const router = createBrowserRouter([      // managing different routes
  {
    path: '/',
    element: <App/>,
    children:[
      {
        path:'/',
        element:<Home />
      },
      {
        path:'/login',
        element: <Login />
      },
      {
        path: '/profile',
        element : <Profile />
      }
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>      
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
