"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion } from "lucide-react";
import { SupportModal } from "./SupportModal";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function SupportButton() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const isHighContrast = user.accessibilityOptions?.highContrast;
  const isLargeText = user.accessibilityOptions?.largeText;

  return (
    <>
      <div className="fixed bottom-28 right-4 z-40 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "rounded-full shadow-xl border-2 transition-transform hover:scale-110 active:scale-95",
            isLargeText ? "h-16 w-16" : "h-14 w-14",
            isHighContrast 
              ? "bg-yellow-400 text-black border-white hover:bg-yellow-300" 
              : "bg-white text-blue-600 border-blue-100 hover:bg-blue-50"
          )}
          aria-label="Abrir Suporte"
        >
          <MessageCircleQuestion className={cn(isLargeText ? "h-8 w-8" : "h-7 w-7")} />
        </Button>
      </div>

      <SupportModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}