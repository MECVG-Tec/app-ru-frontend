"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Eye, Type, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityModal({ isOpen, onClose }: Props) {
  const { user, updateUserPreferences } = useAuth();
  
  const [highContrast, setHighContrast] = useState(user?.accessibilityOptions?.highContrast ?? false);
  const [largeText, setLargeText] = useState(user?.accessibilityOptions?.largeText ?? false);
  const [simpleLanguage, setSimpleLanguage] = useState(false);
  
  const [loading, setLoading] = useState(false);

  const isHC = user?.accessibilityOptions?.highContrast;
  const isLarge = user?.accessibilityOptions?.largeText;

  async function handleSave() {
    if (!user?.email) return;
    setLoading(true);
    try {
      await api.updateAccessibility({
        email: user.email,
        prefereAltoContraste: highContrast,
        prefereFonteGrande: largeText,
        prefereLinguagemSimples: simpleLanguage
      });

      updateUserPreferences({
        highContrast,
        largeText
      });

      onClose();
    } catch (error) {
      console.error("Erro ao salvar preferências", error);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={cn(
          "sm:max-w-sm transition-colors duration-300",
          isHC ? "bg-zinc-900 border-2 border-yellow-400 text-white" : "bg-white"
      )}>
        <DialogHeader>
          <DialogTitle className={cn("font-bold", isHC && "text-yellow-400", isLarge ? "text-2xl" : "text-xl")}>
            Acessibilidade
          </DialogTitle>
          <DialogDescription className={cn(isHC ? "text-white" : "text-slate-500", isLarge && "text-base")}>
            Ajuste a interface para suas necessidades.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className={cn("p-2 rounded-lg", isHC ? "bg-yellow-400 text-black" : "bg-slate-100 text-slate-600")}>
                 <Eye className="h-5 w-5" />
               </div>
               <div className="flex flex-col">
                 <Label htmlFor="contrast" className={cn("font-semibold cursor-pointer", isLarge && "text-lg")}>Alto Contraste</Label>
                 <span className={cn("text-xs", isHC ? "text-gray-300" : "text-slate-500", isLarge && "text-sm")}>Cores fortes e fundo escuro</span>
               </div>
            </div>
            <Switch 
              id="contrast" 
              checked={highContrast} 
              onCheckedChange={setHighContrast} 
              className={cn(isHC && "data-[state=checked]:bg-yellow-400 data-[state=checked]:border-white")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className={cn("p-2 rounded-lg", isHC ? "bg-yellow-400 text-black" : "bg-slate-100 text-slate-600")}>
                 <Type className="h-5 w-5" />
               </div>
               <div className="flex flex-col">
                 <Label htmlFor="text" className={cn("font-semibold cursor-pointer", isLarge && "text-lg")}>Fonte Grande</Label>
                 <span className={cn("text-xs", isHC ? "text-gray-300" : "text-slate-500", isLarge && "text-sm")}>Aumenta o tamanho dos textos</span>
               </div>
            </div>
            <Switch 
              id="text" 
              checked={largeText} 
              onCheckedChange={setLargeText}
              className={cn(isHC && "data-[state=checked]:bg-yellow-400 data-[state=checked]:border-white")}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className={cn(
              "w-full font-bold",
              isHC ? "bg-yellow-400 text-black hover:bg-yellow-500" : "bg-slate-900 text-white",
              isLarge && "h-12 text-lg"
            )}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Salvar Preferências"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}