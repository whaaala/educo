"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CountryConfig, getCountryConfig, DEFAULT_COUNTRY } from "@/config/countries";

interface CountryContextType {
  countryCode: string;
  countryConfig: CountryConfig;
  setCountryCode: (code: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [countryCode, setCountryCodeState] = useState<string>(DEFAULT_COUNTRY);
  const [countryConfig, setCountryConfig] = useState<CountryConfig>(getCountryConfig(DEFAULT_COUNTRY));

  // Load country from localStorage on mount
  useEffect(() => {
    const savedCountry = localStorage.getItem("appCountry");
    if (savedCountry) {
      setCountryCodeState(savedCountry);
      setCountryConfig(getCountryConfig(savedCountry));
    }
  }, []);

  // Update country and save to localStorage
  const setCountryCode = (code: string) => {
    setCountryCodeState(code);
    setCountryConfig(getCountryConfig(code));
    localStorage.setItem("appCountry", code);
  };

  return (
    <CountryContext.Provider value={{ countryCode, countryConfig, setCountryCode }}>
      {children}
    </CountryContext.Provider>
  );
}

// Custom hook to use country context
export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}
