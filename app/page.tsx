"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BrainCogIcon,
  CogIcon,
  EllipsisVerticalIcon,
  FilterIcon,
  PencilIcon,
  ScrollText,
  Trash2,
  Trash2Icon,
  X,
} from "lucide-react";
import {
  deleteTransaction,
  getCurrencyCode,
  getTransactions,
  Transaction,
} from "@/utils/dataManager";
import { CurrencyCode, formatCurrency } from "@/lib/currency";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
    setTransactions(getTransactions());
    window.dispatchEvent(new Event("transactions:changed"));
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
                    {formatCurrency(transaction.amount, currency)}
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <EllipsisVerticalIcon className="h-4 w-4 outline-none" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuLabel asChild>
                        <Button variant="ghost" className="w-full cursor-pointer justify-start opacity-100 px-2.5" onClick={() => handleEdit(transaction)}>
                          Edit
                        </Button>
                      </DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        {deleteDialog({
                          transaction,
                          handleDelete,
                        })}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            ))
        )}
      </ul>
    </div>
  );
}

function deleteDialog({
  transaction,
  handleDelete,
}: {
  transaction: Transaction;
  handleDelete: (id: string) => void;
}) {
  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full cursor-pointer justify-start opacity-45 hover:opacity-100 text-xs">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this transaction?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <DialogClose asChild>
            <Button variant="outline">
              {" "}
              <X />
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => handleDelete(transaction.id)}
              variant="destructive">
              <Trash2 />
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}