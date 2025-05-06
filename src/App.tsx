import React, { useState } from 'react';
import Header from './components/Header';
import LoanCalculator from './components/LoanCalculator';
import AmortizationTable from './components/AmortizationTable';
import CurrencyConverter from './components/CurrencyConverter';
import Footer from './components/Footer';
import { LoanParams, generateAmortizationSchedule, calculateTotalInterest, calculateTotalAmount } from './utils/loanCalculations';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [amortizationSchedule, setAmortizationSchedule] = useState(
    generateAmortizationSchedule({
      principal: 100000,
      interestRate: 5,
      loanTerm: 240,
    })
  );
  
  const [totalInterest, setTotalInterest] = useState(calculateTotalInterest(amortizationSchedule));
  const [totalAmount, setTotalAmount] = useState(calculateTotalAmount(amortizationSchedule));

  const handleCalculate = (params: LoanParams) => {
    const schedule = generateAmortizationSchedule(params);
    setAmortizationSchedule(schedule);
    setTotalInterest(calculateTotalInterest(schedule));
    setTotalAmount(calculateTotalAmount(schedule));
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Loan Calculator Dashboard
            </h1>
            <p className="mt-5 text-xl text-gray-500 dark:text-gray-400">
              Calculate your loan payments, view amortization schedules, and convert currencies in real-time.
            </p>
          </div>

          <section id="calculator" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <LoanCalculator onCalculate={handleCalculate} />
            </div>
            
            <div className="lg:col-span-2">
              <AmortizationTable 
                schedule={amortizationSchedule} 
                totalInterest={totalInterest}
                totalAmount={totalAmount}
              />
            </div>
          </section>
          
          <section className="mt-12">
            <CurrencyConverter />
          </section>
          
          <section id="about" className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              About This Calculator
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                This loan calculator dashboard provides you with comprehensive tools to understand your loan and mortgage options. 
                Key features include:
              </p>
              <ul>
                <li>
                  <strong>Dynamic Amortization Schedule:</strong> View a detailed month-by-month breakdown of your loan payments, 
                  showing how much goes toward principal and interest each month.
                </li>
                <li>
                  <strong>Real-time Currency Conversion:</strong> Convert your loan amounts and payments to over 160 different currencies 
                  using up-to-date exchange rates.
                </li>
                <li>
                  <strong>Customizable Experience:</strong> Toggle between dark and light mode for comfortable viewing in any environment.
                </li>
                <li>
                  <strong>Mobile-Friendly Design:</strong> Access all features on any device with a responsive design and collapsible 
                  navigation on mobile.
                </li>
              </ul>
              <p>
                Use this calculator for informational purposes to help plan your finances. The actual terms of your loan may vary 
                based on lender policies, your credit score, and other factors.
              </p>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;