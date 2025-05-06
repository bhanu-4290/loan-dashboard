import React, { useState, useEffect } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { useCurrencyRates } from '../hooks/useCurrencyRates';
import { formatCurrency, formatNumber } from '../utils/formatter';

const CurrencyConverter: React.FC = () => {
  const { currencies, rates, convert, loading } = useCurrencyRates();
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCurrencies, setShowAllCurrencies] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    } else {
      setAmount(0);
    }
  };

  const handleFromCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Always show all when searching
    if (e.target.value) {
      setShowAllCurrencies(true);
    }
  };

  const toggleShowAll = () => {
    setShowAllCurrencies(!showAllCurrencies);
    if (!showAllCurrencies) {
      setSearchQuery('');
    }
  };

  // Filter currencies based on search query
  const filteredCurrencies = currencies.filter(currency => 
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Display only major currencies when not showing all
  const displayCurrencies = showAllCurrencies 
    ? filteredCurrencies 
    : currencies.filter(c => ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'INR'].includes(c.code));

  return (
    <div id="converter" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Currency Converter
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount"
            min="0"
          />
        </div>
        
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
            From Currency
          </label>
          <select
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {loading ? (
              <option>Loading currencies...</option>
            ) : (
              currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </option>
              ))
            )}
          </select>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 mr-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search currencies..."
            />
          </div>
          
          <button
            onClick={toggleShowAll}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {showAllCurrencies ? 'Show Main' : 'Show All'}
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Currency
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Converted Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                  Loading currency data...
                </td>
              </tr>
            ) : (
              displayCurrencies.map(currency => (
                <tr 
                  key={currency.code}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {currency.code}
                      </div>
                      <div className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                        {currency.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatNumber(rates[currency.code] / rates[fromCurrency])}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {formatCurrency(convert(amount, fromCurrency, currency.code), currency.code)}
                    </div>
                  </td>
                </tr>
              ))
            )}
            
            {!loading && displayCurrencies.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                  No currencies found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrencyConverter;