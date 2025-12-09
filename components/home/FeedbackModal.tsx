"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; // Assumindo shadcn/ui dialog
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mealType: "ALMOCO" | "JANTAR";
}

export function FeedbackModal({ isOpen, onClose, mealType }: Props) {
  const { user } = useAuth();
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Avaliar {mealType === 'ALMOCO' ? 'Almoço' : 'Jantar'}</h3>
          <p className="text-xs text-slate-500">O que achou da refeição de hoje?</p>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
              <Star 
                className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} 
              />
            </button>
          ))}
        </div>

        <Textarea 
          placeholder="Deixe um comentário (opcional)..." 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="text-sm mb-4 bg-slate-50"
        />

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Pular</Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleSubmit}
            disabled={rating === 0 || sending}
          >
            {sending ? "Enviando..." : "Avaliar (+10xp)"}
          </Button>
        </div>
      </div>
    </div>
  );
}