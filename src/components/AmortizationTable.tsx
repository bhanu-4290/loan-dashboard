import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MonthlyPayment } from '../utils/loanCalculations';
import { formatCurrency, formatNumber } from '../utils/formatter';
import { useCurrencyRates } from '../hooks/useCurrencyRates';

interface AmortizationTableProps {
  schedule: MonthlyPayment[];
  totalInterest: number;
  totalAmount: number;
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({
  schedule,
  totalInterest,
  totalAmount,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [visibleYears, setVisibleYears] = useState<number[]>([1]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  const { currencies, convert } = useCurrencyRates();

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (!expanded) {
      // When expanding, show all years
      const years = new Set<number>();
      schedule.forEach(payment => {
        years.add(Math.ceil(payment.month / 12));
      });
      setVisibleYears(Array.from(years));
    } else {
      // When collapsing, show only first year
      setVisibleYears([1]);
    }
  };

  const toggleYear = (year: number) => {
    if (visibleYears.includes(year)) {
      setVisibleYears(visibleYears.filter(y => y !== year));
    } else {
      setVisibleYears([...visibleYears, year]);
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
  };

  // Group payments by year
  const paymentsByYear = schedule.reduce<Record<number, MonthlyPayment[]>>((acc, payment) => {
    const year = Math.ceil(payment.month / 12);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(payment);
    return acc;
  }, {});

  return (
    <div id="schedule" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Amortization Schedule
        </h2>
        <button
          onClick={toggleExpand}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          {expanded ? (
            <>
              <span className="mr-1">Show Less</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span className="mr-1">Show All</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Principal</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-white">
              {formatCurrency(totalAmount - totalInterest, selectedCurrency)}
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Interest</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {formatCurrency(convert(totalInterest, 'USD', selectedCurrency), selectedCurrency)}
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Amount</div>
            <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(convert(totalAmount, 'USD', selectedCurrency), selectedCurrency)}
            </div>
          </div>
        </div>

        <div className="w-full md:w-48">
          <select
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Payment #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Principal
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Interest
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Remaining Balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {Object.entries(paymentsByYear).map(([year, payments]) => {
              const yearNum = parseInt(year);
              const isYearVisible = visibleYears.includes(yearNum);
              
              return (
                <React.Fragment key={`year-${year}`}>
                  <tr 
                    className="bg-gray-50 dark:bg-gray-750 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => toggleYear(yearNum)}
                  >
                    <td colSpan={5} className="px-4 py-2 font-medium">
                      <div className="flex items-center">
                        {isYearVisible ? (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronUp className="h-4 w-4 mr-2" />
                        )}
                        Year {year}
                      </div>
                    </td>
                  </tr>
                  
                  {isYearVisible && payments.map(payment => (
                    <tr 
                      key={`payment-${payment.month}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        {payment.month}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(convert(payment.payment, 'USD', selectedCurrency), selectedCurrency)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                        {formatCurrency(convert(payment.principal, 'USD', selectedCurrency), selectedCurrency)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-blue-600 dark:text-blue-400">
                        {formatCurrency(convert(payment.interest, 'USD', selectedCurrency), selectedCurrency)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                        {formatCurrency(convert(payment.remainingBalance, 'USD', selectedCurrency), selectedCurrency)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AmortizationTable;