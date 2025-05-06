import { useState, useEffect } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface CurrencyRates {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

const apiKey = ' https://v6.exchangerate-api.com/v6/e4ada96aa569d4de1acf3f21/latest/USD'; // Replace with real API key in production

export const useCurrencyRates = (baseCurrency: string = 'USD') => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        
  
        const mockCurrencies: Currency[] = [
          { code: 'USD', name: 'US Dollar', symbol: '$' },
          { code: 'EUR', name: 'Euro', symbol: '€' },
          { code: 'GBP', name: 'British Pound', symbol: '£' },
          { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
          { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
          { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
          { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
          { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
          { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
          { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
        ];
        
        const mockRates: Record<string, number> = {
          USD: 1,
          EUR: 0.92,
          GBP: 0.78,
          JPY: 149.15,
          CAD: 1.36,
          AUD: 1.51,
          CHF: 0.89,
          CNY: 7.23,
          INR: 83.24,
          SGD: 1.34,
        };
        
        setCurrencies(mockCurrencies);
        setRates(mockRates);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch currency data');
        setLoading(false);
        console.error('Error fetching currency data:', err);
      }
    };

    fetchCurrencies();
  }, [baseCurrency]);

  const convert = (amount: number, from: string, to: string): number => {
    if (!rates[from] || !rates[to]) return 0;
    
    // Convert from source currency to base currency (USD), then to target currency
    const amountInBaseCurrency = amount / rates[from];
    return amountInBaseCurrency * rates[to];
  };

  return { currencies, rates, loading, error, convert };
};