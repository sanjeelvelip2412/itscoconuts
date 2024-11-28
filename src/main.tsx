import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Hero from './components/Hero';
import BuyerShop from './pages/BuyerShop';
import SellerDashboard from './pages/SellerDashboard';
import MyOrders from './pages/MyOrders';
import SellerOrders from './pages/SellerOrders';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Hero /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/signin', element: <SignIn /> },
      { path: '/shop', element: <BuyerShop /> },
      { path: '/seller-dashboard', element: <SellerDashboard /> },
      { path: '/my-orders', element: <MyOrders /> },
      { path: '/seller-orders', element: <SellerOrders /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);