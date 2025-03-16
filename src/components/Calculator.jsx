import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearAll = () => {
    setDisplay('0');
    setOperation(null);
    setPrevValue(null);
    setWaitingForOperand(false);
  };

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
      const result = performOperation(prevValue, inputValue, operation);
      setDisplay(String(result));
      setPrevValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperator);
  };

  const performOperation = (x, y, op) => {
    switch (op) {
      case '+': return x + y;
      case '-': return x - y;
      case '×': return x * y;
      case '÷': return x / y;
      case '%': return x % y;
      default: return y;
    }
  };

  const handleEquals = () => {
    if (prevValue === null || operation === null) return;

    const inputValue = parseFloat(display);
    const result = performOperation(prevValue, inputValue, operation);
    
    setDisplay(String(result));
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
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
          <button onClick={handleEquals} className="bg-[#ff9f0a] text-white text-3xl rounded-full">
            =
          </button>
        </div>
      </div>
    </div>
  );
} 