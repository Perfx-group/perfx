'use client';

import React, { useState, useEffect } from 'react';
import TradingViewWidget from '../trading-view-widget';
import Orderbook from '@/components/trading/orderbook';
import TradingForm from '@/components/trading/trading-form';
import PositionsTable from '@/components/trading/positions-table';


type TradingInterfaceProps = {
  initialSymbol?: string;
};

export default function TradingInterface({ initialSymbol = 'PYTH:EURUSD' }: TradingInterfaceProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(initialSymbol);
  const [selectedLabel, setSelectedLabel] = useState<string>('EUR/USD');
  const [leverage, setLeverage] = useState<number>(1);
  const [currentPrice, setCurrentPrice] = useState<number>(1.07);

  // Mock current price updates
  useEffect(() => {
    // Generate a base price based on the symbol
    const basePrice = selectedSymbol.includes('EURUSD') 
      ? 1.07 
      : selectedSymbol.includes('USDCHF') 
        ? 0.91 
        : selectedSymbol.includes('GBPUSD')
          ? 1.25
          : selectedSymbol.includes('USDJPY')
            ? 154.5
            : 0.65; // AUDUSD
    
    setCurrentPrice(basePrice);
    
    // Simulate price updates
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 0.001;
        return parseFloat((prev + change).toFixed(5));
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  // Handle symbol change from TradingViewWidget
  const handleSymbolChange = (symbol: string, label: string) => {
    setSelectedSymbol(symbol);
    setSelectedLabel(label);
  };

  // Handle leverage change
  const handleLeverageChange = (newLeverage: number) => {
    setLeverage(newLeverage);
  };

  return (
    <div className="w-full h-full max-w-full p-0 m-0">
      {/* Main trading area - Chart, Orderbook, Trading Form */}
      <div className="grid grid-cols-12 gap-0 mb-0 w-full">
        {/* Left column - Chart (50%) */}
        <div className="col-span-6 h-[600px]">
          <div className="h-full border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden">
            <TradingViewWidget />
          </div>
        </div>
        
        {/* Middle column - Orderbook (20%) */}
        <div className="col-span-2 h-[600px]">
          <Orderbook symbol={selectedLabel} />
        </div>
        
        {/* Right column - Trading Form (30%) */}
        <div className="col-span-4 h-[600px] overflow-y-auto">
          <TradingForm 
            symbol={selectedLabel} 
            currentPrice={currentPrice} 
            onLeverageChange={handleLeverageChange}
            initialLeverage={leverage}
          />
        </div>
      </div>
      
      {/* Positions and Orders Table - Separate row */}
      <div className="w-full h-[300px] mb-0">
        <PositionsTable />
      </div>
    </div>
  );
}
