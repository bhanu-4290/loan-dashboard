import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Percent } from 'lucide-react';
import { LoanParams, calculateEMI } from '../utils/loanCalculations';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatter';
import { useCurrencyRates } from '../hooks/useCurrencyRates';

const LoanCalculator: React.FC<{
  onCalculate: (params: LoanParams) => void;
}> = ({ onCalculate }) => {
  const [params, setParams] = useState<LoanParams>({
    principal: 100000,
    interestRate: 5,
    loanTerm: 240, // 20 years in months
  });

  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const { currencies, rates, convert, loading } = useCurrencyRates();
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    setMonthlyPayment(calculateEMI(params));
    onCalculate(params);
  }, [params, onCalculate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      setParams(prev => ({ ...prev, [name]: numValue }));
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
  };

  const convertedMonthlyPayment = convert(monthlyPayment, 'USD', selectedCurrency);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Loan Calculator</h2>
      
      <div className="space-y-6">
        {/* Principal Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
            Loan Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="principal"
              value={params.principal}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter loan amount"
              min="1000"
              step="1000"
            />
          </div>
          <input
            type="range"
            name="principal"
            value={params.principal}
            onChange={handleInputChange}
            min="10000"
            max="1000000"
            step="10000"
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>$10,000</span>
            <span>$1,000,000</span>
          </div>
        </div>
        
        {/* Interest Rate */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
            Interest Rate (% per year)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="interestRate"
              value={params.interestRate}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter interest rate"
              min="0.1"
              max="20"
              step="0.1"
            />
          </div>
          <input
            type="range"
            name="interestRate"
            value={params.interestRate}
            onChange={handleInputChange}
            min="0.1"
            max="20"
            step="0.1"
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>0.1%</span>
            <span>20%</span>
          </div>
        </div>
        
        {/* Loan Term */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
            Loan Term (months)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="loanTerm"
              value={params.loanTerm}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter loan term in months"
              min="12"
              max="360"
              step="12"
            />
          </div>
          <input
            type="range"
            name="loanTerm"
            value={params.loanTerm}
            onChange={handleInputChange}
            min="12"
            max="360"
            step="12"
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>1 year</span>
            <span>30 years</span>
          </div>
        </div>
        
        {/* Currency Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
            Display Currency
          </label>
          <select
            value={selectedCurrency}
            onChange={handleCurrencyChange}
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
        
        {/* Results */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Monthly Payment
          </h3>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(convertedMonthlyPayment, selectedCurrency)}
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {selectedCurrency !== 'USD' && (
              <div>
                Original: {formatCurrency(monthlyPayment, 'USD')}
              </div>
            )}
            <div>
              Interest Rate: {formatPercent(params.interestRate)}
            </div>
            <div>
              Loan Term: {params.loanTerm} months ({params.loanTerm / 12} years)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;