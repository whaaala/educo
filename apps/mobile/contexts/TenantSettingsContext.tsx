import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

// Payment method configuration
export interface PaymentMethodConfig {
  enabled: boolean;
  title: string;
  description: string;
  instructions?: string;
  icon?: string;
}

export interface BankTransferConfig extends PaymentMethodConfig {
  bankName: string;
  accountNumber: string;
  accountName: string;
  referenceNote: string;
}

export interface CashPaymentConfig extends PaymentMethodConfig {
  location: string;
  workingHours: string;
  contactPerson?: string;
  contactPhone?: string;
}

export interface CardPaymentConfig extends PaymentMethodConfig {
  gatewayName: string;
  supportedCards: string[];
  processingFeePercent?: number;
}

export interface PaymentSettings {
  cardPayment: CardPaymentConfig;
  bankTransfer: BankTransferConfig;
  cashPayment: CashPaymentConfig;
  defaultMethod: 'card' | 'bank' | 'cash';
  supportEmail?: string;
  supportPhone?: string;
}

export interface BrandingSettings {
  primaryColor: string;
  primaryColorDark: string;
  accentColor: string;
  logoUrl?: string;
}

export interface TenantSettings {
  country: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  schoolName: string;
  schoolLogo?: string;
  schoolType: 'primary' | 'secondary' | 'tertiary' | 'other';
  payment: PaymentSettings;
  branding: BrandingSettings;
}

interface TenantSettingsContextValue {
  settings: TenantSettings;
  setSettings: (next: TenantSettings) => void;
}

const TenantSettingsContext = createContext<TenantSettingsContextValue | null>(null);

const defaultSettings: TenantSettings = {
  country: 'NG',
  currency: 'NGN',
  currencySymbol: '₦',
  locale: 'en-NG',
  schoolName: 'Educo Academy',
  schoolType: 'secondary',
  branding: {
    primaryColor: '#059669',
    primaryColorDark: '#047857',
    accentColor: '#10b981',
  },
  payment: {
    defaultMethod: 'card',
    supportEmail: 'payments@educo.com',
    supportPhone: '+234 800 123 4567',
    cardPayment: {
      enabled: true,
      title: 'Card Payment',
      description: 'Pay securely with your debit or credit card',
      instructions: 'You will be redirected to our secure payment gateway powered by Paystack. Your card details are encrypted and never stored on our servers.',
      gatewayName: 'Paystack',
      supportedCards: ['Visa', 'Mastercard', 'Verve'],
      processingFeePercent: 1.5,
    },
    bankTransfer: {
      enabled: true,
      title: 'Bank Transfer',
      description: 'Transfer directly to our bank account',
      instructions: 'Transfer the exact amount to the account below. Use your child\'s admission number as the payment reference for easy identification.',
      bankName: 'First Bank Nigeria',
      accountNumber: '0123456789',
      accountName: 'Educo Academy',
      referenceNote: 'Use your child\'s admission number as reference',
    },
    cashPayment: {
      enabled: true,
      title: 'Pay at School',
      description: 'Visit the bursar\'s office to pay in cash',
      instructions: 'Please visit our bursar\'s office during working hours. Bring your child\'s admission number for reference. You will receive an official receipt upon payment.',
      location: 'Bursar\'s Office, Admin Block, Ground Floor',
      workingHours: 'Monday - Friday, 8:00 AM - 4:00 PM',
      contactPerson: 'Mrs. Adebayo',
      contactPhone: '+234 803 456 7890',
    },
  },
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


