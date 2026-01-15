"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAdvancedFilteredTransactions,
  FilterOptions,
  Transaction,
} from "@/utils/dataManager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import BackButton from "@/components/back-button";
import categories from "@/lib/categories";
import { CalendarIcon, ListFilterPlus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FilterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  );
  const dateFrom = dateRange?.from;
  const dateTo = dateRange?.to;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<
    "expense" | "income" | undefined
  >(undefined);

  useEffect(() => {
    const options: FilterOptions = {
      search: searchQuery || undefined,
      categories:
        selectedCategories.length > 0 ? selectedCategories : undefined,
      type: selectedType,
      dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
      dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
    };
    setFilterOptions(options);
    setFilteredTransactions(getAdvancedFilteredTransactions(options));
  }, [searchQuery, selectedCategories, selectedType, dateFrom, dateTo]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleType = (type: "expense" | "income") => {
    setSelectedType((prev) => (prev === type ? undefined : type));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDateRange(undefined);
    setSelectedCategories([]);
    setSelectedType(undefined);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedType ||
    dateFrom ||
    dateTo;

  return (
    <div className="h-full w-full flex flex-col pt-4">
      <div className="flex-col items-center justify-between px-4">
        <BackButton />
        <h2 className="text-lg font-semibold tracking-tight">Filter</h2>
      </div>
      <div className="px-4 my-3">
        <div className="flex gap-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 w-4 -translate-y-1/2 opacity-60" />
            <Input
              type="text"
              placeholder="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={"icon"}>
                <ListFilterPlus />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                {/* Date Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange?.from && "text-muted-foreground"
                        )}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <span>
                              {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                              {format(dateRange.to, "MMM dd, yyyy")}
                            </span>
                          ) : (
                            format(dateRange.from, "MMM dd, yyyy")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 overflow-hidden"
                      align="center">
                      <Calendar
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1} //TODO: on mobile 1 else 2
                        className="overflow-scroll"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Category/Emoji Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Categories</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center space-x-2">
                        <Checkbox
                          id={category.name}
                          checked={selectedCategories.includes(category.name)}
                          onCheckedChange={() => toggleCategory(category.name)}
                        />
                        <Label
                          htmlFor={category.name}
                          className="flex items-center gap-2 cursor-pointer">
                          <img
                            src={`https://emojicdn.elk.sh/${category.emoji}?style=apple`}
                            alt={category.name}
                            className="w-5 h-5"
                          />
                          <span>{category.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Type</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="expense"
                        checked={selectedType === "expense"}
                        onCheckedChange={() => toggleType("expense")}
                      />
                      <Label htmlFor="expense" className="cursor-pointer">
                        Expenses
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="income"
                        checked={selectedType === "income"}
                        onCheckedChange={() => toggleType("income")}
                      />
                      <Label htmlFor="income" className="cursor-pointer">
                        Incomes
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full justify-center gap-2">
                    <X className="h-4 w-4 opacity-70" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ul className="overflow-x-auto px-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-sm text-muted-foreground px-1 py-8 text-center">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
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
          ))
        )}
      </ul>
    </div>
  );
}
