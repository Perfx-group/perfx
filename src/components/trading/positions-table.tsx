'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Types

type Position = {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  size: number;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  pnl: number;
  pnlPercentage: number;
  margin: number;
};

type Order = {
  id: string;
  symbol: string;
  type: 'limit' | 'market';
  side: 'buy' | 'sell';
  size: number;
  price: number;
  status: 'open' | 'filled' | 'canceled';
  timestamp: number;
};

export default function PositionsTable() {
  const [activeTab, setActiveTab] = useState<'positions' | 'orders'>('positions');

  const [positions, setPositions] = useState<Position[]>([{
    id: 'pos-1',
    symbol: 'EUR/USD',
    type: 'long',
    size: 1000,
    leverage: 10,
    entryPrice: 1.20710,
    markPrice: 1.25234,
    liquidationPrice: 1.05325,
    pnl: 12.50,
    pnlPercentage: 1.25,
    margin: 200
  }, ]);

  const [orders, setOrders] = useState<Order[]>([{
    id: 'ord-1',
    symbol: 'EUR/USD',
    type: 'limit',
    side: 'buy',
    size: 500,
    price: 1.25234,
    status: 'open',
    timestamp: Date.now() - 3600000
  }, {
    id: 'ord-2',
    symbol: 'GBP/USD',
    type: 'market',
    side: 'sell',
    size: 200,
    price: 1.25400,
    status: 'filled',
    timestamp: Date.now() - 7200000
  }]);

  const closePosition = (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  const cancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'canceled' } : o));
  };

  const formatPrice = (price: number) => price.toFixed(5);
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden">
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'positions'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('positions')}
        >
          Positions
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'orders'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <div className="overflow-x-auto">
        {activeTab === 'positions' ? (
          positions.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Symbol</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Leverage</th>
                  <th className="px-4 py-2 text-right">Entry Price</th>
                  <th className="px-4 py-2 text-right">Mark Price</th>
                  <th className="px-4 py-2 text-right">Liq. Price</th>
                  <th className="px-4 py-2 text-right">PnL</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          position.type === 'long' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span>{position.symbol}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{position.size} USDC</td>
                    <td className="px-4 py-3">{position.leverage}x</td>
                    <td className="px-4 py-3 text-right">{formatPrice(position.entryPrice)}</td>
                    <td className="px-4 py-3 text-right">{formatPrice(position.markPrice)}</td>
                    <td className="px-4 py-3 text-right">{formatPrice(position.liquidationPrice)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${
                      position.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {position.pnl.toFixed(2)} USDC
                      <span className="text-xs ml-1">
                        ({position.pnl >= 0 ? '+' : ''}{position.pnlPercentage.toFixed(2)}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => closePosition(position.id)}>Close</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No open positions. Start trading to see your positions here.
            </div>
          )
        ) : (
          orders.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Symbol</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Side</th>
                  <th className="px-4 py-2 text-right">Size</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Status</th>
                  <th className="px-4 py-2 text-right">Time</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3">{order.symbol}</td>
                    <td className="px-4 py-3 capitalize">{order.type}</td>
                    <td className={`px-4 py-3 ${order.side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>{order.side === 'buy' ? 'Buy' : 'Sell'}</td>
                    <td className="px-4 py-3 text-right">{order.size} USDC</td>
                    <td className="px-4 py-3 text-right">{formatPrice(order.price)}</td>
                    <td className="px-4 py-3 text-right capitalize">{order.status}</td>
                    <td className="px-4 py-3 text-right">{formatTimestamp(order.timestamp)}</td>
                    <td className="px-4 py-3 text-right">
                      {order.status === 'open' && (
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => cancelOrder(order.id)}>Cancel</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No orders found. Place an order to see it here.
            </div>
          )
        )}
      </div>
    </div>
  );
}
