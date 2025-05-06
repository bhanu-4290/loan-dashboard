export interface LoanParams {
  principal: number;
  interestRate: number; // Annual interest rate in percentage
  loanTerm: number; // Loan term in months
}

export interface MonthlyPayment {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

// Calculate EMI (Equated Monthly Installment)
export const calculateEMI = (params: LoanParams): number => {
  const { principal, interestRate, loanTerm } = params;
  
  // Convert annual interest rate to monthly and decimal form
  const monthlyInterestRate = interestRate / 100 / 12;
  
  // EMI calculation formula
  if (monthlyInterestRate === 0) {
    return principal / loanTerm;
  }
  
  const emi = principal * 
    monthlyInterestRate * 
    Math.pow(1 + monthlyInterestRate, loanTerm) / 
    (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
  
  return emi;
};

// Generate full amortization schedule
export const generateAmortizationSchedule = (params: LoanParams): MonthlyPayment[] => {
  const { principal, interestRate, loanTerm } = params;
  const monthlyInterestRate = interestRate / 100 / 12;
  const monthlyPayment = calculateEMI(params);
  
  let remainingBalance = principal;
  const schedule: MonthlyPayment[] = [];
  
  for (let month = 1; month <= loanTerm; month++) {
    const interestPayment = remainingBalance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    remainingBalance -= principalPayment;
    
    // Handle last payment rounding issues
    if (month === loanTerm) {
      const finalInterest = remainingBalance * monthlyInterestRate;
      schedule.push({
        month,
        payment: principalPayment + remainingBalance + finalInterest,
        principal: principalPayment + remainingBalance,
        interest: finalInterest,
        remainingBalance: 0
      });
    } else {
      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: remainingBalance > 0 ? remainingBalance : 0
      });
    }
  }
  
  return schedule;
};

// Calculate total interest paid over loan term
export const calculateTotalInterest = (schedule: MonthlyPayment[]): number => {
  return schedule.reduce((total, payment) => total + payment.interest, 0);
};

// Calculate total amount paid over loan term
export const calculateTotalAmount = (schedule: MonthlyPayment[]): number => {
  return schedule.reduce((total, payment) => total + payment.payment, 0);
};