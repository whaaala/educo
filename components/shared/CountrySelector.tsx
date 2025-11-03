"use client";

import { Globe } from "lucide-react";
import { useCountry } from "@/contexts/CountryContext";
import { getAvailableCountries } from "@/config/countries";
import FormDropdown from "./FormDropdown";

interface CountrySelectorProps {
  label?: string;
  showCurrencyInfo?: boolean;
}

export default function CountrySelector({
  label = "Country/Region",
  showCurrencyInfo = true
}: CountrySelectorProps) {
  const { countryCode, countryConfig, setCountryCode } = useCountry();
  const countries = getAvailableCountries();

  return (
    <div className="space-y-3">
      <FormDropdown
        label={label}
        icon={<Globe className="w-full h-full" />}
        value={countryCode}
        onChange={setCountryCode}
        options={countries}
        placeholder="Select country"
      />

      {showCurrencyInfo && (
        <div className="bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-700 midnight:border-cyan-700 purple:border-pink-700 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                Selected: {countryConfig.name}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-1">
                Currency: {countryConfig.currency.symbol} {countryConfig.currency.code} ({countryConfig.currency.name})
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5">
                Languages: {countryConfig.languages.official.join(", ")}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5">
                Educational System: {countryConfig.educationalSystem.gradeFormat}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
