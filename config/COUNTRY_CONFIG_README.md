# Country Configuration System

This system allows the Educo application to dynamically adapt to different countries' educational systems, languages, currencies, and cultural requirements.

## Features

- **Dynamic Language Support**: Automatically populates language dropdowns based on the selected country
- **Currency Management**: Displays and formats currency according to country standards
- **Educational System Adaptation**: Configures grade levels, class structures based on local education systems
- **Cultural Customization**: Adapts blood groups, religions, and other culturally-specific data

## Currently Supported Countries

1. **Nigeria (NG)** - Default
   - Currency: Nigerian Naira (₦)
   - Languages: English, Hausa, Yoruba, Igbo, Fulfulde, Kanuri, Ibibio, Tiv, Ijaw, Edo, Efik, Nupe, Urhobo, Igala, Idoma
   - Educational System: Primary 1-6, JSS 1-3, SS 1-3

2. **Ghana (GH)**
   - Currency: Ghanaian Cedi (₵)
   - Languages: English, Akan, Ewe, Ga, Dagbani, Twi, Fante, Dagaare, Gonja, Kasem
   - Educational System: Primary 1-6, JHS 1-3, SHS 1-3

3. **Kenya (KE)**
   - Currency: Kenyan Shilling (KSh)
   - Languages: English, Swahili, Kikuyu, Luhya, Luo, Kalenjin, Kamba, Kisii, Meru, Mijikenda
   - Educational System: Grade 1-9, Form 1-4

4. **United States (US)**
   - Currency: US Dollar ($)
   - Languages: English, Spanish, Chinese, French, German, Korean, Vietnamese, Arabic
   - Educational System: K-12

## Usage

### 1. Using the Country Context Hook

```typescript
import { useCountry } from "@/contexts/CountryContext";

function MyComponent() {
  const { countryCode, countryConfig, setCountryCode } = useCountry();

  // Access country-specific data
  console.log(countryConfig.currency.symbol); // ₦
  console.log(countryConfig.languages.common); // [...Nigerian languages]
}
```

### 2. Using Helper Functions

```typescript
import {
  getLanguageOptions,
  getEducationalLevels,
  getBloodGroups,
  getReligions,
  formatCurrency,
  formatPhoneNumber
} from "@/config/countries";

// Get languages for dropdown
const languages = getLanguageOptions("NG");
// Returns: [{ value: "English", label: "English" }, ...]

// Format currency
const formattedAmount = formatCurrency(5000, "NG");
// Returns: "₦5,000"

// Format phone number
const phone = formatPhoneNumber("8012345678", "NG");
// Returns: "+2348012345678"
```

### 3. Adding the Country Selector to Settings

```typescript
import CountrySelector from "@/components/shared/CountrySelector";

function SettingsPage() {
  return (
    <div>
      <h2>Regional Settings</h2>
      <CountrySelector
        label="Select Your Country"
        showCurrencyInfo={true}
      />
    </div>
  );
}
```

### 4. Form Components Auto-Adapt

All form sections that use the country context will automatically update when the country changes:

```typescript
// PersonalInformationSection.tsx already uses:
const { countryCode } = useCountry();
const classes = getEducationalLevels(countryCode);
const bloodGroups = getBloodGroups(countryCode);
const religions = getReligions(countryCode);
const motherTongues = getLanguageOptions(countryCode);
```

## Adding a New Country

To add support for a new country, edit `config/countries.ts`:

```typescript
export const countryConfigs: Record<string, CountryConfig> = {
  // ... existing countries

  ZA: { // South Africa example
    code: "ZA",
    name: "South Africa",
    currency: {
      code: "ZAR",
      symbol: "R",
      name: "South African Rand",
    },
    languages: {
      official: ["Afrikaans", "English", "Zulu", "Xhosa"],
      common: [
        "Afrikaans", "English", "Zulu", "Xhosa", "Northern Sotho",
        "Tswana", "Southern Sotho", "Tsonga", "Swazi", "Venda", "Southern Ndebele"
      ],
    },
    phoneCode: "+27",
    dateFormat: "YYYY/MM/DD",
    timeFormat: "24h",
    educationalSystem: {
      levels: [
        "Grade R", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
        "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"
      ],
      gradeFormat: "Grade R-12",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Hinduism", "Traditional", "Other"],
  },
};
```

## Configuration Storage

The selected country is stored in the browser's `localStorage` with the key `appCountry`. This persists across sessions.

## Changing Default Country

To change the default country, edit `config/countries.ts`:

```typescript
export const DEFAULT_COUNTRY = "NG"; // Change to your country code
```

## Future Enhancements

- [ ] Add more African countries (Rwanda, Uganda, Tanzania, etc.)
- [ ] Support for regional dialects and minority languages
- [ ] Customizable date/time formats in UI
- [ ] Multi-currency support for international schools
- [ ] Import/Export country configurations
- [ ] Admin interface for managing country settings
- [ ] Localization (translations) based on country

## API Reference

### CountryConfig Interface

```typescript
interface CountryConfig {
  code: string;                    // ISO country code
  name: string;                    // Country name
  currency: {
    code: string;                  // Currency code (ISO 4217)
    symbol: string;                // Currency symbol
    name: string;                  // Currency full name
  };
  languages: {
    official: string[];            // Official languages
    common: string[];              // All commonly spoken languages
  };
  phoneCode: string;               // International dialing code
  dateFormat: string;              // Preferred date format
  timeFormat: "12h" | "24h";      // Time format preference
  educationalSystem: {
    levels: string[];              // All grade/class levels
    gradeFormat: string;           // Description of system
  };
  bloodGroups: string[];           // Valid blood groups
  religions: string[];             // Common religions
}
```

## Notes

- The system is fully reactive - changing the country will immediately update all dependent components
- Language data is based on commonly spoken languages in each country
- Educational systems follow each country's official structure
- All data can be customized per deployment
