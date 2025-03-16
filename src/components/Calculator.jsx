import { useState, useEffect } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Numeric keys (including numpad)
      if (/^\d$/.test(event.key) || (event.keyCode >= 96 && event.keyCode <= 105)) {
        event.preventDefault();
        const digit = event.keyCode >= 96 && event.keyCode <= 105 
          ? String(event.keyCode - 96) // Convert numpad keyCode to digit
          : event.key;
        handleDigit(parseInt(digit, 10));
      }
      
      // Operators
      else if (event.key === '+') {
        event.preventDefault();
        handleOperator('+');
      }
      else if (event.key === '-') {
        event.preventDefault();
        handleOperator('-');
      }
      else if (event.key === '*' || event.key === 'x') {
        event.preventDefault();
        handleOperator('×');
      }
      else if (event.key === '/') {
        event.preventDefault();
        handleOperator('÷');
      }
      
      // Equals
      else if (event.key === '=' || event.key === 'Enter') {
        event.preventDefault();
        handleEquals();
      }
      
      // Decimal point
      else if (event.key === '.' || event.key === ',') {
        event.preventDefault();
        handleDot();
      }
      
      // Backspace
      else if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
      }
      
      // Clear (Escape key)
      else if (event.key === 'Escape') {
        event.preventDefault();
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, prevValue, operation, waitingForOperand]); // Include all dependencies

  const handleDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const handleDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const result = performCalculation();
      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperation(nextOperator);
  };

  const handleBackspace = () => {
    if (waitingForOperand) return;
    
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.substring(0, display.length - 1));
    }
  };

  const handleEquals = () => {
    if (prevValue === null || operation === null) {
      return;
    }

    const result = performCalculation();
    setDisplay(String(result));
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);
    let result;

    switch (operation) {
      case '+':
        result = prevValue + inputValue;
        break;
      case '-':
        result = prevValue - inputValue;
        break;
      case '×':
        result = prevValue * inputValue;
        break;
      case '÷':
        result = prevValue / inputValue;
        break;
      default:
        return inputValue;
    }

    return parseFloat(result.toFixed(8));
  };

  const handlePlusMinus = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  return (
    <div className="w-full max-w-xs">
      <div className="bg-black text-white rounded-xl overflow-hidden shadow-lg">
        {/* Display */}
        <div className="p-2 text-right">
          <div className="text-gray-400 text-xs h-4 font-light">
            {prevValue !== null && operation ? `${prevValue} ${operation}` : ''}
          </div>
          <div className="text-4xl bai-jamjuree-extralight overflow-hidden tracking-wide">{display}</div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-1.5 p-2 calculator-buttons">
          <button onClick={clearAll} className="bg-[#a5a5a5] text-black text-2xl rounded-full">
            AC
          </button>
          <button onClick={handlePlusMinus} className="bg-[#a5a5a5] text-black text-2xl rounded-full">
            +/-
          </button>
          <button onClick={handlePercent} className="bg-[#a5a5a5] text-black text-2xl rounded-full">
            %
          </button>
          <button onClick={() => handleOperator('÷')} className="bg-[#ff9f0a] text-white text-3xl rounded-full">
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
          <button onClick={() => handleOperator('×')} className="bg-[#ff9f0a] text-white text-3xl rounded-full">
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
          <button onClick={() => handleOperator('-')} className="bg-[#ff9f0a] text-white text-3xl rounded-full">
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
          <button onClick={() => handleOperator('+')} className="bg-[#ff9f0a] text-white text-3xl rounded-full">
            +
          </button>
          
          <button onClick={() => handleDigit(0)} className="bg-[#333333] text-white text-3xl rounded-full zero-btn">
            0
          </button>
          <button onClick={handleDot} className="bg-[#333333] text-white text-3xl rounded-full">
            .
          </button>
          <button onClick={handleBackspace} className="bg-[#333333] text-white text-2xl rounded-full">
            ←
          </button>
          <button onClick={handleEquals} className="bg-[#ff9f0a] text-white text-3xl rounded-full">
            =
          </button>
        </div>
      </div>
    </div>
  );
} 