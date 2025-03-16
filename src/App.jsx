import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import Calculator from './components/Calculator';
import CurrencyConverter from './components/CurrencyConverter';
import Navbar from './components/Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-xl bai mt-5 font-semibold mb-2 tracking-wide">Smart Calculator</h1>
      <Navbar />
      <div className="flex-1 flex items-center justify-center w-full max-w-5xl px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/calculator" replace />,
      },
      {
        path: 'calculator',
        element: <Calculator />,
      },
      {
        path: 'currency',
        element: <CurrencyConverter />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
