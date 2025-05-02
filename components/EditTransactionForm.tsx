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
    editTransaction({
      ...transaction,
      title,
      amount: parseFloat(amount),
      category: selectedCategory,
    });
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <Label htmlFor="title" className="text-sm font-medium">
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
              className="flex flex-col items-center p-3 h-auto">
              <img
                src={`https://emojicdn.elk.sh/${category.emoji}?style=apple`}
                alt={category.name}
                className="w-9 h-9 mb-1"
              />
            </Button>
          ))}
        </div>
      </div>
      <Button
        type="submit"
        className="py-5 text-md bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow mt-4">
        Save Changes
      </Button>
    </form>
  );
}
