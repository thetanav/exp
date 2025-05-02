"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCogIcon, EllipsisVerticalIcon, FilterIcon } from "lucide-react";
import {
  getTransactions,
  Transaction,
  deleteTransaction,
} from "@/utils/dataManager";
import {
  Dialog,
  DialogContent,
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
import EditTransactionForm from "@/components/EditTransactionForm";
import { format } from "date-fns";
import BottomNav from "@/components/BottomNav";
import Expninc from "@/components/expninc";
import { DialogDescription } from "@radix-ui/react-dialog";
import { UserButton } from "@civic/auth-web3/react";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(getTransactions());
    }, 1000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  const thisMonthExpense = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthEarning = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        new Date(t.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setTransactions(getTransactions());
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleEditComplete = () => {
    setEditingTransaction(null);
    setTransactions(getTransactions());
  };

  return (
    <div className="h-full w-full flex flex-col gap-6">
      <div className="flex w-full items-center justify-end mt-5">
        <Link
          href="/wallet"
          className="px-6 h-full rounded-full bg-red-500 text-white font-bold flex items-center justify-center mr-2">
          Wallet
        </Link>
        <UserButton />
      </div>
      <Expninc
        thisMonthEarning={thisMonthEarning}
        thisMonthExpense={thisMonthExpense}
      />
      <div className="flex justify-between px-4">
        <h2 className="text-lg font-semibold tracking-tight">
          recent transactions
        </h2>
        <div className="flex gap-1">
          <Link
            className="px-3 py-1 rounded-full bg-accent flex items-center"
            href="/analysis">
            <BrainCogIcon className="h-4 w-4 text-black" />
          </Link>
          <Link
            className="px-3 py-1 rounded-full bg-accent flex items-center"
            href="/filter">
            <FilterIcon className="h-4 w-4 text-black" />
          </Link>
          <BottomNav />
        </div>
      </div>
      <ul className="overflow-x-auto px-4">
        {transactions.map((transaction) => (
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
                className={`font-semibold mr-2 ${
                  transaction.type === "expense" && "text-red-500"
                }`}>
                ${transaction.amount.toFixed(2)}
              </span>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button>
                    <EllipsisVerticalIcon className="h-4 w-4 outline-none" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left">
                  <DropdownMenuLabel asChild>
                    {editDialog({
                      transaction,
                      handleEdit,
                      handleEditComplete,
                      editingTransaction,
                    })}
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
        ))}
      </ul>
    </div>
  );
}

function deleteDialog({ transaction, handleDelete }: any) {
  return (
    <Dialog modal={false}>
      <DialogTitle className="sr-only">Delete!?</DialogTitle>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full cursor-pointer justify-start">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
        </DialogHeader>
        <DialogDescription>Are you sure?</DialogDescription>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <Button>Cancel</Button>
          <Button
            onClick={() => handleDelete(transaction.id)}
            variant="outline">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function editDialog({
  transaction,
  handleEdit,
  editingTransaction,
  handleEditComplete,
}: any) {
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full cursor-pointer justify-start"
          onClick={() => handleEdit(transaction)}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        {editingTransaction && (
          <EditTransactionForm
            transaction={editingTransaction}
            onComplete={handleEditComplete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
