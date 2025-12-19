import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

export interface TenantSettings {
  country: string;
  currency: string;
  locale: string;
  schoolName: string;
  schoolType: 'primary' | 'secondary' | 'tertiary' | 'other';
}

interface TenantSettingsContextValue {
  settings: TenantSettings;
  setSettings: (next: TenantSettings) => void;
}

const TenantSettingsContext = createContext<TenantSettingsContextValue | null>(null);

const defaultSettings: TenantSettings = {
  country: 'NG',
  currency: 'NGN',
  locale: 'en-NG',
  schoolName: 'Educo Demo School',
  schoolType: 'secondary',
};

export function TenantSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<TenantSettings>(defaultSettings);

  const value = useMemo(() => ({ settings, setSettings }), [settings]);
  return <TenantSettingsContext.Provider value={value}>{children}</TenantSettingsContext.Provider>;
}

export function useTenantSettings() {
  const ctx = useContext(TenantSettingsContext);
  if (!ctx) throw new Error('useTenantSettings must be used within TenantSettingsProvider');
  return ctx;
}


