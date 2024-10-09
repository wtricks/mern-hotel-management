// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { ToastContainer } from 'react-toastify'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'

import { router } from './routes'
import { store } from './store'

import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer />
    </Provider>
  // </StrictMode>,
)
