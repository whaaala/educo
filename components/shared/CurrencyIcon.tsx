"use client";

import { useCountry } from "@/contexts/CountryContext";

interface CurrencyIconProps {
  className?: string;
}

export default function CurrencyIcon({ className = "w-5 h-5" }: CurrencyIconProps) {
  const { countryConfig } = useCountry();
  const symbol = countryConfig.currency.symbol;

  return (
    <span className={`flex items-center justify-center font-bold ${className}`}>
      {symbol}
    </span>
  );
}
