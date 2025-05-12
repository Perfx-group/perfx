'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

type OrderbookEntry = {
  price: number;
  size: number;
  total: number;
};

type OrderbookProps = {
  symbol: string;
};

export default function Orderbook({ symbol }: OrderbookProps) {
  const { theme } = useTheme();
  const [asks, setAsks] = useState<OrderbookEntry[]>([]);
  const [bids, setBids] = useState<OrderbookEntry[]>([]);
  const [spread, setSpread] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data generation for demonstration
  useEffect(() => {
    // This would be replaced with actual API calls in production
    const generateMockOrderbook = () => {
      setLoading(true);
      
      // Generate a base price based on the symbol
      const basePrice = symbol.includes('EUR') ? 1.07 : symbol.includes('USD') ? 0.91 : 1.25;
      
      // Generate mock asks (sell orders) - higher than base price
      const mockAsks: OrderbookEntry[] = [];
      let askTotal = 0;
      for (let i = 0; i < 15; i++) {
        const price = basePrice + (i * 0.0001) + (Math.random() * 0.00005);
        const size = Math.round(Math.random() * 10000) / 100;
        askTotal += size;
        mockAsks.push({
          price: parseFloat(price.toFixed(5)),
          size,
          total: parseFloat(askTotal.toFixed(2))
        });
      }
      
      // Generate mock bids (buy orders) - lower than base price
      const mockBids: OrderbookEntry[] = [];
      let bidTotal = 0;
      for (let i = 0; i < 15; i++) {
        const price = basePrice - (i * 0.0001) - (Math.random() * 0.00005);
        const size = Math.round(Math.random() * 10000) / 100;
        bidTotal += size;
        mockBids.push({
          price: parseFloat(price.toFixed(5)),
          size,
          total: parseFloat(bidTotal.toFixed(2))
        });
      }
      
      // Sort asks ascending and bids descending by price
      mockAsks.sort((a, b) => a.price - b.price);
      mockBids.sort((a, b) => b.price - a.price);
      
      // Calculate spread
      const lowestAsk = mockAsks[0].price;
      const highestBid = mockBids[0].price;
      const calculatedSpread = parseFloat((lowestAsk - highestBid).toFixed(5));
      
      setAsks(mockAsks);
      setBids(mockBids);
      setSpread(calculatedSpread);
      setLoading(false);
    };
    
    generateMockOrderbook();
    
    // Simulate periodic updates
    const interval = setInterval(() => {
      generateMockOrderbook();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [symbol]);

  // Format price with appropriate decimal places
  const formatPrice = (price: number) => {
    return price.toFixed(5);
  };

  // Format size with appropriate decimal places
  const formatSize = (size: number) => {
    return size.toFixed(2);
  };

  // Calculate depth visualization percentage
  const getDepthPercentage = (total: number, maxTotal: number) => {
    return (total / maxTotal) * 100;
  };

  const maxBidTotal = bids.length > 0 ? bids[bids.length - 1].total : 0;
  const maxAskTotal = asks.length > 0 ? asks[asks.length - 1].total : 0;

  return (
    <div className="w-full h-full flex flex-col border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden">
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-medium">Orderbook</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Spread: {spread.toFixed(5)} ({((spread / (asks[0]?.price || 1)) * 100).toFixed(3)}%)
        </div>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100%-40px)] text-xs">
          {/* Asks (Sell Orders) */}
          <div className="h-1/2 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                <tr className="text-gray-500 dark:text-gray-400">
                  <th className="px-2 py-1 text-left">Price</th>
                  <th className="px-2 py-1 text-right">Size</th>
                  <th className="px-2 py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {asks.map((ask, index) => (
                  <tr key={`ask-${index}`} className="relative">
                    <td className="px-2 py-1 text-left text-red-500">
                      {formatPrice(ask.price)}
                    </td>
                    <td className="px-2 py-1 text-right">{formatSize(ask.size)}</td>
                    <td className="px-2 py-1 text-right">{formatSize(ask.total)}</td>
                    <td 
                      className="absolute top-0 right-0 h-full bg-red-100 dark:bg-red-900/20 z-0"
                      style={{ 
                        width: `${getDepthPercentage(ask.total, maxAskTotal)}%`,
                        opacity: '0.3'
                      }}
                    ></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Bids (Buy Orders) */}
          <div className="h-1/2 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                <tr className="text-gray-500 dark:text-gray-400">
                  <th className="px-2 py-1 text-left">Price</th>
                  <th className="px-2 py-1 text-right">Size</th>
                  <th className="px-2 py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid, index) => (
                  <tr key={`bid-${index}`} className="relative">
                    <td className="px-2 py-1 text-left text-green-500">
                      {formatPrice(bid.price)}
                    </td>
                    <td className="px-2 py-1 text-right">{formatSize(bid.size)}</td>
                    <td className="px-2 py-1 text-right">{formatSize(bid.total)}</td>
                    <td 
                      className="absolute top-0 right-0 h-full bg-green-100 dark:bg-green-900/20 z-0"
                      style={{ 
                        width: `${getDepthPercentage(bid.total, maxBidTotal)}%`,
                        opacity: '0.3'
                      }}
                    ></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
