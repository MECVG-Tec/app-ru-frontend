"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mealType: "ALMOCO" | "JANTAR";
}

export function FeedbackModal({ isOpen, onClose, mealType }: Props) {
  const { user } = useAuth();
  const isHighContrast = user?.accessibilityOptions?.highContrast;
  const isLargeText = user?.accessibilityOptions?.largeText;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!user?.email || rating === 0) return;
    setSending(true);
    try {
      await api.sendFeedback({
        nome: user.name || "Anonimo",
        email: user.email,
        date: dayjs().format("YYYY-MM-DD"),
        mealType: mealType,
        rating: rating,
        comentario: comment
      });
      alert("Obrigado! Você ganhou pontos por avaliar.");
      onClose();
    } catch (error) {
      console.error("Erro ao enviar feedback", error);
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={cn(
          "sm:max-w-sm transition-colors",
          isHighContrast ? "bg-zinc-900 border-2 border-yellow-400 text-white" : "bg-white"
      )}>
        <div className="text-center mb-4">
          <h3 className={cn("font-bold", isHighContrast ? "text-yellow-400" : "text-slate-900", isLargeText ? "text-2xl" : "text-lg")}>
            Avaliar {mealType === 'ALMOCO' ? 'Almoço' : 'Jantar'}
          </h3>
          <p className={cn(isHighContrast ? "text-white" : "text-slate-500", isLargeText ? "text-base" : "text-xs")}>
            O que achou da refeição de hoje?
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
              <Star 
                className={cn(
                    isLargeText ? "h-10 w-10" : "h-8 w-8",
                    star <= rating 
                        ? (isHighContrast ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400 text-yellow-400") 
                        : (isHighContrast ? "text-white" : "text-slate-300")
                )} 
              />
            </button>
          ))}
        </div>

        <Textarea 
          placeholder="Deixe um comentário (opcional)..." 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={cn(
              "mb-4",
              isHighContrast ? "bg-black text-white border-white placeholder:text-gray-400" : "bg-slate-50 text-sm",
              isLargeText && "text-base h-24"
          )}
        />

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className={cn("flex-1", isHighContrast && "text-white border-white hover:bg-zinc-800", isLargeText && "h-12 text-lg")} 
            onClick={onClose}
          >
            Pular
          </Button>
          <Button 
            className={cn(
                "flex-1 font-bold",
                isHighContrast ? "bg-yellow-400 text-black hover:bg-yellow-500" : "bg-blue-600 hover:bg-blue-700 text-white",
                isLargeText && "h-12 text-lg"
            )}
            onClick={handleSubmit}
            disabled={rating === 0 || sending}
          >
            {sending ? "Enviando..." : "Avaliar (+10xp)"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}