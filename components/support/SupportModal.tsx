"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { SupportCategory } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  
  const isHighContrast = user?.accessibilityOptions?.highContrast;
  const isLargeText = user?.accessibilityOptions?.largeText;

  const [category, setCategory] = useState<SupportCategory>('DUVIDA');
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.email) return;

    setLoading(true);
    try {
      await api.sendSupportMessage({
        nome: user.name || "Usuário",
        email: user.email,
        categoria: category,
        assunto: subject,
        mensagem: message
      });
      
      alert("Mensagem enviada com sucesso! Responderemos em breve.");
      setSubject("");
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Erro ao enviar suporte", error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
          "sm:max-w-md transition-colors duration-300",
          isHighContrast ? "bg-zinc-900 border-2 border-yellow-400 text-white" : "bg-white"
      )}>
        <DialogHeader>
          <DialogTitle className={cn("font-bold", isHighContrast && "text-yellow-400", isLargeText ? "text-2xl" : "text-xl")}>
            Central de Ajuda
          </DialogTitle>
          <DialogDescription className={cn(isHighContrast ? "text-white" : "text-slate-500", isLargeText && "text-base")}>
            Dúvidas, sugestões ou problemas? Fale com a gente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          
          <div className="space-y-2">
            <Label className={cn(isHighContrast && "text-white", isLargeText && "text-lg")}>Categoria</Label>
            <Select onValueChange={(v) => setCategory(v as SupportCategory)} defaultValue={category}>
              <SelectTrigger className={cn(isHighContrast ? "bg-black border-white text-white" : "bg-slate-50", isLargeText && "h-12 text-lg")}>
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DUVIDA">Dúvida</SelectItem>
                <SelectItem value="SUGESTAO">Sugestão</SelectItem>
                <SelectItem value="SUPORTE_TECNICO">Problema Técnico</SelectItem>
                <SelectItem value="OUTRO">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className={cn(isHighContrast && "text-white", isLargeText && "text-lg")}>Assunto</Label>
            <Input 
              id="subject" 
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Erro no pagamento Pix"
              className={cn(isHighContrast ? "bg-black border-white text-white placeholder:text-gray-500" : "bg-slate-50", isLargeText && "h-12 text-lg")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className={cn(isHighContrast && "text-white", isLargeText && "text-lg")}>Mensagem</Label>
            <Textarea 
              id="message" 
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descreva detalhadamente..."
              className={cn("min-h-[100px]", isHighContrast ? "bg-black border-white text-white placeholder:text-gray-500" : "bg-slate-50", isLargeText && "text-lg")}
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className={cn(
              "w-full font-bold mt-2",
              isHighContrast 
                ? "bg-yellow-400 text-black hover:bg-yellow-500" 
                : "bg-blue-600 hover:bg-blue-700 text-white",
              isLargeText ? "h-14 text-xl" : "h-11"
            )}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : (
              <>
                <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
              </>
            )}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  );
}