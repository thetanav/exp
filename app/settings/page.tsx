"use client";

import { useState, useEffect } from "react";
import BackButton from "@/components/back-button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getCurrencyCode, setCurrencyCode } from "@/utils/dataManager";
import { CurrencyCode, CURRENCY_OPTIONS } from "@/lib/currency";
import { useTheme } from "next-themes";
import { ThemeProvider } from "@/components/theme-provider";

export default function SettingsPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    setCurrency(getCurrencyCode());
  }, []);

  const handleCurrencyChange = (value: CurrencyCode) => {
    setCurrency(value);
    setCurrencyCode(value);
  };

  const handleThemeChange = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <div className="h-full w-full flex flex-col pt-4">
      <div className="flex items-center justify-between px-4">
        <BackButton />
        <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
        <div className="w-9" />
      </div>

      <div className="px-4 mt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-sm font-medium">
            Currency
          </Label>
          <Select value={currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger id="currency" className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Currency</SelectLabel>
                {CURRENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.code} value={option.code}>
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {option.symbol}
                      </span>
                      <span>{option.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose your preferred currency for displaying amounts
          </p>
        </div>

        <a href="https://shoo.dev/authorize?redirect_uri=http://localhost:3000/success">Login</a>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Theme</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={handleThemeChange}
            />
            <Label
              htmlFor="dark-mode"
              className="cursor-pointer"
            >
              Dark mode
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Toggle between light and dark themes
          </p>
        </div>
      </div>
    </div>
  );
}
