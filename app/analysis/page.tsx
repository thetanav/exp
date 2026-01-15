"use client";

import { useEffect, useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { getTransactions, Transaction } from "@/utils/dataManager";
import BackButton from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  SendIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
  SparklesIcon,
  Loader2Icon,
} from "lucide-react";
import { Geist_Mono } from "next/font/google";

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

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { transactions },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

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
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    if (status === "ready") {
      sendMessage({ text: prompt });
    }
  };

  return (
    <div className="flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <BackButton />
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold tracking-tight">
            Finance Assistant
          </h3>
        </div>
      </div>

      <div className="flex-2 h-full px-2">
        <div className="space-y-3 flex-2 overflow-y-auto">
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
                    disabled={status !== "ready"}
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
                        : "bg-background border border-border"
                    }`}>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.parts
                        .filter(
                          (part): part is { type: "text"; text: string } =>
                            part.type === "text"
                        )
                        .map((part) => part.text)
                        .join("")}
                    </p>
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
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            disabled={status !== "ready"}
            className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
          <Button
            type="submit"
            size="icon"
            disabled={status !== "ready" || !input.trim()}
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
      <div className="px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          ai can make mistakes please recheck
        </p>
      </div>
    </div>
  );
}
