// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date to YYYY-MM-DD
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Parse date from YYYY-MM-DD to Date object
export const parseInputDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Calculate days between two dates
export const daysBetween = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Calculate if a date is in the past
export const isPastDue = (dueDate: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
};

// Calculate total payments for a time period
export const calculateTotalPayments = (payments: { amount: number }[]): number => {
  return payments.reduce((total, payment) => total + payment.amount, 0);
};

// Generate month names for a dropdown
export const getMonthNames = (): string[] => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2022, i, 1);
    months.push(date.toLocaleString('default', { month: 'long' }));
  }
  return months;
};

// Get current year
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// Generate years for a dropdown (current year -5 to +5)
export const getYearOptions = (): number[] => {
  const currentYear = getCurrentYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone number
export const isValidPhone = (phone: string): boolean => {
  const re = /^\+?[1-9]\d{9,14}$/;
  return re.test(phone);
};