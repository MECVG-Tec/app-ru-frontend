"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { PurchaseResponse, ExtratoItem } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Utensils, Moon, CalendarDays, Clock, CheckCircle2, 
  XCircle, Copy, QrCode, AlertCircle, ArrowUpCircle, 
  ArrowDownCircle, Wallet 
} from "lucide-react";


function PixModal({ data, onClose }: { data: PurchaseResponse; onClose: () => void }) {
  if (!data.pixQrCodeText) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">Finalizar Pagamento</h3>
          <p className="text-sm text-slate-500">Copie o código abaixo para pagar.</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-center">
           {data.pixQrCodeImageUrl ? (
             <img src={data.pixQrCodeImageUrl} alt="QR Pix" className="h-40 w-40 object-contain" />
           ) : (
             <QrCode className="h-40 w-40 text-slate-800" />
           )}
        </div>
        <div>
           <label className="text-[10px] font-bold uppercase text-slate-400">Pix Copia e Cola</label>
           <div className="flex gap-2 mt-1">
              <input readOnly value={data.pixQrCodeText} className="flex-1 bg-slate-100 border border-slate-200 rounded-md px-3 text-xs text-slate-600 truncate" />
              <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(data.pixQrCodeText!)}>
                <Copy className="h-4 w-4" />
              </Button>
           </div>
        </div>
        <Button className="w-full bg-slate-900 text-white" onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
}


export default function HistoryPage() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'PEDIDOS' | 'EXTRATO'>('PEDIDOS');
  
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [extract, setExtract] = useState<ExtratoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingPix, setViewingPix] = useState<PurchaseResponse | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user?.email) return;
      try {
        setLoading(true);
        const [purchasesData, extractData] = await Promise.all([
          api.getHistory(user.email),
          api.getExtract(user.email)
        ]);
        setPurchases(purchasesData || []);
        setExtract(extractData || []);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center pb-28 pt-6 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Histórico</h1>

        <div className="flex p-1 bg-slate-200/50 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('PEDIDOS')}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
              activeTab === 'PEDIDOS' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Meus Pedidos
          </button>
          <button
            onClick={() => setActiveTab('EXTRATO')}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
              activeTab === 'EXTRATO' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Extrato de Fichas
          </button>
        </div>
        
        {loading ? (
          <div className="space-y-3">
             {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <>
            {activeTab === 'PEDIDOS' && (
              <div className="space-y-4">
                {purchases.length === 0 && <EmptyState msg="Nenhum pedido encontrado." />}
                {purchases.map((item) => (
                  <PurchaseCard key={item.id} item={item} onPay={() => setViewingPix(item)} formatMoney={formatMoney} />
                ))}
              </div>
            )}

            {activeTab === 'EXTRATO' && (
              <div className="space-y-4">
                {extract.length === 0 && <EmptyState msg="Nenhuma movimentação encontrada." />}
                {extract.map((item) => (
                  <ExtractCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {viewingPix && <PixModal data={viewingPix} onClose={() => setViewingPix(null)} />}
    </main>
  );
}


function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="text-center mt-10 p-8 bg-white rounded-2xl border border-dashed border-slate-300">
      <p className="text-slate-500 text-sm">{msg}</p>
    </div>
  );
}

function PurchaseCard({ item, onPay, formatMoney }: any) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PAGO': return { color: 'bg-green-100 text-green-700 border-green-200', label: 'Pago' };
      case 'PENDENTE': return { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Pendente' };
      case 'CANCELADO': return { color: 'bg-red-50 text-red-700 border-red-200', label: 'Cancelado' };
      default: return { color: 'bg-slate-100 text-slate-700', label: status };
    }
  };
  const status = getStatusInfo(item.statusPagamento);

  return (
    <Card className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50 bg-slate-50/50">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{item.dataCompraFormatada}</span>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
          {status.label}
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-1 mb-3">
          {item.quantidadeAlmoco > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 flex items-center gap-2"><Utensils className="h-3 w-3"/> Almoço</span>
              <span className="font-bold">x{item.quantidadeAlmoco}</span>
            </div>
          )}
          {item.quantidadeJantar > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 flex items-center gap-2"><Moon className="h-3 w-3"/> Jantar</span>
              <span className="font-bold">x{item.quantidadeJantar}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
           <span className="text-lg font-bold text-slate-900">{formatMoney(item.valorTotal)}</span>
           {item.statusPagamento === 'PENDENTE' && item.formaPagamento === 'PIX' && item.pixQrCodeText && (
             <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white h-7 text-xs" onClick={onPay}>
               Pagar Pix
             </Button>
           )}
        </div>
      </div>
    </Card>
  );
}

function ExtractCard({ item }: { item: ExtratoItem }) {
  const isCredit = item.tipoOperacao === 'Compra' || item.tipoOperacao === 'Ajuste';
  
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", isCredit ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600")}>
          {isCredit ? <ArrowUpCircle className="h-5 w-5" /> : <ArrowDownCircle className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{item.descricao}</p>
          <p className="text-[10px] text-slate-400">{item.dataHora}</p>
        </div>
      </div>
      
      <div className="text-right">
        {item.qtdAlmoco > 0 && (
          <div className={cn("text-xs font-bold", isCredit ? "text-green-600" : "text-orange-600")}>
            {isCredit ? "+" : "-"}{item.qtdAlmoco} Almoço
          </div>
        )}
        {item.qtdJantar > 0 && (
          <div className={cn("text-xs font-bold", isCredit ? "text-green-600" : "text-orange-600")}>
            {isCredit ? "+" : "-"}{item.qtdJantar} Jantar
          </div>
        )}
        
        {/* Mostra o saldo resultante pequeno abaixo */}
        <div className="flex items-center gap-1 justify-end mt-1 text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
           <Wallet className="h-3 w-3" />
           <span>{item.saldoAlmocoResultante} / {item.saldoJantarResultante}</span>
        </div>
      </div>
    </div>
  );
}