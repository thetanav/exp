import { convertToModelMessages, streamText, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, transactions }: { messages: UIMessage[]; transactions: any[] } = await req.json();

  // Calculate financial summary for context
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = transactions.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { expense: 0, income: 0 };
    acc[t.category][t.type] += t.amount;
    return acc;
  }, {} as Record<string, { expense: number; income: number }>);

  // Get monthly data
  const currentMonth = new Date().getMonth();
  const thisMonthTransactions = transactions.filter(
    (t) => new Date(t.date).getMonth() === currentMonth
  );
  
  const thisMonthExpense = thisMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const thisMonthIncome = thisMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const systemPrompt = `You are a helpful and friendly personal finance assistant. You help users understand their spending habits, provide insights, and offer practical advice.

Current Financial Data:
- Total Income (all time): $${totalIncome.toFixed(2)}
- Total Expenses (all time): $${totalExpense.toFixed(2)}
- Net Balance: $${(totalIncome - totalExpense).toFixed(2)}

This Month:
- Income: $${thisMonthIncome.toFixed(2)}
- Expenses: $${thisMonthExpense.toFixed(2)}
- Balance: $${(thisMonthIncome - thisMonthExpense).toFixed(2)}

Category Breakdown:
${Object.entries(categoryBreakdown)
  .map(([cat, data]: [string, any]) => `- ${cat}: Spent $${data.expense.toFixed(2)}, Earned $${data.income.toFixed(2)}`)
  .join("\n")}

Total Transactions: ${transactions.length}

Recent Transactions (last 5):
${transactions
  .slice(-5)
  .map((t) => `- ${t.title}: $${t.amount} (${t.type}, ${t.category})`)
  .join("\n")}

Guidelines:
- Be concise and mobile-friendly in responses (short paragraphs)
- Use simple language and avoid jargon
- Give specific, actionable advice when asked
- Reference the user's actual data when relevant
- Be encouraging but honest about spending habits
- When asked about trends, analyze the data provided
- Format numbers as currency with $ sign`;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
