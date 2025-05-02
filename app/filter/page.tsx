"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getFilteredTransactions, Transaction } from "@/utils/dataManager";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";
import BackButton from "@/components/back-button";
import categories from "@/lib/categories";

export default function FilterTags() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  useEffect(() => {
    setFilteredTransactions(getFilteredTransactions(selectedTags));
  }, [selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="pt-16">
      <BackButton />
      <div className="flex items-center justify-between px-5 gap-4 mb-3">
        <h2 className="text-lg font-semibold tracking-tight">Filter</h2>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Select Tags
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {categories.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag.name}
                checked={selectedTags.includes(tag.name)}
                onCheckedChange={() => toggleTag(tag.name)}
                className="cursor-pointer">
                <div className="flex items-center">
                  <img
                    src={`https://emojicdn.elk.sh/${tag.emoji}?style=apple`}
                    alt={tag.name}
                    className="w-6 h-6 mr-2"
                  />
                  {tag.name}
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ul className="overflow-x-auto px-4">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No transactions found
          </p>
        ) : (
          <ul>
            {filteredTransactions.map((transaction) => (
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
                </div>
              </li>
            ))}
          </ul>
        )}
      </ul>
    </div>
  );
}
