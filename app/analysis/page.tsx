"use client";

import { useEffect, useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { getTransactions, Transaction } from "@/utils/dataManager";
import BackButton from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  SendIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
  SparklesIcon,
  Loader2Icon,
  MenuIcon,
  KeyRoundIcon,
  Trash2Icon,
} from "lucide-react";
import { Geist_Mono } from "next/font/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const mono = Geist_Mono({ subsets: ["latin"] });

interface CategoryData {
  name: string;
  expense: number;
  income: number;
  percentage: number;
}

const SUGGESTED_PROMPTS = [
  "How am I doing this month?",
  "Where can I cut spending?",
  "Analyze my habits",
  "Tips to save more",
];

export default function Analysis() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [openRouterApiKey, setOpenRouterApiKey] = useState<string>("");
  const [openRouterApiKeyDraft, setOpenRouterApiKeyDraft] =
    useState<string>("");
  const [openRouterKeySavedAt, setOpenRouterKeySavedAt] = useState<
    number | null
  >(null);

  useEffect(() => {
    const saved = localStorage.getItem("openrouter_api_key") || "";
    setOpenRouterApiKey(saved);
    setOpenRouterApiKeyDraft(saved);

    const savedAtRaw = localStorage.getItem("openrouter_api_key_saved_at");
    const savedAt = savedAtRaw ? Number(savedAtRaw) : null;
    setOpenRouterKeySavedAt(Number.isFinite(savedAt) ? savedAt : null);
  }, []);

  const saveOpenRouterKey = () => {
    const cleaned = openRouterApiKeyDraft.trim();
    setOpenRouterApiKey(cleaned);

    if (cleaned) {
      const now = Date.now();
      localStorage.setItem("openrouter_api_key", cleaned);
      localStorage.setItem("openrouter_api_key_saved_at", String(now));
      setOpenRouterKeySavedAt(now);
      return;
    }

    localStorage.removeItem("openrouter_api_key");
    localStorage.removeItem("openrouter_api_key_saved_at");
    setOpenRouterKeySavedAt(null);
  };

  const clearOpenRouterKey = () => {
    setOpenRouterApiKey("");
    setOpenRouterApiKeyDraft("");
    localStorage.removeItem("openrouter_api_key");
    localStorage.removeItem("openrouter_api_key_saved_at");
    setOpenRouterKeySavedAt(null);
  };

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";
  const hasOpenRouterKey = openRouterApiKey.trim().length > 0;

  useEffect(() => {
    const txns = getTransactions();
    setTransactions(txns);

    // Calculate category data
    const categoryMap = txns.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = { expense: 0, income: 0 };
      acc[t.category][t.type] += t.amount;
      return acc;
    }, {} as Record<string, { expense: number; income: number }>);

    const totalExpense = txns
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const data = Object.entries(categoryMap).map(([name, data]) => ({
      name,
      expense: data.expense,
      income: data.income,
      percentage: totalExpense > 0 ? (data.expense / totalExpense) * 100 : 0,
    }));

    setCategoryData(data.sort((a, b) => b.expense - a.expense));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim() && status === "ready" && hasOpenRouterKey) {
      sendMessage(
        { text: input },
        {
          body: {
            transactions,
            openRouterApiKey,
          },
        }
      );
      setInput("");
      inputRef.current?.focus();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    if (status === "ready" && hasOpenRouterKey) {
      sendMessage(
        { text: prompt },
        {
          body: {
            transactions,
            openRouterApiKey,
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <BackButton />
        <h2 className="text-lg font-semibold tracking-tight">
          Finance Assistant
        </h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRoundIcon className="h-4 w-4 opacity-70" />
                OpenRouter API Key
              </DialogTitle>
              <DialogDescription>
                Saved locally in this browser. Not synced.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <input
                type="password"
                value={openRouterApiKeyDraft}
                onChange={(e) => setOpenRouterApiKeyDraft(e.target.value)}
                placeholder="Paste your OpenRouter API key"
                className="w-full bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />

              <p className="text-xs text-muted-foreground">
                {openRouterApiKey
                  ? `Saved locally${
                      openRouterKeySavedAt
                        ? ` · updated ${new Date(
                            openRouterKeySavedAt
                          ).toLocaleString()}`
                        : ""
                    }`
                  : "Not set yet"}
              </p>
            </div>

            <DialogFooter className="flex flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={clearOpenRouterKey}
                className="gap-2">
                <Trash2Icon className="h-4 w-4 opacity-70" />
                Clear
              </Button>
              <Button
                type="button"
                onClick={saveOpenRouterKey}
                className="gap-2">
                <KeyRoundIcon className="h-4 w-4" />
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 min-h-0 px-2 flex flex-col">
        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-4">
                Ask me anything about your finances!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    disabled={status !== "ready" || !hasOpenRouterKey}
                    className="text-xs px-3 py-1.5 bg-background hover:bg-background/80 rounded-full border border-border transition-colors disabled:opacity-50">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background"
                    }`}>
                    {message.role === "user" ? (
                      <p className="text-sm whitespace-pre-wrap">
                        {message.parts
                          .filter(
                            (part): part is { type: "text"; text: string } =>
                              part.type === "text"
                          )
                          .map((part) => part.text)
                          .join("")}
                      </p>
                    ) : (
                      <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                        {message.parts
                          .filter(
                            (part): part is { type: "text"; text: string } =>
                              part.type === "text"
                          )
                          .map((part, index) => (
                            <Streamdown
                              key={index}
                              isAnimating={status === "streaming"}>
                              {part.text}
                            </Streamdown>
                          ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start">
                  <div className="bg-background border border-border rounded-2xl px-4 py-2">
                    <Loader2Icon className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            disabled={status !== "ready" || !hasOpenRouterKey}
            className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
          <Button
            type="submit"
            size="icon"
            disabled={status !== "ready" || !hasOpenRouterKey || !input.trim()}
            className="rounded-full h-10 w-10 flex-shrink-0">
            {isLoading ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 text-center shrink-0">
        <p className="text-xs text-muted-foreground">
          ai can make mistakes please recheck
        </p>
      </div>
    </div>
  );
}
