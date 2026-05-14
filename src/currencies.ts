import csvText from '../data/RprtRateXchgCln_20210401_20260331.csv';

// Maps ISO 4217 codes to the "Country - Currency Description" strings used in the CSV.
// The CSV has no ISO codes; this is the bridge layer.
const ISO_TO_DESCRIPTION: Record<string, string> = {
  AFN: 'Afghanistan-Afghani',
  ALL: 'Albania-Lek',
  DZD: 'Algeria-Dinar',
  AOA: 'Angola-Kwanza',
  XCD: 'Antigua & Barbuda-East Caribbean Dollar',
  ARS: 'Argentina-Peso',
  AMD: 'Armenia-Dram',
  AUD: 'Australia-Dollar',
  AZN: 'Azerbaijan-Manat',
  BSD: 'Bahamas-Dollar',
  BHD: 'Bahrain-Dinar',
  BDT: 'Bangladesh-Taka',
  BBD: 'Barbados-Dollar',
  BYN: 'Belarus-New Ruble',
  BZD: 'Belize-Dollar',
  XOF: 'Benin-Cfa Franc',
  BMD: 'Bermuda-Dollar',
  BOB: 'Bolivia-Boliviano',
  BAM: 'Bosnia-Marka',
  BWP: 'Botswana-Pula',
  BRL: 'Brazil-Real',
  BND: 'Brunei-Dollar',
  BIF: 'Burundi-Franc',
  KHR: 'Cambodia-Riel',
  XAF: 'Cameroon-Cfa Franc',
  CAD: 'Canada-Dollar',
  CVE: 'Cape Verde-Escudo',
  KYD: 'Cayman Islands-Dollar',
  CLP: 'Chile-Peso',
  CNY: 'China-Renminbi',
  COP: 'Colombia-Peso',
  KMF: 'Comoros-Franc',
  CRC: 'Costa Rica-Colon',
  CUC: 'Cuba-Chavito',
  CUP: 'Cuba-Peso',
  ANG: 'Curacao-Caribbean Guilder',
  CZK: 'Czech Republic-Koruna',
  CDF: 'Democratic Republic Of Congo-Congolese Franc',
  DKK: 'Denmark-Krone',
  DJF: 'Djibouti-Franc',
  DOP: 'Dominican Republic-Peso',
  EGP: 'Egypt-Pound',
  ERN: 'Eritrea-Nakfa',
  SZL: 'Eswatini-Lilangeni',
  ETB: 'Ethiopia-Birr',
  EUR: 'Euro Zone-Euro',
  FJD: 'Fiji-Dollar',
  GMD: 'Gambia-Dalasi',
  GEL: 'Georgia-Lari',
  GHS: 'Ghana-Cedi',
  GTQ: 'Guatemala-Quetzal',
  GNF: 'Guinea-Franc',
  GYD: 'Guyana-Dollar',
  HTG: 'Haiti-Gourde',
  HNL: 'Honduras-Lempira',
  HKD: 'Hong Kong-Dollar',
  HUF: 'Hungary-Forint',
  ISK: 'Iceland-Krona',
  INR: 'India-Rupee',
  IDR: 'Indonesia-Rupiah',
  IRR: 'Iran-Rial',
  IQD: 'Iraq-Dinar',
  ILS: 'Israel-Shekel',
  JMD: 'Jamaica-Dollar',
  JPY: 'Japan-Yen',
  JOD: 'Jordan-Dinar',
  KZT: 'Kazakhstan-Tenge',
  KES: 'Kenya-Shilling',
  KRW: 'Korea-Won',
  KWD: 'Kuwait-Dinar',
  KGS: 'Kyrgyzstan-Som',
  LAK: 'Laos-Kip',
  LBP: 'Lebanon-Pound',
  LSL: 'Lesotho-Maloti',
  LRD: 'Liberia-Dollar',
  LYD: 'Libya-Dinar',
  MGA: 'Madagascar-Ariary',
  MWK: 'Malawi-Kwacha',
  MYR: 'Malaysia-Ringgit',
  MVR: 'Maldives-Rufiyaa',
  MRU: 'Mauritania-Ouguiya',
  MUR: 'Mauritius-Rupee',
  MXN: 'Mexico-Peso',
  MDL: 'Moldova-Leu',
  MNT: 'Mongolia-Tugrik',
  MAD: 'Morocco-Dirham',
  MZN: 'Mozambique-Metical',
  MMK: 'Myanmar-Kyat',
  NAD: 'Namibia-Dollar',
  NPR: 'Nepal-Rupee',
  NZD: 'New Zealand-Dollar',
  NIO: 'Nicaragua-Cordoba',
  NGN: 'Nigeria-Naira',
  NOK: 'Norway-Krone',
  OMR: 'Oman-Rial',
  PKR: 'Pakistan-Rupee',
  PGK: 'Papua New Guinea-Kina',
  PYG: 'Paraguay-Guarani',
  PEN: 'Peru-Sol',
  PHP: 'Philippines-Peso',
  PLN: 'Poland-Zloty',
  QAR: 'Qatar-Riyal',
  MKD: 'Republic Of North Macedonia-Denar',
  RON: 'Romania-New Leu',
  RUB: 'Russia-Ruble',
  RWF: 'Rwanda-Franc',
  STN: 'Sao Tome & Principe-New Dobras',
  SAR: 'Saudi Arabia-Riyal',
  RSD: 'Serbia-Dinar',
  SCR: 'Seychelles-Rupee',
  SLE: 'Sierra Leone-Leone',
  SGD: 'Singapore-Dollar',
  SBD: 'Solomon Islands-Dollar',
  SOS: 'Somali-Shilling',
  ZAR: 'South Africa-Rand',
  SSP: 'South Sudan-Sudanese Pound',
  LKR: 'Sri Lanka-Rupee',
  SDG: 'Sudan-Pound',
  SRD: 'Suriname-Dollar',
  SEK: 'Sweden-Krona',
  CHF: 'Switzerland-Franc',
  SYP: 'Syria-Pound',
  TWD: 'Taiwan-Dollar',
  TJS: 'Tajikistan-Somoni',
  TZS: 'Tanzania-Shilling',
  THB: 'Thailand-Baht',
  TOP: "Tonga-Pa'Anga",
  TTD: 'Trinidad & Tobago-Dollar',
  TND: 'Tunisia-Dinar',
  TRY: 'Turkey-New Lira',
  TMT: 'Turkmenistan-New Manat',
  UGX: 'Uganda-Shilling',
  UAH: 'Ukraine-Hryvnia',
  AED: 'United Arab Emirates-Dirham',
  GBP: 'United Kingdom-Pound',
  UYU: 'Uruguay-Peso',
  UZS: 'Uzbekistan-Som',
  VUV: 'Vanuatu-Vatu',
  VES: 'Venezuela-Bolivar Soberano',
  VND: 'Vietnam-Dong',
  WST: 'Western Samoa-Tala',
  YER: 'Yemen-Rial',
  ZMW: 'Zambia-New Kwacha',
  ZWG: 'Zimbabwe-Gold',
};

