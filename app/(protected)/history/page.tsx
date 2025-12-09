"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { PurchaseResponse } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Utensils, 
  Moon, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  QrCode,
  AlertCircle
} from "lucide-react";

function PixModal({ data, onClose }: { data: PurchaseResponse; onClose: () => void }) {
  if (!data.pixQrCodeText) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">Finalizar Pagamento</h3>
          <p className="text-sm text-slate-500">Copie o código abaixo para pagar no seu banco.</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-center">
           {data.pixQrCodeImageUrl ? (
             <img src={data.pixQrCodeImageUrl} alt="QR Pix" className="h-48 w-48 object-contain" />
           ) : (
             <QrCode className="h-48 w-48 text-slate-800" />
           )}
        </div>

        <div>
           <label className="text-[10px] font-bold uppercase text-slate-400">Pix Copia e Cola</label>
           <div className="flex gap-2 mt-1">
              <input 
                readOnly 
                value={data.pixQrCodeText} 
                className="flex-1 bg-slate-100 border border-slate-200 rounded-md px-3 text-xs text-slate-600 truncate"
              />
              <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(data.pixQrCodeText!)}>
                <Copy className="h-4 w-4" />
              </Button>
           </div>
        </div>

        <Button className="w-full bg-slate-900 text-white" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<PurchaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [viewingPix, setViewingPix] = useState<PurchaseResponse | null>(null);

  useEffect(() => {
    async function loadHistory() {
      if (user?.email) {
        try {
          const data = await api.getHistory(user.email);
          setHistory(data || []);
        } catch (error) {
          console.error("Erro ao carregar histórico", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadHistory();
  }, [user]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PAGO': 
        return { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2, label: 'Pago' };
      case 'PENDENTE': 
        return { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock, label: 'Pendente' };
      case 'CANCELADO': 
        return { color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle, label: 'Cancelado' };
      default: 
        return { color: 'bg-slate-100 text-slate-700', icon: AlertCircle, label: status };
    }
  };

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center pb-28 pt-6 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Meus Pedidos</h1>
        
        {loading ? (
          <div className="space-y-3">
             {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />)}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center mt-10 p-8 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
               <Utensils className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-slate-900 font-medium">Sem compras ainda</h3>
            <p className="text-slate-500 text-sm mt-1">Aproveite para comprar suas primeiras fichas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              const status = getStatusInfo(item.statusPagamento);
              const StatusIcon = status.icon;

              return (
                <Card key={item.id} className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white">
                  
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{item.dataCompraFormatada}</span>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      <span>{status.label}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex flex-col gap-2 mb-4">
                      {item.quantidadeAlmoco > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
                               <Utensils className="h-4 w-4" />
                             </div>
                             <span className="text-sm text-slate-700 font-medium">Almoço</span>
                          </div>
                          <span className="text-sm text-slate-900 font-bold">x{item.quantidadeAlmoco}</span>
                        </div>
                      )}

                      {item.quantidadeJantar > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-600">
                               <Moon className="h-4 w-4" />
                             </div>
                             <span className="text-sm text-slate-700 font-medium">Jantar</span>
                          </div>
                          <span className="text-sm text-slate-900 font-bold">x{item.quantidadeJantar}</span>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-slate-100 mb-3" />

                    <div className="flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
                          <span className="text-lg font-bold text-slate-900">{formatMoney(item.valorTotal)}</span>
                       </div>

                       {item.statusPagamento === 'PENDENTE' && item.formaPagamento === 'PIX' && item.pixQrCodeText && (
                         <Button 
                           size="sm" 
                           className="bg-yellow-500 hover:bg-yellow-600 text-white h-8 text-xs"
                           onClick={() => setViewingPix(item)}
                         >
                           <QrCode className="mr-1.5 h-3 w-3" />
                           Pagar Pix
                         </Button>
                       )}
                       
                       {item.statusPagamento !== 'PENDENTE' && (
                          <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-50 rounded">
                            {item.formaPagamento.replace('_', ' ')}
                          </span>
                       )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {viewingPix && (
        <PixModal data={viewingPix} onClose={() => setViewingPix(null)} />
      )}

    </main>
  );
}