/**
 * Country Configuration System
 * Manages region-specific data like languages, currencies, educational systems, etc.
 */

export interface CountryConfig {
  code: string;
  name: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  languages: {
    official: string[];
    common: string[];
  };
  phoneCode: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  educationalSystem: {
    levels: string[];
    gradeFormat: string;
  };
  bloodGroups: string[];
  religions: string[];
}

export const countryConfigs: Record<string, CountryConfig> = {
  NG: {
    code: "NG",
    name: "Nigeria",
    currency: {
      code: "NGN",
      symbol: "₦",
      name: "Nigerian Naira",
    },
    languages: {
      official: ["English"],
      common: [
        "English",
        "Nigerian Pidgin",
        "Hausa",
        "Yoruba",
        "Igbo",
        "Fulfulde",
        "Kanuri",
        "Ibibio",
        "Tiv",
        "Ijaw",
        "Edo",
        "Efik",
        "Nupe",
        "Urhobo",
        "Igala",
        "Idoma",
      ],
    },
    phoneCode: "+234",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: [
        "Primary 1",
        "Primary 2",
        "Primary 3",
        "Primary 4",
        "Primary 5",
        "Primary 6",
        "JSS 1",
        "JSS 2",
        "JSS 3",
        "SS 1",
        "SS 2",
        "SS 3",
      ],
      gradeFormat: "Primary/JSS/SS",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Traditional", "Other"],
  },
  GH: {
    code: "GH",
    name: "Ghana",
    currency: {
      code: "GHS",
      symbol: "₵",
      name: "Ghanaian Cedi",
    },
    languages: {
      official: ["English"],
      common: [
        "English",
        "Ghanaian Pidgin",
        "Akan",
        "Ewe",
        "Ga",
        "Dagbani",
        "Twi",
        "Fante",
        "Dagaare",
        "Gonja",
        "Kasem",
      ],
    },
    phoneCode: "+233",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: [
        "Primary 1",
        "Primary 2",
        "Primary 3",
        "Primary 4",
        "Primary 5",
        "Primary 6",
        "JHS 1",
        "JHS 2",
        "JHS 3",
        "SHS 1",
        "SHS 2",
        "SHS 3",
      ],
      gradeFormat: "Primary/JHS/SHS",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Traditional", "Other"],
  },
  KE: {
    code: "KE",
    name: "Kenya",
    currency: {
      code: "KES",
      symbol: "KSh",
      name: "Kenyan Shilling",
    },
    languages: {
      official: ["English", "Swahili"],
      common: [
        "English",
        "Swahili",
        "Kenyan Pidgin",
        "Kikuyu",
        "Luhya",
        "Luo",
        "Kalenjin",
        "Kamba",
        "Kisii",
        "Meru",
        "Mijikenda",
      ],
    },
    phoneCode: "+254",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: [
        "Grade 1",
        "Grade 2",
        "Grade 3",
        "Grade 4",
        "Grade 5",
        "Grade 6",
        "Grade 7",
        "Grade 8",
        "Grade 9",
        "Form 1",
        "Form 2",
        "Form 3",
        "Form 4",
      ],
      gradeFormat: "Grade/Form",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Traditional", "Hindu", "Other"],
  },
  US: {
    code: "US",
    name: "United States",
    currency: {
      code: "USD",
      symbol: "$",
      name: "US Dollar",
    },
    languages: {
      official: ["English"],
      common: ["English", "Spanish", "Chinese", "French", "German", "Korean", "Vietnamese", "Arabic"],
    },
    phoneCode: "+1",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: [
        "Kindergarten",
        "1st Grade",
        "2nd Grade",
        "3rd Grade",
        "4th Grade",
        "5th Grade",
        "6th Grade",
        "7th Grade",
        "8th Grade",
        "9th Grade",
        "10th Grade",
        "11th Grade",
        "12th Grade",
      ],
      gradeFormat: "K-12",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Judaism", "Islam", "Buddhism", "Hinduism", "Other"],
  },
  ZA: {
    code: "ZA",
    name: "South Africa",
    currency: {
      code: "ZAR",
      symbol: "R",
      name: "South African Rand",
    },
    languages: {
      official: ["Afrikaans", "English", "Zulu", "Xhosa"],
      common: ["Afrikaans", "English", "South African Pidgin", "Zulu", "Xhosa", "Northern Sotho", "Tswana", "Southern Sotho", "Tsonga", "Swazi", "Venda", "Southern Ndebele"],
    },
    phoneCode: "+27",
    dateFormat: "YYYY/MM/DD",
    timeFormat: "24h",
    educationalSystem: {
      levels: ["Grade R", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"],
      gradeFormat: "Grade R-12",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Hinduism", "Traditional", "Other"],
  },
  EG: {
    code: "EG",
    name: "Egypt",
    currency: {
      code: "EGP",
      symbol: "E£",
      name: "Egyptian Pound",
    },
    languages: {
      official: ["Arabic"],
      common: ["Arabic", "English", "French"],
    },
    phoneCode: "+20",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6", "Preparatory 1", "Preparatory 2", "Preparatory 3", "Secondary 1", "Secondary 2", "Secondary 3"],
      gradeFormat: "Primary/Preparatory/Secondary",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Islam", "Christianity", "Other"],
  },
  ET: {
    code: "ET",
    name: "Ethiopia",
    currency: {
      code: "ETB",
      symbol: "Br",
      name: "Ethiopian Birr",
    },
    languages: {
      official: ["Amharic"],
      common: ["Amharic", "Oromo", "Tigrinya", "Somali", "English", "Arabic"],
    },
    phoneCode: "+251",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"],
      gradeFormat: "Grade 1-12",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Traditional", "Other"],
  },
  TZ: {
    code: "TZ",
    name: "Tanzania",
    currency: {
      code: "TZS",
      symbol: "TSh",
      name: "Tanzanian Shilling",
    },
    languages: {
      official: ["Swahili", "English"],
      common: ["Swahili", "English", "Tanzanian Pidgin", "Sukuma", "Chagga", "Haya", "Nyamwezi"],
    },
    phoneCode: "+255",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: ["Standard 1", "Standard 2", "Standard 3", "Standard 4", "Standard 5", "Standard 6", "Standard 7", "Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"],
      gradeFormat: "Standard/Form",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Traditional", "Other"],
  },
  UG: {
    code: "UG",
    name: "Uganda",
    currency: {
      code: "UGX",
      symbol: "USh",
      name: "Ugandan Shilling",
    },
    languages: {
      official: ["English", "Swahili"],
      common: ["English", "Swahili", "Ugandan Pidgin", "Luganda", "Luo", "Runyankole", "Rukiga"],
    },
    phoneCode: "+256",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6", "Primary 7", "Senior 1", "Senior 2", "Senior 3", "Senior 4", "Senior 5", "Senior 6"],
      gradeFormat: "Primary/Senior",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Traditional", "Other"],
  },
  RW: {
    code: "RW",
    name: "Rwanda",
    currency: {
      code: "RWF",
      symbol: "FRw",
      name: "Rwandan Franc",
    },
    languages: {
      official: ["Kinyarwanda", "English", "French", "Swahili"],
      common: ["Kinyarwanda", "English", "French", "Swahili"],
    },
    phoneCode: "+250",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    educationalSystem: {
      levels: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6", "Senior 1", "Senior 2", "Senior 3", "Senior 4", "Senior 5", "Senior 6"],
      gradeFormat: "Primary/Senior",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Traditional", "Other"],
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    currency: {
      code: "GBP",
      symbol: "£",
      name: "British Pound Sterling",
    },
    languages: {
      official: ["English"],
      common: ["English", "Welsh", "Scottish Gaelic", "Irish"],
    },
    phoneCode: "+44",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"],
      gradeFormat: "Year 1-13",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Hinduism", "Sikhism", "Judaism", "Other"],
  },
  CA: {
    code: "CA",
    name: "Canada",
    currency: {
      code: "CAD",
      symbol: "C$",
      name: "Canadian Dollar",
    },
    languages: {
      official: ["English", "French"],
      common: ["English", "French", "Chinese", "Punjabi", "Spanish", "Arabic"],
    },
    phoneCode: "+1",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"],
      gradeFormat: "K-12",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Hinduism", "Sikhism", "Buddhism", "Judaism", "Other"],
  },
  AU: {
    code: "AU",
    name: "Australia",
    currency: {
      code: "AUD",
      symbol: "A$",
      name: "Australian Dollar",
    },
    languages: {
      official: ["English"],
      common: ["English", "Chinese", "Arabic", "Vietnamese", "Italian", "Greek"],
    },
    phoneCode: "+61",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: ["Kindergarten", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"],
      gradeFormat: "K-Year 12",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Buddhism", "Islam", "Hinduism", "Other"],
  },
  IN: {
    code: "IN",
    name: "India",
    currency: {
      code: "INR",
      symbol: "₹",
      name: "Indian Rupee",
    },
    languages: {
      official: ["Hindi", "English"],
      common: ["Hindi", "English", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", "Gujarati", "Malayalam", "Kannada", "Punjabi"],
    },
    phoneCode: "+91",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"],
      gradeFormat: "Class 1-12",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Hinduism", "Islam", "Christianity", "Sikhism", "Buddhism", "Jainism", "Other"],
  },
  FR: {
    code: "FR",
    name: "France",
    currency: {
      code: "EUR",
      symbol: "€",
      name: "Euro",
    },
    languages: {
      official: ["French"],
      common: ["French", "English", "Spanish", "German", "Arabic"],
    },
    phoneCode: "+33",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    educationalSystem: {
      levels: ["CP", "CE1", "CE2", "CM1", "CM2", "6ème", "5ème", "4ème", "3ème", "Seconde", "Première", "Terminale"],
      gradeFormat: "Primaire/Collège/Lycée",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Judaism", "Buddhism", "Other"],
  },
  DE: {
    code: "DE",
    name: "Germany",
    currency: {
      code: "EUR",
      symbol: "€",
      name: "Euro",
    },
    languages: {
      official: ["German"],
      common: ["German", "English", "Turkish", "Polish", "Russian"],
    },
    phoneCode: "+49",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "24h",
    educationalSystem: {
      levels: ["Klasse 1", "Klasse 2", "Klasse 3", "Klasse 4", "Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10", "Klasse 11", "Klasse 12", "Klasse 13"],
      gradeFormat: "Klasse 1-13",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Judaism", "Other"],
  },
  ES: {
    code: "ES",
    name: "Spain",
    currency: {
      code: "EUR",
      symbol: "€",
      name: "Euro",
    },
    languages: {
      official: ["Spanish"],
      common: ["Spanish", "Catalan", "Galician", "Basque", "English"],
    },
    phoneCode: "+34",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    educationalSystem: {
      levels: ["1º Primaria", "2º Primaria", "3º Primaria", "4º Primaria", "5º Primaria", "6º Primaria", "1º ESO", "2º ESO", "3º ESO", "4º ESO", "1º Bachillerato", "2º Bachillerato"],
      gradeFormat: "Primaria/ESO/Bachillerato",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Judaism", "Other"],
  },
  IT: {
    code: "IT",
    name: "Italy",
    currency: {
      code: "EUR",
      symbol: "€",
      name: "Euro",
    },
    languages: {
      official: ["Italian"],
      common: ["Italian", "English", "French", "Spanish", "German"],
    },
    phoneCode: "+39",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    educationalSystem: {
      levels: ["Prima", "Seconda", "Terza", "Quarta", "Quinta", "Prima Media", "Seconda Media", "Terza Media", "Prima Superiore", "Seconda Superiore", "Terza Superiore", "Quarta Superiore", "Quinta Superiore"],
      gradeFormat: "Elementare/Media/Superiore",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Judaism", "Other"],
  },
  NL: {
    code: "NL",
    name: "Netherlands",
    currency: {
      code: "EUR",
      symbol: "€",
      name: "Euro",
    },
    languages: {
      official: ["Dutch"],
      common: ["Dutch", "English", "Turkish", "Arabic", "German"],
    },
    phoneCode: "+31",
    dateFormat: "DD-MM-YYYY",
    timeFormat: "24h",
    educationalSystem: {
      levels: ["Groep 1", "Groep 2", "Groep 3", "Groep 4", "Groep 5", "Groep 6", "Groep 7", "Groep 8", "Klas 1", "Klas 2", "Klas 3", "Klas 4", "Klas 5", "Klas 6"],
      gradeFormat: "Basisschool/Voortgezet",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Hinduism", "Buddhism", "Other"],
  },
  SE: {
    code: "SE",
    name: "Sweden",
    currency: {
      code: "SEK",
      symbol: "kr",
      name: "Swedish Krona",
    },
    languages: {
      official: ["Swedish"],
      common: ["Swedish", "English", "Finnish", "Arabic"],
    },
    phoneCode: "+46",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "24h",
    educationalSystem: {
      levels: ["Årskurs 1", "Årskurs 2", "Årskurs 3", "Årskurs 4", "Årskurs 5", "Årskurs 6", "Årskurs 7", "Årskurs 8", "Årskurs 9", "Gymnasiet 1", "Gymnasiet 2", "Gymnasiet 3"],
      gradeFormat: "Grundskola/Gymnasiet",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Other"],
  },
  PL: {
    code: "PL",
    name: "Poland",
    currency: {
      code: "PLN",
      symbol: "zł",
      name: "Polish Zloty",
    },
    languages: {
      official: ["Polish"],
      common: ["Polish", "English", "German", "Russian"],
    },
    phoneCode: "+48",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "24h",
    educationalSystem: {
      levels: ["Klasa 1", "Klasa 2", "Klasa 3", "Klasa 4", "Klasa 5", "Klasa 6", "Klasa 7", "Klasa 8", "Klasa 1 LO", "Klasa 2 LO", "Klasa 3 LO", "Klasa 4 LO"],
      gradeFormat: "Szkoła Podstawowa/Liceum",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Judaism", "Islam", "Other"],
  },
  PT: {
    code: "PT",
    name: "Portugal",
    currency: {
      code: "EUR",
      symbol: "€",
      name: "Euro",
    },
    languages: {
      official: ["Portuguese"],
      common: ["Portuguese", "English", "French", "Spanish"],
    },
    phoneCode: "+351",
    dateFormat: "DD-MM-YYYY",
    timeFormat: "24h",
    educationalSystem: {
      levels: ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano", "6º Ano", "7º Ano", "8º Ano", "9º Ano", "10º Ano", "11º Ano", "12º Ano"],
      gradeFormat: "Ensino Básico/Secundário",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Other"],
  },
  IE: {
    code: "IE",
    name: "Ireland",
    currency: {
      code: "EUR",
      symbol: "€",
      name: "Euro",
    },
    languages: {
      official: ["Irish", "English"],
      common: ["English", "Irish", "Polish", "Lithuanian"],
    },
    phoneCode: "+353",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    educationalSystem: {
      levels: ["Senior Infants", "1st Class", "2nd Class", "3rd Class", "4th Class", "5th Class", "6th Class", "1st Year", "2nd Year", "3rd Year", "Transition Year", "5th Year", "6th Year"],
      gradeFormat: "Primary/Secondary",
    },
    bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    religions: ["Christianity", "Islam", "Other"],
  },
};

// Default country (can be configured in settings)
export const DEFAULT_COUNTRY = "NG";

// Get current country configuration
export function getCountryConfig(countryCode?: string): CountryConfig {
  const code = countryCode || DEFAULT_COUNTRY;
  return countryConfigs[code] || countryConfigs[DEFAULT_COUNTRY];
}

// Get all available countries
export function getAvailableCountries() {
  return Object.values(countryConfigs).map((config) => ({
    value: config.code,
    label: config.name,
  }));
}

// Get languages for dropdown options
export function getLanguageOptions(countryCode?: string) {
  const config = getCountryConfig(countryCode);
  return config.languages.common.map((lang) => ({
    value: lang,
    label: lang,
  }));
}

// Get currency format helper
export function formatCurrency(amount: number, countryCode?: string): string {
  const config = getCountryConfig(countryCode);
  return `${config.currency.symbol}${amount.toLocaleString()}`;
}

// Get phone number format helper
export function formatPhoneNumber(number: string, countryCode?: string): string {
  const config = getCountryConfig(countryCode);
  return `${config.phoneCode}${number}`;
}

// Educational levels helper
export function getEducationalLevels(countryCode?: string) {
  const config = getCountryConfig(countryCode);
  return config.educationalSystem.levels.map((level) => ({
    value: level,
    label: level,
  }));
}

// Blood groups helper
export function getBloodGroups(countryCode?: string) {
  const config = getCountryConfig(countryCode);
  return config.bloodGroups.map((bg) => ({
    value: bg,
    label: bg,
  }));
}

// Religions helper
export function getReligions(countryCode?: string) {
  const config = getCountryConfig(countryCode);
  return config.religions.map((r) => ({
    value: r,
    label: r,
  }));
}