function parseRates(text: string): Map<string, number> {
  const rates = new Map<string, number>();
  const lines = text.trim().split('\n');

  // Group rows by Record Date to isolate the most-recent snapshot
  const dateGroups = new Map<string, Array<{ description: string; rate: number }>>();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Columns: Record Date, Country - Currency Description, Exchange Rate, Effective Date
    const parts = line.split(',');
    if (parts.length < 4) continue;

    const recordDate = parts[0];
    const description = parts[1];
    const rate = parseFloat(parts[2]);

    if (!recordDate || !description || isNaN(rate)) continue;

    if (!dateGroups.has(recordDate)) {
      dateGroups.set(recordDate, []);
    }
    dateGroups.get(recordDate)!.push({ description, rate });
  }

  // Use only the latest date's rows
  const latestDate = [...dateGroups.keys()].sort().at(-1);
  if (!latestDate) return rates;

  for (const { description, rate } of dateGroups.get(latestDate)!) {
    rates.set(description, rate);
  }

  return rates;
}

let _rates: Map<string, number> | null = null;

function getRates(): Map<string, number> {
  return (_rates ??= parseRates(csvText));
}

// Returns the CSV exchange rate for an ISO code (units of that currency per 1 USD).
// Returns 1.0 for USD (base), null for unrecognised codes.
export function getRate(isoCode: string): number | null {
  if (isoCode === 'USD') return 1.0;
  const description = ISO_TO_DESCRIPTION[isoCode];
  if (!description) return null;
  return getRates().get(description) ?? null;
}

export function getCurrencyCount(): number {
  return getRates().size + 1; // +1 for USD (base currency, not in CSV)
}
