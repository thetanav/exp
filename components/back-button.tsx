"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      className="flex gap-1 items-center justify-center text-sm hover:underline cursor-pointer"
      onClick={() => router.back()}>
      back
    </button>
  );
}
