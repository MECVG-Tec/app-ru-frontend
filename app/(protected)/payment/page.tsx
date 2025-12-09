"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2, QrCode, CheckCircle2, Copy } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export default function PaymentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const qtdAlmoco = Number(params.get("qtdAlmoco") || 0);
  const qtdJantar = Number(params.get("qtdJantar") || 0);
  
  const totalEstimado = ((qtdAlmoco + qtdJantar) * APP_CONFIG.TICKET_PRICE).toFixed(2);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'CONFIRM' | 'PIX_WAITING' | 'SUCCESS'>('CONFIRM');
  
  const [pixPayload, setPixPayload] = useState<{ text: string, img?: string | null } | null>(null);

  async function handleConfirmPayment() {
    if (!user?.email) return;

    setLoading(true);
    try {
      const response = await api.createPurchase({
        email: user.email,
        quantidadeAlmoco: qtdAlmoco,
        quantidadeJantar: qtdJantar,
        formaPagamento: 'PIX',
      });

      if (response.pixQrCodeText) {
         setPixPayload({
            text: response.pixQrCodeText,
            img: response.pixQrCodeImageUrl
         });
         setStep('PIX_WAITING');
      } else if (response.statusPagamento === 'PAGO') {
         setStep('SUCCESS');
      }

    } catch (error) {
      console.error("Erro na compra:", error);
      alert("Erro ao processar. Verifique se você tem matrícula cadastrada (se for aluno).");
    } finally {
      setLoading(false);
    }
  }

  function handlePixPaid() {
      setStep('SUCCESS');
      setTimeout(() => router.push("/history"), 2500);
  }

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center pb-24">
      <div className="w-full max-w-md px-4 pt-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Pagamento</h1>

        <Card className="p-6 mb-4 bg-white shadow-sm border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wide">Resumo</h3>
            <div className="space-y-2 text-sm text-slate-700">
                {qtdAlmoco > 0 && (
                    <div className="flex justify-between">
                        <span>{qtdAlmoco}x Almoço</span>
                        <span>R$ {(qtdAlmoco * APP_CONFIG.TICKET_PRICE).toFixed(2)}</span>
                    </div>
                )}
                {qtdJantar > 0 && (
                    <div className="flex justify-between">
                        <span>{qtdJantar}x Jantar</span>
                        <span>R$ {(qtdJantar * APP_CONFIG.TICKET_PRICE).toFixed(2)}</span>
                    </div>
                )}
                <div className="h-px bg-slate-100 my-2" />
                <div className="flex justify-between font-bold text-lg text-slate-900">
                    <span>Total</span>
                    <span>R$ {totalEstimado}</span>
                </div>
            </div>
        </Card>

        <Card className="p-6 flex flex-col items-center gap-4 bg-white shadow-md border-slate-100">
          
          {step === 'CONFIRM' && (
            <div className="w-full text-center space-y-4">
              <p className="text-sm text-slate-600">
                Pagamento via <strong>PIX</strong>.
              </p>
              <Button
                onClick={handleConfirmPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-500 h-12 shadow-lg"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Gerar QR Code Pix"}
              </Button>
            </div>
          )}

          {step === 'PIX_WAITING' && pixPayload && (
             <div className="flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4 shadow-inner flex justify-center">
                    {/* Lógica de Exibição do QR Code */}
                    {pixPayload.img ? (
                        // Se o backend mandou imagem, usa ela
                        <img src={pixPayload.img} alt="QR Pix" className="h-48 w-48 object-contain" />
                    ) : (
                        // Se não mandou, gera o SVG no front (requer qrcode.react) OU mostra icone
                        // Se não quiser instalar a lib agora, deixe apenas o <QrCode />
                        <div className="h-48 w-48 flex items-center justify-center">
                           {/* <QRCodeSVG value={pixPayload.text} size={180} />  <-- Descomente se instalar a lib */}
                           <QrCode className="h-32 w-32 text-slate-300" /> {/* Fallback simples */}
                        </div>
                    )}
                </div>
                
                <div className="w-full mb-6">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">
                      Pix Copia e Cola
                    </label>
                    <div className="flex gap-2">
                        <input 
                            readOnly 
                            value={pixPayload.text} 
                            className="text-xs border rounded-md px-3 py-2 flex-1 bg-slate-50 text-slate-600 truncate font-mono focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => {
                            navigator.clipboard.writeText(pixPayload.text);
                            alert("Código copiado!");
                          }}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <Button 
                    onClick={handlePixPaid}
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
                >
                    Já realizei o pagamento
                </Button>
             </div>
          )}

          {step === 'SUCCESS' && (
              <div className="flex flex-col items-center py-6 animate-in zoom-in duration-500">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Pedido Recebido!</h2>
                  <p className="text-center text-sm text-slate-500 mt-2">
                      Aguardando confirmação do banco.
                  </p>
                  <Button variant="ghost" className="mt-6 text-blue-600" onClick={() => router.push('/home')}>
                    Voltar ao Início
                  </Button>
              </div>
          )}

        </Card>
      </div>
    </main>
  );
}