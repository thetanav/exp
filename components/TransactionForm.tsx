"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveTransaction, editTransaction, Transaction } from "@/utils/dataManager";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import categories from "@/lib/categories";

interface TransactionFormProps {
  type?: "expense" | "income";
  transaction?: Transaction;
  onClose: () => void;
}

export default function TransactionForm({
  type = "expense",
  transaction,
  onClose,
}: TransactionFormProps) {
  const isEditing = !!transaction;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(transaction?.title ?? "");
  const [amount, setAmount] = useState(transaction?.amount.toString() ?? "");
  const [selectedCategory, setSelectedCategory] = useState(
    transaction?.category ?? categories[0]?.name ?? ""
  );
  const [date, setDate] = useState<Date | undefined>(
    transaction ? new Date(transaction.date) : new Date()
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const parsedAmount = Number.parseFloat(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return;
    if (!selectedCategory) return;
    if (!title.trim()) return;
    if (!date) return;

    if (isEditing && transaction) {
      editTransaction({
        ...transaction,
        title: title.trim(),
        amount: parsedAmount,
        category: selectedCategory,
        date: date.toISOString(),
      });
    } else {
      saveTransaction({
        type,
        title: title.trim(),
        amount: parsedAmount,
        category: selectedCategory,
        date: date.toISOString(),
      });
    }

    window.dispatchEvent(new Event("transactions:changed"));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <Label htmlFor="title" className="text-xs font-medium">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Coffee, rent, salary"
          required
          className="text-md py-2"
        />
      </div>
      <div>
        <Label htmlFor="amount" className="text-xs font-medium">
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          inputMode="decimal"
          min={0.01}
          step={0.01}
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="text-md py-2"
        />
      </div>
      <div>
        <Label className="text-xs font-medium">Category</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {categories.map((category) => (
            <Button
              key={category.name}
              type="button"
              variant={selectedCategory === category.name ? "outline" : "ghost"}
              onClick={() => setSelectedCategory(category.name)}
              className="flex flex-col items-center p-2 h-auto">
              <img
                src={`https://emojicdn.elk.sh/${category.emoji}?style=apple`}
                alt={category.name}
                className="w-9 h-9 mb-1"
              />
              <span className="text-[10px] leading-none text-muted-foreground">
                {category.name}
              </span>
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-xs font-medium">Date</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal mt-1 text-md py-3`}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-1" align="start">
            <Calendar
              mode="single"
              selected={date}
              // className="[--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button
        type="submit"
        className="py-5 text-md bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow mt-4">
        {isEditing ? "Save Changes" : `Add ${type === "expense" ? "Expense" : "Income"}`}
      </Button>
    </form>
  );
}
