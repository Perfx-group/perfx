'use client';

import React, { useState } from 'react';

type LeverageSliderProps = {
  onChange: (leverage: number) => void;
  initialValue?: number;
};

export default function WeekendLeverageSlider({ onChange, initialValue = 1 }: LeverageSliderProps) {
  const [leverage, setLeverage] = useState<number>(initialValue);
  const maxLeverage = 5;
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLeverage = parseInt(e.target.value, 10);
    setLeverage(newLeverage);
    onChange(newLeverage);
  };
  
  const handleButtonClick = (value: number) => {
    setLeverage(value);
    onChange(value);
  };
  
  // Common leverage presets
  const leveragePresets = [1, 2, 5]; // Only up to 5x
  
  // Calculate background gradient for the slider
  const calculateBackground = () => {
    const percentage = (leverage / maxLeverage) * 100;
    return `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
  };

  return (
    <div className="w-full border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Leverage</h3>
        <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-sm">
          <span>{leverage}x</span>
        </div>
      </div>
      
      <div className="mb-4">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={leverage}
          onChange={handleSliderChange}
          style={{ background: calculateBackground() }}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer mb-4"
        />
      </div>
      
      <div className="flex justify-between gap-2">
        {leveragePresets.map((preset) => (
          <button
            key={preset}
            onClick={() => handleButtonClick(preset)}
            className={`flex-1 py-1 text-xs rounded-md transition-colors ${
              leverage === preset
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {preset}x
          </button>
        ))}
      </div>
    </div>
  );
}
