"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BrainCogIcon,
  CogIcon,
  EllipsisVerticalIcon,
  FilterIcon,
  ScrollText,
  Trash2,
  X,
} from "lucide-react";
import {
  deleteTransaction,
  getCurrencyCode,
  getTransactions,
  Transaction,
} from "@/utils/dataManager";
import { cstr, CurrencyCode } from "@/lib/currency";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import BottomNav from "@/components/BottomNav";
import Expninc from "@/components/expninc";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    setTransactions(getTransactions());
    setCurrency(getCurrencyCode());

    const onStorage = (event: StorageEvent) => {
      if (event.key === "transactions") {
        setTransactions(getTransactions());
      }
    };

    const onTransactionsChanged = () => setTransactions(getTransactions());
    const onSettingsChanged = () => setCurrency(getCurrencyCode());

    window.addEventListener("storage", onStorage);
    window.addEventListener("transactions:changed", onTransactionsChanged);
    window.addEventListener("settings:changed", onSettingsChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("transactions:changed", onTransactionsChanged);
      window.removeEventListener("settings:changed", onSettingsChanged);
    };
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthExpense = transactions
    .filter((t) => {
      const txDate = new Date(t.date);
      return (
        t.type === "expense" &&
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthEarning = transactions
    .filter((t) => {
      const txDate = new Date(t.date);
      return (
        t.type === "income" &&
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setDeletingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleEditComplete = () => {
    setEditingTransaction(null);
    setTransactions(getTransactions());
  };

  return (
    <div className="flex flex-col overflow-y-auto">
      <Expninc
        thisMonthEarning={thisMonthEarning}
        thisMonthExpense={thisMonthExpense}
      />
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex gap-1 items-center">
          <ScrollText className="opacity-60 w-4" />
          <h2 className="text-lg font-semibold tracking-tight">Transactions</h2>
        </div>
        <div className="flex gap-1">
          <Link
            className="px-3 py-1 rounded-full bg-accent flex items-center border"
            href="/settings"
            aria-label="Analysis">
            <CogIcon className="h-4 w-4 text-foreground" />
          </Link>
          <Link
            className="px-3 py-1 rounded-full bg-accent flex items-center border"
            href="/analysis"
            aria-label="Analysis">
            <BrainCogIcon className="h-4 w-4 text-foreground" />
          </Link>
          <Link
            className="px-3 py-1 rounded-full bg-accent flex items-center border"
            href="/filter"
            aria-label="Filter">
            <FilterIcon className="h-4 w-4 text-foreground" />
          </Link>
          <BottomNav editingTransaction={editingTransaction} onEditComplete={handleEditComplete} />
        </div>
      </div>
      <ul className="px-4">
        {transactions.length === 0 ? (
          <div className="text-sm text-muted-foreground px-1 py-8 text-center">
            No transactions yet. Tap + to add one.
          </div>
        ) : (
          [...transactions]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((transaction) => (
              <li
                key={transaction.id}
                className="flex justify-between items-center bg-accent/60 p-3 rounded-xl mb-2">
                <div>
                  <div className="flex gap-1 items-center text-xs text-muted-foreground">
                    <p>{format(new Date(transaction.date), "MMM d, yyyy")}</p>
                    <p>•</p>
                    <p>{transaction.category}</p>
                  </div>
                  <p className="font-medium">{transaction.title}</p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`font-semibold mr-2 ${transaction.type === "expense"
                      ? "text-red-600"
                      : "text-green-600"
                      }`}>
                    {transaction.type === "expense" ? "-" : "+"}
                    {cstr(currency)}
                    {transaction.amount}
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <EllipsisVerticalIcon className="h-4 w-4 outline-none" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuItem asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full cursor-pointer justify-start opacity-100 px-2.5" 
                          onClick={() => handleEdit(transaction)}
                        >
                          Edit
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full cursor-pointer justify-start opacity-45 hover:opacity-100 text-xs text-red-500"
                          onClick={() => setDeletingTransaction(transaction)}
                        >
                          Delete
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            ))
        )}
      </ul>

      <Dialog open={!!deletingTransaction} onOpenChange={(open) => !open && setDeletingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingTransaction?.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline">
                <X />
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => deletingTransaction && handleDelete(deletingTransaction.id)}
              variant="destructive">
              <Trash2 />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}