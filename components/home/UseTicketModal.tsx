"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Utensils, Moon, CheckCircle2, QrCode, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
// Importe a biblioteca do QR Code
import { QRCodeSVG } from 'qrcode.react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (mealType: 'ALMOCO' | 'JANTAR') => void;
}

// Define os passos possíveis do modal
type ModalStep = 'SELECT' | 'QRCODE' | 'SUCCESS';

export function UseTicketModal({ isOpen, onClose, onSuccess }: Props) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    // Atualizado para incluir o passo QRCODE
    const [step, setStep] = useState<ModalStep>('SELECT');
    const [selectedMeal, setSelectedMeal] = useState<'ALMOCO' | 'JANTAR' | null>(null);
    // Estado para guardar um token temporário para o QR Code visual
    const [qrToken, setQrToken] = useState("");

    // --- PASSO 1: Usuário seleciona a refeição ---
    function handleSelectMeal(type: 'ALMOCO' | 'JANTAR') {
        setSelectedMeal(type);
        // Gera um token aleatório apenas para exibição no QR Code
        const randomToken = `VALIDAR-${type}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        setQrToken(randomToken);
        // Avança para a tela do QR Code
        setStep('QRCODE');
    }

    // --- PASSO 2: Usuário confirma que utilizou (Chama a API) ---
    async function handleConfirmConsumption() {
        if (!user?.email || !selectedMeal) return;
        
        setLoading(true);
        try {
            // Só agora fazemos a request
            await api.consumeToken(user.email, selectedMeal);
            setStep('SUCCESS');
            
            // Fecha o modal após 2 segundos e avança para a avaliação
            setTimeout(() => {
                onSuccess(selectedMeal);
                handleClose();
            }, 2000);
            
        } catch (error) {
            alert("Erro ao processar utilização. Tente novamente.");
            // Se der erro, volta para a seleção ou mantem no QR code? 
            // Optei por voltar para o QR code para tentar novamente.
            setStep('QRCODE'); 
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        // Reseta os estados ao fechar
        setTimeout(() => {
            setStep('SELECT');
            setSelectedMeal(null);
            setQrToken("");
        }, 300); // Pequeno delay para a animação de fechar não mostrar a mudança de estado
        setLoading(false);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-sm text-center">
                
                {/* --- ETAPA 1: SELEÇÃO --- */}
                {step === 'SELECT' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Utilizar Ficha</DialogTitle>
                            <DialogDescription>Qual refeição você vai fazer agora?</DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-4 py-6">
                            <button 
                                onClick={() => handleSelectMeal('ALMOCO')}
                                className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Utensils className="h-6 w-6" />
                                </div>
                                <span className="font-bold text-slate-700 group-hover:text-blue-700">Almoço</span>
                            </button>

                            <button 
                                onClick={() => handleSelectMeal('JANTAR')}
                                className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                            >
                                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Moon className="h-6 w-6" />
                                </div>
                                <span className="font-bold text-slate-700 group-hover:text-indigo-700">Jantar</span>
                            </button>
                        </div>

                        <Button variant="ghost" className="w-full" onClick={handleClose}>Cancelar</Button>
                    </div>
                )}

                {/* --- ETAPA 2: QR CODE (Nova) --- */}
                {step === 'QRCODE' && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-center gap-2 font-bold">
                                <QrCode className="h-5 w-5" />
                                Apresente na Catraca
                            </DialogTitle>
                            <DialogDescription>
                                Mostre este código para liberar sua entrada no {selectedMeal === 'ALMOCO' ? 'Almoço' : 'Jantar'}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex justify-center py-8 bg-slate-50 rounded-xl my-4 border border-slate-100">
                            {/* Gera o QR Code com o token aleatório */}
                            <QRCodeSVG 
                                value={qrToken} 
                                size={180}
                                level={"H"} // Nível de correção de erro alto para leitura rápida
                                includeMargin={true}
                                className="bg-white rounded-lg shadow-sm"
                            />
                        </div>

                        <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-12 font-bold" 
                            onClick={handleConfirmConsumption}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Validando...
                                </>
                            ) : (
                                "Já utilizei / Passei na catraca"
                            )}
                        </Button>
                        {!loading && (
                             <Button variant="ghost" size="sm" className="w-full mt-2 text-slate-400" onClick={() => setStep('SELECT')}>Voltar</Button>
                        )}
                    </div>
                )}

                {/* --- ETAPA 3: SUCESSO --- */}
                {step === 'SUCCESS' && (
                    <div className="flex flex-col items-center py-8 animate-in zoom-in duration-300">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm animate-bounce">
                             <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Bom Apetite!</h2>
                        <p className="text-center text-sm text-slate-500 mt-2 px-4">
                            Sua ficha de {selectedMeal === 'ALMOCO' ? 'Almoço' : 'Jantar'} foi validada com sucesso.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}