export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  title: string;
  amount: number;
  category: string;
  date: string;
}

export function saveTransaction(transaction: Omit<Transaction, 'id' | 'date'> & { date?: string }) {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    date: transaction.date ?? new Date().toISOString(),
  };
  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

export function getTransactions(): Transaction[] {
  try {
    const transactionsJson = localStorage.getItem('transactions');
    return transactionsJson ? JSON.parse(transactionsJson) : [];
  } catch {
    return [];
  }
}

export function getFilteredTransactions(tags: string[]): Transaction[] {
  const transactions = getTransactions();
  if (tags.length === 0) return transactions;
  return transactions.filter(transaction => tags.includes(transaction.category));
}

export interface FilterOptions {
  search?: string;
  categories?: string[];
  type?: 'expense' | 'income';
  dateFrom?: string;
  dateTo?: string;
}

export function getAdvancedFilteredTransactions(options: FilterOptions): Transaction[] {
  const transactions = getTransactions();
  
  return transactions.filter(transaction => {
    // Search filter
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      if (!transaction.title.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    // Category filter
    if (options.categories && options.categories.length > 0) {
      if (!options.categories.includes(transaction.category)) {
        return false;
      }
    }
    
    // Type filter
    if (options.type) {
      if (transaction.type !== options.type) {
        return false;
      }
    }
    
    // Date range filter
    if (options.dateFrom || options.dateTo) {
      const transactionDate = new Date(transaction.date);
      if (options.dateFrom) {
        const fromDate = new Date(options.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (transactionDate < fromDate) {
          return false;
        }
      }
      if (options.dateTo) {
        const toDate = new Date(options.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (transactionDate > toDate) {
          return false;
        }
      }
    }
    
    return true;
  });
}

export function deleteTransaction(id: string) {
  const transactions = getTransactions();
  const updatedTransactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
}

export function editTransaction(updatedTransaction: Transaction) {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === updatedTransaction.id);
  if (index !== -1) {
    transactions[index] = updatedTransaction;
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
}

