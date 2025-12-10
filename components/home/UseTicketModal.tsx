"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Utensils, Moon, CheckCircle2, QrCode, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { QRCodeSVG } from 'qrcode.react';
import { cn } from "@/lib/utils";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (mealType: 'ALMOCO' | 'JANTAR') => void;
}

type ModalStep = 'SELECT' | 'QRCODE' | 'SUCCESS';

export function UseTicketModal({ isOpen, onClose, onSuccess }: Props) {
    const { user } = useAuth();
    const isHighContrast = user?.accessibilityOptions?.highContrast;
    const isLargeText = user?.accessibilityOptions?.largeText;

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<ModalStep>('SELECT');
    const [selectedMeal, setSelectedMeal] = useState<'ALMOCO' | 'JANTAR' | null>(null);
    const [qrToken, setQrToken] = useState("");

    function handleSelectMeal(type: 'ALMOCO' | 'JANTAR') {
        setSelectedMeal(type);
        const randomToken = `VALIDAR-${type}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        setQrToken(randomToken);
        setStep('QRCODE');
    }

    async function handleConfirmConsumption() {
        if (!user?.email || !selectedMeal) return;
        
        setLoading(true);
        try {
            await api.consumeToken(user.email, selectedMeal);
            setStep('SUCCESS');
            setTimeout(() => {
                onSuccess(selectedMeal);
                handleClose();
            }, 2000);
        } catch (error) {
            alert("Erro ao processar utilização. Tente novamente.");
            setStep('QRCODE'); 
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        setTimeout(() => {
            setStep('SELECT');
            setSelectedMeal(null);
            setQrToken("");
        }, 300);
        setLoading(false);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className={cn(
                "sm:max-w-sm text-center transition-colors",
                isHighContrast ? "bg-zinc-900 border-2 border-yellow-400 text-white" : "bg-white"
            )}>
                
                {step === 'SELECT' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <DialogHeader>
                            <DialogTitle className={cn("font-bold", isLargeText ? "text-2xl" : "text-xl", isHighContrast && "text-yellow-400")}>
                                Utilizar Ficha
                            </DialogTitle>
                            <DialogDescription className={cn(isLargeText && "text-base", isHighContrast && "text-white")}>
                                Qual refeição você vai fazer agora?
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-4 py-6">
                            {(['ALMOCO', 'JANTAR'] as const).map((type) => (
                                <button 
                                    key={type}
                                    onClick={() => handleSelectMeal(type)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all group",
                                        isHighContrast 
                                            ? "border-white hover:bg-zinc-800 hover:border-yellow-400" 
                                            : "border-slate-100 hover:border-blue-500 hover:bg-blue-50"
                                    )}
                                >
                                    <div className={cn(
                                        "rounded-full flex items-center justify-center transition-colors",
                                        isLargeText ? "h-14 w-14" : "h-12 w-12",
                                        isHighContrast 
                                            ? "bg-black text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black" 
                                            : "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                                    )}>
                                        {type === 'ALMOCO' ? <Utensils className={cn(isLargeText ? "h-8 w-8" : "h-6 w-6")} /> : <Moon className={cn(isLargeText ? "h-8 w-8" : "h-6 w-6")} />}
                                    </div>
                                    <span className={cn(
                                        "font-bold group-hover:underline",
                                        isHighContrast ? "text-white" : "text-slate-700",
                                        isLargeText ? "text-lg" : "text-base"
                                    )}>
                                        {type === 'ALMOCO' ? 'Almoço' : 'Jantar'}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <Button 
                            variant="ghost" 
                            className={cn("w-full", isHighContrast && "text-white hover:bg-zinc-800", isLargeText && "text-lg h-12")} 
                            onClick={handleClose}
                        >
                            Cancelar
                        </Button>
                    </div>
                )}

                {step === 'QRCODE' && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <DialogHeader>
                            <DialogTitle className={cn("flex items-center justify-center gap-2 font-bold", isLargeText ? "text-2xl" : "text-xl", isHighContrast && "text-yellow-400")}>
                                <QrCode className="h-5 w-5" />
                                Apresente na Catraca
                            </DialogTitle>
                            <DialogDescription className={cn(isLargeText && "text-base", isHighContrast && "text-white")}>
                                Mostre este código para liberar sua entrada.
                            </DialogDescription>
                        </DialogHeader>

                        <div className={cn(
                            "flex justify-center py-8 rounded-xl my-4 border",
                            isHighContrast ? "bg-white border-yellow-400" : "bg-slate-50 border-slate-100"
                        )}>
                            <QRCodeSVG 
                                value={qrToken} 
                                size={isLargeText ? 220 : 180}
                                level={"H"}
                                className="bg-white rounded-lg"
                            />
                        </div>

                        <Button 
                            className={cn(
                                "w-full font-bold",
                                isHighContrast ? "bg-yellow-400 text-black hover:bg-yellow-500" : "bg-blue-600 hover:bg-blue-700",
                                isLargeText ? "h-14 text-xl" : "h-12 text-lg"
                            )}
                            onClick={handleConfirmConsumption}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Já utilizei / Passei na catraca"}
                        </Button>
                        {!loading && (
                             <Button variant="ghost" size="sm" className={cn("w-full mt-2", isHighContrast ? "text-white" : "text-slate-400")} onClick={() => setStep('SELECT')}>Voltar</Button>
                        )}
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="flex flex-col items-center py-8 animate-in zoom-in duration-300">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm animate-bounce">
                             <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className={cn("font-bold text-slate-900", isHighContrast && "text-yellow-400", isLargeText ? "text-3xl" : "text-2xl")}>
                            Bom Apetite!
                        </h2>
                        <p className={cn("text-center mt-2 px-4", isHighContrast ? "text-white" : "text-slate-500", isLargeText && "text-lg")}>
                            Sua ficha foi validada com sucesso.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}