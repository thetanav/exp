import { Geist_Mono } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { Instrument_Serif } from "next/font/google";

const mono = Geist_Mono({ subsets: ["latin"] });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400" });

export default function Expninc({
  thisMonthExpense,
  thisMonthEarning,
}: {
  thisMonthExpense: number;
  thisMonthEarning: number;
}) {
  const total = thisMonthEarning - thisMonthExpense;

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-60 bg-linear-to-b from-neutral-100 to-background">
      <p className={`text-xl text-black/60 tracking-tight ${serif.className}`}>
        Total balance
      </p>
      <AnimatePresence mode="wait">
        <motion.h2
          key={total}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.1, ease: "linear" }}
          className={`text-5xl font-semibold transition-all ${
            total < 0 && "text-red-500"
          } ${mono.className}`}>
          ${Math.abs(total)}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}
