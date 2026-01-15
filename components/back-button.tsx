"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      className="flex gap-1 items-center justify-center text-xs hover:underline cursor-pointer opacity-70"
      onClick={() => router.back()}>
      <ArrowLeft className="w-3 h-3" />
      back
    </button>
  );
}
