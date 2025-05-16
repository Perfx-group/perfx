'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import LeverageSlider from './leverage-slider';
import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { usePerfxProgram } from '@/hooks/use-perfx-program';
import { useTransactionToast } from '@/components/use-transaction-toast';

// Types
type OrderType = 'market' | 'limit';
type PositionType = 'long' | 'short';
type CollateralType = 'USDC' | 'EURC';

interface CollateralOption {
  value: CollateralType;
  label: string;
  icon: string;
}

const showTxToast = useTransactionToast();

type TradingFormProps = {
  symbol: string;
  currentPrice: number;
  onLeverageChange: (leverage: number) => void;
  initialLeverage?: number;
};

export default function TradingForm({ symbol, currentPrice, onLeverageChange, initialLeverage = 1 }: TradingFormProps) {
  const { theme } = useTheme();
  const { publicKey, connected } = useWallet();
  const { program } = usePerfxProgram();

  const [orderType, setOrderType] = useState<OrderType>('market');
  const [positionType, setPositionType] = useState<PositionType>('long');
  const [collateralType, setCollateralType] = useState<CollateralType>('USDC');
  const [amount, setAmount] = useState<string>('100');

  const collateralOptions: CollateralOption[] = [
    { value: 'USDC', label: 'USDC', icon: '/usdc.svg' },
    { value: 'EURC', label: 'EURC', icon: '/eurc.svg' },
  ];
  const [limitPrice, setLimitPrice] = useState<string>(currentPrice.toFixed(5));
  const [estimatedPnL, setEstimatedPnL] = useState<number>(0);
  const [estimatedLiquidationPrice, setEstimatedLiquidationPrice] = useState<number>(0);
  const [leverage, setLeverage] = useState<number>(initialLeverage);

  useEffect(() => {
    if (orderType === 'market') {
      setLimitPrice(currentPrice.toFixed(5));
    }
  }, [currentPrice, orderType]);

  const handleLeverageChange = (newLeverage: number) => {
    setLeverage(newLeverage);
    onLeverageChange(newLeverage);
  };

  useEffect(() => {
    const amountValue = parseFloat(amount) || 0;
    const limitPriceValue = parseFloat(limitPrice) || currentPrice;

    const pnlMultiplier = positionType === 'long' ? 1 : -1;
    const priceDifference = (limitPriceValue - currentPrice) / currentPrice;
    const estimatedPnLValue = amountValue * priceDifference * leverage * pnlMultiplier;

    const liquidationMultiplier = positionType === 'long' ? -1 : 1;
    const liquidationThreshold = 1 / leverage * 0.8;
    const liquidationPrice = currentPrice * (1 + (liquidationThreshold * liquidationMultiplier));

    setEstimatedPnL(estimatedPnLValue);
    setEstimatedLiquidationPrice(liquidationPrice);
  }, [amount, limitPrice, leverage, positionType, currentPrice]);

  const addOrderMutation = useMutation({
    mutationKey: ['perfx', 'addOrder', publicKey?.toBase58()],
    mutationFn: async () => {
      if (!program) throw new Error('Program not loaded');
      if (!publicKey) throw new Error('Wallet not connected');
      const orderDetails = `${orderType.toUpperCase()} ${positionType.toUpperCase()} ${amount} ${collateralType} ${symbol} @ ${limitPrice}x${leverage}`;

      console.log("Sending order:", orderDetails);

      const signature = await program.methods
        .addOrder(orderDetails)
        .accounts({
          payer: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return signature;
    },
    onSuccess: (signature) => {
      showTxToast(signature);
    },
    onError: (error: Error) => {
      alert(`Order failed: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }
    addOrderMutation.mutate();
  };

  return (
    <div className="w-full border border-gray-200 dark:border-gray-800 rounded-none p-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Place Order</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">{symbol}</div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Order Type */}
        <div className="mb-4">
          <div className="flex rounded-md overflow-hidden border">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium ${orderType === 'market' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              onClick={() => setOrderType('market')}>Market</button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium ${orderType === 'limit' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              onClick={() => setOrderType('limit')}>Limit</button>
          </div>
        </div>

        {/* Position Type */}
        <div className="mb-4">
          <div className="flex rounded-md overflow-hidden border">
            <button type="button" className={`flex-1 py-2 text-sm font-medium ${positionType === 'long' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`} onClick={() => setPositionType('long')}>Long</button>
            <button type="button" className={`flex-1 py-2 text-sm font-medium ${positionType === 'short' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`} onClick={() => setPositionType('short')}>Short</button>
          </div>
        </div>

        {/* Collateral Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Collateral</label>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md">
              <div className="flex items-center">
                <Image 
                  src={collateralOptions.find(option => option.value === collateralType)?.icon || '/usdc.svg'} 
                  alt={collateralType} 
                  width={16} 
                  height={16} 
                  className="mr-2" 
                />
                <span>{collateralType}</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[160px]">
              {collateralOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => setCollateralType(option.value)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    <Image src={option.icon} alt={option.label} width={16} height={16} className="mr-2" />
                    <span>{option.label}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Amount ({collateralType})</label>
          <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Enter amount" />
        </div>

        {/* Limit Price */}
        {orderType === 'limit' && (
          <div className="mb-4">
            <label className="block text-sm font-medium">Limit Price</label>
            <input type="text" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Enter limit price" />
          </div>
        )}

        {/* Leverage */}
        <div className="mb-4">
          <LeverageSlider onChange={handleLeverageChange} initialValue={leverage} />
        </div>
        {/* Order Summary */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-xs">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
            <span>{currentPrice.toFixed(5)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600 dark:text-gray-400">Order Value:</span>
            <span>{parseFloat(amount) * leverage} USDC</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600 dark:text-gray-400">Est. Liquidation Price:</span>
            <span className={positionType === 'long' ? 'text-red-500' : 'text-green-500'}>
              {estimatedLiquidationPrice.toFixed(5)}
            </span>
          </div>
          {orderType === 'limit' && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Est. PnL (at entry):</span>
              <span className={estimatedPnL >= 0 ? 'text-green-500' : 'text-red-500'}>
                {estimatedPnL.toFixed(2)} USDC
              </span>
            </div>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className={`w-full py-2 ${positionType === 'long' ? 'bg-green-500' : 'bg-red-500'} text-white font-medium rounded-md`}>
          {positionType === 'long' ? 'Buy / Long' : 'Sell / Short'} {symbol}
        </Button>
      </form>
    </div>
  );
}
