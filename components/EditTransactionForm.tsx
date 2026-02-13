import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Transaction, editTransaction } from "@/utils/dataManager";
import categories from "@/lib/categories";

interface EditTransactionFormProps {
  transaction: Transaction;
  onComplete: () => void;
}

export default function EditTransactionForm({
  transaction,
  onComplete,
}: EditTransactionFormProps) {
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [selectedCategory, setSelectedCategory] = useState(
    transaction.category
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = Number.parseFloat(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return;
    if (!selectedCategory) return;

    editTransaction({
      ...transaction,
      title: title.trim(),
      amount: parsedAmount,
      category: selectedCategory,
    });

    window.dispatchEvent(new Event("transactions:changed"));
    onComplete();
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
                loading="eager"
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
      <Button
        type="submit"
        className="py-5 text-md bg-linear-to-br from-green-400 to-green-600 active:from-green-500 active:to-green-700 text-white border shadow mt-4">
        Save Changes
      </Button>
    </form>
  );
}
