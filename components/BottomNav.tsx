"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PlusIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionForm from "./TransactionForm";
import { Transaction } from "@/utils/dataManager";

interface BottomNavProps {
  editingTransaction?: Transaction | null;
  onEditComplete?: () => void;
}

export default function BottomNav({ editingTransaction, onEditComplete }: BottomNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (editingTransaction) {
      setIsOpen(true);
    }
  }, [editingTransaction]);

  const handleClose = () => {
    setIsOpen(false);
    window.dispatchEvent(new Event("transactions:changed"));
    router.refresh();
    if (editingTransaction && onEditComplete) {
      onEditComplete();
    }
  };

  const renderContent = () => {
    if (editingTransaction) {
      return (
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleClose}
        />
      );
    }

    return (
      <Tabs defaultValue="expense" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="expense" className="text-sm py-2">
            Expense
          </TabsTrigger>
          <TabsTrigger value="income" className="text-sm py-2">
            Income
          </TabsTrigger>
        </TabsList>
        <TabsContent value="expense">
          <TransactionForm type="expense" onClose={handleClose} />
        </TabsContent>
        <TabsContent value="income">
          <TransactionForm type="income" onClose={handleClose} />
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetTrigger asChild>
        <button className="px-3 py-1 rounded-full from-black/60 to-black dark:from-white dark:to-neutral-300 bg-gradient-to-br shadow">
          <PlusIcon className="h-4 w-4 dark:text-black text-white" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[70vh] max-w-md mx-auto rounded-t-2xl overflow-y-auto scrollbar-none">
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}
