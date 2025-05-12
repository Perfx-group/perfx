'use client';

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

let tvScriptLoadingPromise: Promise<void>;

type ForexPair = {
  label: string;
  value: string;
};

const forexPairs: ForexPair[] = [
  { label: "EUR/USD", value: "PYTH:EURUSD" },
  { label: "USD/CHF", value: "PYTH:USDCHF" },
  { label: "GBP/USD", value: "PYTH:GBPUSD" },
  { label: "USD/JPY", value: "PYTH:USDJPY" },
  { label: "AUD/USD", value: "PYTH:AUDUSD" },
];

export default function TradingViewWidget() {
  const { theme } = useTheme();
  const [selectedPair, setSelectedPair] = useState<string>("PYTH:EURUSD");
  const [selectedLabel, setSelectedLabel] = useState<string>("EUR/USD");
  const [fundingRate, setFundingRate] = useState<number>(0.0001); 
  const [openInterest, setOpenInterest] = useState<number>(120000); 
  const [markPrice, setMarkPrice] = useState<number>(1.25234);
  const onLoadScriptRef = useRef<(() => void) | null>(null);
  const widgetRef = useRef<any>(null);

  // Load TradingView script only once
  useEffect(() => {
    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    }
  }, []);

  useEffect(() => {
    if (!theme) return;

    const createWidget = () => {
      if (
        document.getElementById("tradingview") &&
        "TradingView" in window
      ) {
        const container = document.getElementById("tradingview");
        if (container) container.innerHTML = "";

        const widgetTheme = theme === 'dark' ? 'dark' : 'light';

        widgetRef.current = new (window as any).TradingView.widget({
          autosize: true,
          symbol: selectedPair,
          interval: "D",
          timezone: "Etc/UTC",
          theme: widgetTheme,
          style: "1",
          locale: "en",
          toolbar_bg: widgetTheme === 'dark' ? "#1e1e1e" : "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview",
        });
      }
    };

    if ("TradingView" in window) {
      createWidget();
    } else {
      tvScriptLoadingPromise?.then(createWidget);
    }

    return () => {
      if (widgetRef.current) {
        try {
          if (widgetRef.current.remove) {
            widgetRef.current.remove();
          }
        } catch (e) {
          console.error("Error cleaning up TradingView widget:", e);
        }
      }
    };
  }, [selectedPair, theme]);

  const handlePairChange = (value: string, label: string) => {
    setSelectedPair(value);
    setSelectedLabel(label);
    // mock update data
    setFundingRate(0.015);
    setOpenInterest(142300);
    setMarkPrice(1.07456);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center flex-wrap gap-4">
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {selectedLabel}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {forexPairs.map((pair) => (
                  <DropdownMenuItem
                    key={pair.value}
                    onClick={() => handlePairChange(pair.value, pair.label)}
                    className="cursor-pointer"
                  >
                    {pair.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">Funding Rate:</span> {(fundingRate * 100).toFixed(2)}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">Open Interest:</span> {openInterest.toLocaleString()} USDC
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">Mark Price:</span> {markPrice.toFixed(5)}
        </div>
      </div>
      <div className="tradingview-widget-container w-full h-[500px] rounded-none overflow-hidden">
        <div id="tradingview" className="w-full h-full" />
      </div>
    </div>
  );
}
