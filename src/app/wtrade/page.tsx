/*'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import TradingFormWeekend from '@/components/trading/trading-form-weekend';


export default function WeekendTradingPage() {
  const [leverage, setLeverage] = useState<number>(1);
  const [markPrice, setMarkPrice] = useState<number>(1.07321);
  const [lastOraclePrice, setLastOraclePrice] = useState<number>(1.07000);
  const [fundingRate, setFundingRate] = useState<number>(0.024); // 2.4% hourly
  const [openInterest, setOpenInterest] = useState<number>(152000);
  const [countdown, setCountdown] = useState<string>('08h 23m');

  // Simulated countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Just simulating a dummy countdown here
      setCountdown('08h 22m');
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const priceDeviation = ((markPrice - lastOraclePrice) / lastOraclePrice) * 100;
  const deviationColor = Math.abs(priceDeviation) < 0.25 ? 'text-green-500' : Math.abs(priceDeviation) < 1 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700 px-4 py-3 rounded-md">
        <strong>⚠️ Weekend Mode Active</strong>
        <p className="text-sm mt-1">
          Oracles are frozen. You're trading with mark price only. Leverage is capped at 5x. Liquidations are disabled. Prices are maintained via funding rate incentives.
        </p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-800">
          <div className="text-gray-500">Mark Price</div>
          <div className="font-medium">{markPrice.toFixed(5)}</div>
        </div>
        <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-800">
          <div className="text-gray-500">Last Oracle Price</div>
          <div className="font-medium">{lastOraclePrice.toFixed(5)}</div>
        </div>
        <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-800">
          <div className="text-gray-500">Funding Rate</div>
          <div className="font-medium">{(fundingRate * 100).toFixed(2)}% / hour</div>
        </div>
        <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-800">
          <div className="text-gray-500">Open Interest</div>
          <div className="font-medium">{openInterest.toLocaleString()} USDC</div>
        </div>
      </div>

     
      <div className={`text-center text-sm font-medium ${deviationColor}`}>
        Price deviation from oracle: {priceDeviation.toFixed(2)}%
      </div>

      
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        Oracle resumes in: {countdown}
      </div>

      
      <TradingFormWeekend
        symbol="EUR/USD"
        currentPrice={markPrice}
        onLeverageChange={(val) => setLeverage(val)}
        initialLeverage={1}
      />
      <div className="text-center text-gray-400 text-sm mt-8">
        📉 Chart snapshot unavailable — live market chart resumes on Monday 5PM EST
      </div>
    </div>
  );
}
*/

'use client';

import WeekendTradingInterface from '@/components/trading/trading-interface-weekend';

export default function WeekendTradePage() {
  return (
    
    <div className="w-full h-full max-w-full p-0 m-0 overflow-hidden">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700 px-4 py-3 rounded-md">
        <strong>⚠️ Weekend Mode Active</strong>
        <p className="text-sm mt-1">
          Oracles are frozen. You're trading with mark price only. Leverage is capped at 5x. Prices are maintained via funding rate incentives.
        </p>
      </div>
      <WeekendTradingInterface />
    </div>
  );
}
