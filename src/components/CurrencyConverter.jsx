import { useState, useEffect } from 'react';
import axios from 'axios';
import CurrencyGraph from './CurrencyGraph';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BDT');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [result, setResult] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayValue, setDisplayValue] = useState('1');
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Fetch available currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://open.er-api.com/v6/latest/USD');
        const currencyList = Object.keys(response.data.rates);
        setCurrencies(currencyList);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch currencies. Please try again later.');
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  // Fetch exchange rate when currencies change
  useEffect(() => {
    const getExchangeRate = async () => {
      if (fromCurrency === toCurrency) {
        setExchangeRate(1);
        return;
      }

      try {
        const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        setExchangeRate(response.data.rates[toCurrency]);
      } catch (err) {
        setError('Failed to fetch exchange rate. Please try again later.');
      }
    };

    getExchangeRate();
  }, [fromCurrency, toCurrency]);

  // Calculate result when amount or exchange rate changes
  useEffect(() => {
    if (exchangeRate !== null) {
      const calculatedResult = (parseFloat(amount) * exchangeRate).toFixed(4);
      setResult(calculatedResult);
    }
  }, [amount, exchangeRate]);

  // Add keyboard event listener for currency converter
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only process keyboard events when on the currency page
      if (window.location.pathname !== '/currency') return;
      
      // Numeric keys (including numpad)
      if (/^\d$/.test(event.key) || (event.keyCode >= 96 && event.keyCode <= 105)) {
        event.preventDefault();
        const digit = event.keyCode >= 96 && event.keyCode <= 105 
          ? String(event.keyCode - 96) // Convert numpad keyCode to digit
          : event.key;
        handleDigit(parseInt(digit, 10));
      }
      
      // Decimal point
      else if (event.key === '.' || event.key === ',') {
        event.preventDefault();
        handleDot();
      }
      
      // Backspace - clear last digit
      else if (event.key === 'Backspace') {
        event.preventDefault();
        if (displayValue.length === 1) {
          setDisplayValue('0');
          setAmount('0');
        } else {
          const newValue = displayValue.substring(0, displayValue.length - 1);
          setDisplayValue(newValue);
          setAmount(newValue);
        }
      }
      
      // Clear (Escape key)
      else if (event.key === 'Escape') {
        event.preventDefault();
        clearAll();
      }
      
      // Plus/Minus with the numpad +/- keys
      else if (event.key === '+' || event.key === '-') {
        event.preventDefault();
        handlePlusMinus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [displayValue, waitingForOperand]);

  const handleDigit = (digit) => {
    if (waitingForOperand) {
      setDisplayValue(String(digit));
      setAmount(String(digit));
      setWaitingForOperand(false);
    } else {
      const newValue = displayValue === '0' ? String(digit) : displayValue + digit;
      setDisplayValue(newValue);
      setAmount(newValue);
    }
  };

  const handleDot = () => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setAmount('0.');
      setWaitingForOperand(false);
    } else if (displayValue.indexOf('.') === -1) {
      setDisplayValue(displayValue + '.');
      setAmount(displayValue + '.');
    }
  };

  const clearAll = () => {
    setDisplayValue('0');
    setAmount('0');
    setWaitingForOperand(false);
  };

  const handlePlusMinus = () => {
    const value = parseFloat(displayValue);
    const newValue = String(-value);
    setDisplayValue(newValue);
    setAmount(newValue);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Inside the CurrencyConverter component, add a console.log to check current values
  console.log("CurrencyConverter render - currencies:", fromCurrency, toCurrency);

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-4 text-center">
        <div className="bg-black text-white rounded-2xl overflow-hidden shadow-lg p-6">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#f59e0b] hover:bg-[#f59e0b]/80 text-white font-bold py-2 px-4 rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col-reverse md:flex-row gap-4">
      {/* Currency Graph - now on the left on desktop */}
      <div className="w-full md:w-1/2">
        <CurrencyGraph 
          fromCurrency={fromCurrency} 
          toCurrency={toCurrency} 
        />
      </div>
      
      {/* Currency Converter - now on the right on desktop */}
      <div className="w-full md:w-1/2">
        <div className="bg-black text-white rounded-xl overflow-hidden shadow-lg">
          {/* Display */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <select 
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="bg-[#333333] text-white p-2 text-sm rounded-lg w-24 font-medium"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
              
              <button 
                onClick={handleSwapCurrencies}
                className="bg-[#ff9f0a] text-white p-1 rounded-full w-10 h-10 flex items-center justify-center currency-swap-btn"
              >
                <span className="text-sm font-bold transform rotate-90">⇌</span>
              </button>
              
              <select 
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="bg-[#333333] text-white p-2 text-sm rounded-lg w-24 font-medium"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            
            <div className="text-right">
              <div className="text-gray-400 text-xs h-4 font-light">
                {amount} {fromCurrency} =
              </div>
              <div className="text-4xl bai-jamjuree-extralight overflow-hidden tracking-wide">
                {result} {toCurrency}
              </div>
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-1.5 p-2 currency-buttons">
            <button onClick={clearAll} className="bg-[#a5a5a5] text-black text-2xl rounded-full">
              AC
            </button>
            <button onClick={handlePlusMinus} className="bg-[#a5a5a5] text-black text-2xl rounded-full">
              +/-
            </button>
            <button className="bg-[#a5a5a5] text-black text-2xl rounded-full opacity-50">
              %
            </button>
            <button className="bg-[#ff9f0a] text-white text-3xl rounded-full opacity-50">
              ÷
            </button>
            
            <button onClick={() => handleDigit(7)} className="bg-[#333333] text-white text-3xl rounded-full">
              7
            </button>
            <button onClick={() => handleDigit(8)} className="bg-[#333333] text-white text-3xl rounded-full">
              8
            </button>
            <button onClick={() => handleDigit(9)} className="bg-[#333333] text-white text-3xl rounded-full">
              9
            </button>
            <button className="bg-[#ff9f0a] text-white text-3xl rounded-full opacity-50">
              ×
            </button>
            
            <button onClick={() => handleDigit(4)} className="bg-[#333333] text-white text-3xl rounded-full">
              4
            </button>
            <button onClick={() => handleDigit(5)} className="bg-[#333333] text-white text-3xl rounded-full">
              5
            </button>
            <button onClick={() => handleDigit(6)} className="bg-[#333333] text-white text-3xl rounded-full">
              6
            </button>
            <button className="bg-[#ff9f0a] text-white text-3xl rounded-full opacity-50">
              -
            </button>
            
            <button onClick={() => handleDigit(1)} className="bg-[#333333] text-white text-3xl rounded-full">
              1
            </button>
            <button onClick={() => handleDigit(2)} className="bg-[#333333] text-white text-3xl rounded-full">
              2
            </button>
            <button onClick={() => handleDigit(3)} className="bg-[#333333] text-white text-3xl rounded-full">
              3
            </button>
            <button className="bg-[#ff9f0a] text-white text-3xl rounded-full opacity-50">
              +
            </button>
            
            <button onClick={() => handleDigit(0)} className="bg-[#333333] text-white text-3xl rounded-full zero-btn">
              0
            </button>
            <button onClick={handleDot} className="bg-[#333333] text-white text-3xl rounded-full">
              .
            </button>
            <button className="bg-[#ff9f0a] text-white text-3xl rounded-full opacity-50">
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 