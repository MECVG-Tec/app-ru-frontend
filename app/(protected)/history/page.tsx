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

interface A11yProps {
  isHighContrast?: boolean;
  isLargeText?: boolean;
}

export default function HistoryPage() {
  const { user } = useAuth();
  
  const isHighContrast = user?.accessibilityOptions?.highContrast;
  const isLargeText = user?.accessibilityOptions?.largeText;
  
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
    <main className={cn(
      "min-h-screen flex justify-center pb-28 pt-6 px-4 transition-colors duration-300",
      isHighContrast ? "bg-black" : "bg-slate-50"
    )}>
      <div className="w-full max-w-md">
        
        <h1 className={cn(
          "font-bold mb-4",
          isHighContrast ? "text-yellow-400" : "text-slate-900",
          isLargeText ? "text-3xl" : "text-2xl"
        )}>
          Histórico
        </h1>

        <div className={cn(
          "flex p-1 rounded-xl mb-6 transition-colors",
          isHighContrast ? "bg-zinc-900 border border-white" : "bg-slate-200/50"
        )}>
          <button
            onClick={() => setActiveTab('PEDIDOS')}
            className={cn(
              "flex-1 py-2 font-medium rounded-lg transition-all",
              isLargeText ? "text-base" : "text-sm",
              activeTab === 'PEDIDOS'
                ? (isHighContrast ? "bg-yellow-400 text-black font-bold" : "bg-white text-blue-600 shadow-sm")
                : (isHighContrast ? "text-white hover:bg-zinc-800" : "text-slate-500 hover:text-slate-700")
            )}
          >
            Meus Pedidos
          </button>
          <button
            onClick={() => setActiveTab('EXTRATO')}
            className={cn(
              "flex-1 py-2 font-medium rounded-lg transition-all",
              isLargeText ? "text-base" : "text-sm",
              activeTab === 'EXTRATO'
                ? (isHighContrast ? "bg-yellow-400 text-black font-bold" : "bg-white text-blue-600 shadow-sm")
                : (isHighContrast ? "text-white hover:bg-zinc-800" : "text-slate-500 hover:text-slate-700")
            )}
          >
            Extrato de Fichas
          </button>
        </div>
        
        {loading ? (
          <div className="space-y-3">
             {[1,2,3].map(i => <div key={i} className={cn("rounded-xl animate-pulse", isLargeText ? "h-28" : "h-24", isHighContrast ? "bg-zinc-800" : "bg-slate-200")} />)}
          </div>
        ) : (
          <>
            {activeTab === 'PEDIDOS' && (
              <div className="space-y-4">
                {purchases.length === 0 && <EmptyState msg="Nenhum pedido encontrado." isHighContrast={isHighContrast} />}
                {purchases.map((item) => (
                  <PurchaseCard 
                    key={item.id} 
                    item={item} 
                    onPay={() => setViewingPix(item)} 
                    formatMoney={formatMoney} 
                    isHighContrast={isHighContrast}
                    isLargeText={isLargeText}
                  />
                ))}
              </div>
            )}

            {activeTab === 'EXTRATO' && (
              <div className="space-y-4">
                {extract.length === 0 && <EmptyState msg="Nenhuma movimentação encontrada." isHighContrast={isHighContrast} />}
                {extract.map((item) => (
                  <ExtractCard 
                    key={item.id} 
                    item={item} 
                    isHighContrast={isHighContrast}
                    isLargeText={isLargeText}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {viewingPix && (
        <PixModal 
          data={viewingPix} 
          onClose={() => setViewingPix(null)} 
          isHighContrast={isHighContrast}
          isLargeText={isLargeText}
        />
      )}
    </main>
  );
}



function EmptyState({ msg, isHighContrast }: { msg: string, isHighContrast?: boolean }) {
  return (
    <div className={cn(
      "text-center mt-10 p-8 rounded-2xl border border-dashed",
      isHighContrast ? "bg-zinc-900 border-zinc-700" : "bg-white border-slate-300"
    )}>
      <p className={cn("text-sm", isHighContrast ? "text-white" : "text-slate-500")}>{msg}</p>
    </div>
  );
}

function PurchaseCard({ item, onPay, formatMoney, isHighContrast, isLargeText }: any) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PAGO': return { color: isHighContrast ? 'bg-green-900 text-green-300 border-green-700' : 'bg-green-100 text-green-700 border-green-200', label: 'Pago' };
      case 'PENDENTE': return { color: isHighContrast ? 'bg-yellow-900 text-yellow-300 border-yellow-700' : 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Pendente' };
      case 'CANCELADO': return { color: isHighContrast ? 'bg-red-900 text-red-300 border-red-700' : 'bg-red-50 text-red-700 border-red-200', label: 'Cancelado' };
      default: return { color: isHighContrast ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-slate-700', label: status };
    }
  };
  const status = getStatusInfo(item.statusPagamento);

  return (
    <Card className={cn(
      "overflow-hidden border transition-shadow",
      isHighContrast ? "bg-zinc-900 border-white text-white" : "bg-white border-slate-100 shadow-sm hover:shadow-md"
    )}>
      <div className={cn(
        "flex items-center justify-between px-4 py-3 border-b",
        isHighContrast ? "bg-zinc-800 border-zinc-700" : "bg-slate-50/50 border-slate-50"
      )}>
        <div className={cn("flex items-center gap-2 font-medium", isHighContrast ? "text-gray-300" : "text-slate-500", isLargeText ? "text-sm" : "text-xs")}>
          <CalendarDays className={cn(isLargeText ? "h-5 w-5" : "h-3.5 w-3.5")} />
          <span>{item.dataCompraFormatada}</span>
        </div>
        <div className={cn("px-2 py-0.5 rounded-full font-bold border", status.color, isLargeText ? "text-xs" : "text-[10px]")}>
          {status.label}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col gap-1 mb-3">
          {item.quantidadeAlmoco > 0 && (
            <div className={cn("flex justify-between", isLargeText ? "text-base" : "text-sm")}>
              <span className={cn("flex items-center gap-2", isHighContrast ? "text-gray-300" : "text-slate-600")}>
                <Utensils className={cn(isLargeText ? "h-4 w-4" : "h-3 w-3")}/> Almoço
              </span>
              <span className="font-bold">x{item.quantidadeAlmoco}</span>
            </div>
          )}
          {item.quantidadeJantar > 0 && (
            <div className={cn("flex justify-between", isLargeText ? "text-base" : "text-sm")}>
              <span className={cn("flex items-center gap-2", isHighContrast ? "text-gray-300" : "text-slate-600")}>
                <Moon className={cn(isLargeText ? "h-4 w-4" : "h-3 w-3")}/> Jantar
              </span>
              <span className="font-bold">x{item.quantidadeJantar}</span>
            </div>
          )}
        </div>
        
        <div className={cn("flex items-center justify-between mt-2 pt-2 border-t", isHighContrast ? "border-zinc-700" : "border-slate-100")}>
           <span className={cn("font-bold", isHighContrast ? "text-yellow-400" : "text-slate-900", isLargeText ? "text-xl" : "text-lg")}>
             {formatMoney(item.valorTotal)}
           </span>
           
           {item.statusPagamento === 'PENDENTE' && item.formaPagamento === 'PIX' && item.pixQrCodeText && (
             <Button 
               size="sm" 
               className={cn(
                 "text-white",
                 isHighContrast ? "bg-yellow-600 hover:bg-yellow-700" : "bg-yellow-500 hover:bg-yellow-600",
                 isLargeText ? "h-10 text-sm" : "h-7 text-xs"
               )}
               onClick={onPay}
             >
               Pagar Pix
             </Button>
           )}
        </div>
      </div>
    </Card>
  );
}

function ExtractCard({ item, isHighContrast, isLargeText }: any) {
  const isCredit = item.tipoOperacao === 'Compra' || item.tipoOperacao === 'Ajuste';
  
  return (
    <div className={cn(
      "p-4 rounded-xl border flex items-center justify-between shadow-sm",
      isHighContrast ? "bg-zinc-900 border-white text-white" : "bg-white border-slate-100"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "rounded-full flex items-center justify-center",
          isLargeText ? "h-12 w-12" : "h-10 w-10",
          isHighContrast 
            ? (isCredit ? "bg-green-900 text-green-300" : "bg-orange-900 text-orange-300")
            : (isCredit ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600")
        )}>
          {isCredit ? <ArrowUpCircle className={cn(isLargeText ? "h-6 w-6" : "h-5 w-5")} /> : <ArrowDownCircle className={cn(isLargeText ? "h-6 w-6" : "h-5 w-5")} />}
        </div>
        <div>
          <p className={cn("font-bold", isHighContrast ? "text-white" : "text-slate-900", isLargeText ? "text-base" : "text-sm")}>{item.descricao}</p>
          <p className={cn(isHighContrast ? "text-gray-400" : "text-slate-400", isLargeText ? "text-xs" : "text-[10px]")}>{item.dataHora}</p>
        </div>
      </div>
      
      <div className="text-right">
        {item.qtdAlmoco > 0 && (
          <div className={cn("font-bold", isCredit ? "text-green-500" : "text-orange-500", isLargeText ? "text-sm" : "text-xs")}>
            {isCredit ? "+" : "-"}{item.qtdAlmoco} Almoço
          </div>
        )}
        {item.qtdJantar > 0 && (
          <div className={cn("font-bold", isCredit ? "text-green-500" : "text-orange-500", isLargeText ? "text-sm" : "text-xs")}>
            {isCredit ? "+" : "-"}{item.qtdJantar} Jantar
          </div>
        )}
        
        <div className={cn(
          "flex items-center gap-1 justify-end mt-1 px-1.5 py-0.5 rounded",
          isHighContrast ? "bg-zinc-800 text-gray-300" : "bg-slate-50 text-slate-400",
          isLargeText ? "text-xs" : "text-[10px]"
        )}>
           <Wallet className="h-3 w-3" />
           <span>{item.saldoAlmocoResultante} / {item.saldoJantarResultante}</span>
        </div>
      </div>
    </div>
  );
}

function PixModal({ data, onClose, isHighContrast, isLargeText }: any) {
  if (!data.pixQrCodeText) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className={cn(
        "rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4",
        isHighContrast ? "bg-zinc-900 border-2 border-yellow-400 text-white" : "bg-white"
      )}>
        <div className="text-center">
          <h3 className={cn("font-bold", isHighContrast ? "text-yellow-400" : "text-slate-900", isLargeText ? "text-xl" : "text-lg")}>Finalizar Pagamento</h3>
          <p className={cn(isHighContrast ? "text-gray-300" : "text-slate-500", isLargeText ? "text-base" : "text-sm")}>Copie o código abaixo para pagar.</p>
        </div>
        
        <div className={cn("p-4 rounded-xl flex justify-center", isHighContrast ? "bg-white border-4 border-yellow-400" : "bg-slate-50 border border-slate-100")}>
           {data.pixQrCodeImageUrl ? (
             <img src={data.pixQrCodeImageUrl} alt="QR Pix" className="h-40 w-40 object-contain" />
           ) : (
             <QrCode className="h-40 w-40 text-slate-800" />
           )}
        </div>
        
        <div>
           <label className={cn("font-bold uppercase", isHighContrast ? "text-yellow-400" : "text-slate-400", isLargeText ? "text-xs" : "text-[10px]")}>Pix Copia e Cola</label>
           <div className="flex gap-2 mt-1">
              <input 
                readOnly 
                value={data.pixQrCodeText} 
                className={cn(
                  "flex-1 rounded-md px-3 truncate", 
                  isHighContrast ? "bg-black text-white border border-white" : "bg-slate-100 border border-slate-200 text-slate-600",
                  isLargeText ? "text-sm py-2" : "text-xs"
                )} 
              />
              <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(data.pixQrCodeText!)} className={cn(isHighContrast && "border-white text-white hover:bg-zinc-800")}>
                <Copy className={cn(isLargeText ? "h-5 w-5" : "h-4 w-4")} />
              </Button>
           </div>
        </div>
        <Button className={cn("w-full", isHighContrast ? "bg-yellow-400 text-black hover:bg-yellow-500" : "bg-slate-900 text-white", isLargeText && "h-12 text-lg")} onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
}