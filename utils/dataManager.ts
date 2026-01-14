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
    id: Date.now().toString(),
    date: transaction.date ?? new Date().toISOString(),
  };
  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

export function getTransactions(): Transaction[] {
  const transactionsJson = localStorage.getItem('transactions');
  return transactionsJson ? JSON.parse(transactionsJson) : [];
}

export function getFilteredTransactions(tags: string[]): Transaction[] {
  const transactions = getTransactions();
  if (tags.length === 0) return transactions;
  return transactions.filter(transaction => tags.includes(transaction.category));
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

