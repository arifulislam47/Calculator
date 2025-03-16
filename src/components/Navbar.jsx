import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isCalculator = location.pathname === '/' || location.pathname === '/calculator';
  const isCurrencyConverter = location.pathname === '/currency';

  return (
    <div className="flex justify-center space-x-1 mt-5">
      <Link
        to="/calculator"
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          isCalculator
            ? 'bg-white text-black'
            : 'bg-[#1e293b] text-gray-300 hover:bg-[#334155]'
        }`}
      >
        Calculator
      </Link>
      <Link
        to="/currency"
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          isCurrencyConverter
            ? 'bg-white text-black'
            : 'bg-[#1e293b] text-gray-300 hover:bg-[#334155]'
        }`}
      >
        Currency
      </Link>
    </div>
  );
} 