export interface CurrencyItem {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
}

export type Rates = {
  [key: string]: number;
};
export interface RatesData {
  rates: Rates;
  base: string;
  date: string;
}
