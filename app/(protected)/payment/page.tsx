"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2, QrCode, CheckCircle2, Copy } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

export default function PaymentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const isHighContrast = user?.accessibilityOptions?.highContrast;
  const isLargeText = user?.accessibilityOptions?.largeText;

  const qtdAlmoco = Number(params.get("qtdAlmoco") || 0);
  const qtdJantar = Number(params.get("qtdJantar") || 0);

  const totalEstimado = (
    qtdAlmoco *
      (user?.is_student
        ? APP_CONFIG.TICKET_LUNCH_PRICE
        : APP_CONFIG.TICKET_LUNCH_PRICE_EXTERNAL) +
    qtdJantar *
      (user?.is_student
        ? APP_CONFIG.TICKET_DINNER_PRICE
        : APP_CONFIG.TICKET_DINNER_PRICE_EXTERNAL)
  ).toFixed(2);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"CONFIRM" | "PIX_WAITING" | "SUCCESS">(
    "CONFIRM"
  );

  const [pixPayload, setPixPayload] = useState<{
    text: string;
    img?: string | null;
    orderId?: string;
  } | null>(null);

  async function handleConfirmPayment() {
    if (!user?.email) return;

    setLoading(true);
    try {
      const response = await api.createPurchase({
        email: user.email,
        quantidadeAlmoco: qtdAlmoco,
        quantidadeJantar: qtdJantar,
        formaPagamento: "PIX",
      });

      if (response.pixQrCodeText) {
        setPixPayload({
          text: response.pixQrCodeText,
          img: response.pixQrCodeImageUrl,
          orderId: String(response.gatewayOrderId),
        });
        setStep("PIX_WAITING");
      } else if (response.statusPagamento === "PAGO") {
        setStep("SUCCESS");
      }
    } catch (error) {
      console.error("Erro na compra:", error);
      alert(
        "Erro ao processar. Verifique se você tem matrícula cadastrada (se for aluno)."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handlePixPaid() {
    setStep("SUCCESS");
    api.validatePixPayment(pixPayload?.orderId || "");
    setTimeout(() => router.push("/history"), 2500);
  }

  return (
    <main
      className={cn(
        "min-h-screen flex justify-center pb-24 transition-colors duration-300",
        isHighContrast ? "bg-black" : "bg-slate-50"
      )}
    >
      <div className="w-full max-w-md px-4 pt-6">
        <h1
          className={cn(
            "font-semibold mb-4",
            isHighContrast ? "text-yellow-400" : "text-slate-900",
            isLargeText ? "text-3xl" : "text-2xl"
          )}
        >
          Pagamento
        </h1>

        <Card
          className={cn(
            "p-6 mb-4 transition-colors",
            isHighContrast
              ? "bg-zinc-900 border-2 border-white text-white"
              : "bg-white shadow-sm border-slate-100"
          )}
        >
          <h3
            className={cn(
              "font-bold uppercase mb-3 tracking-wide",
              isHighContrast ? "text-yellow-400" : "text-slate-400",
              isLargeText ? "text-sm" : "text-xs"
            )}
          >
            Resumo
          </h3>

          <div
            className={cn(
              "space-y-2",
              isLargeText ? "text-lg" : "text-sm",
              isHighContrast ? "text-white" : "text-slate-700"
            )}
          >
            {qtdAlmoco > 0 && (
              <div className="flex justify-between">
                <span>{qtdAlmoco}x Almoço</span>
                <span>
                  R${" "}
                  {(
                    qtdAlmoco *
                    (user?.is_student
                      ? APP_CONFIG.TICKET_LUNCH_PRICE
                      : APP_CONFIG.TICKET_LUNCH_PRICE_EXTERNAL)
                  ).toFixed(2)}
                </span>
              </div>
            )}
            {qtdJantar > 0 && (
              <div className="flex justify-between">
                <span>{qtdJantar}x Jantar</span>
                <span>
                  R${" "}
                  {(
                    qtdJantar *
                    (user?.is_student
                      ? APP_CONFIG.TICKET_DINNER_PRICE
                      : APP_CONFIG.TICKET_DINNER_PRICE_EXTERNAL)
                  ).toFixed(2)}
                </span>
              </div>
            )}

            <div
              className={cn(
                "h-px my-2",
                isHighContrast ? "bg-white" : "bg-slate-100"
              )}
            />

            <div
              className={cn(
                "flex justify-between font-bold",
                isHighContrast ? "text-yellow-400" : "text-slate-900",
                isLargeText ? "text-2xl" : "text-lg"
              )}
            >
              <span>Total</span>
              <span>R$ {totalEstimado}</span>
            </div>
          </div>
        </Card>

        <Card
          className={cn(
            "p-6 flex flex-col items-center gap-4 transition-all",
            isHighContrast
              ? "bg-zinc-900 border-2 border-white"
              : "bg-white shadow-md border-slate-100"
          )}
        >
          {step === "CONFIRM" && (
            <div className="w-full text-center space-y-4">
              <p
                className={cn(
                  isHighContrast ? "text-white" : "text-slate-600",
                  isLargeText ? "text-lg" : "text-sm"
                )}
              >
                Pagamento via <strong>PIX</strong>.
              </p>
              <Button
                onClick={handleConfirmPayment}
                className={cn(
                  "w-full shadow-lg font-bold transition-all",
                  isHighContrast
                    ? "bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-white"
                    : "bg-gradient-to-r from-blue-600 to-sky-500 text-white",
                  isLargeText ? "h-14 text-xl" : "h-12"
                )}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  "Gerar QR Code Pix"
                )}
              </Button>
            </div>
          )}

          {step === "PIX_WAITING" && pixPayload && (
            <div className="flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-300">
              <div
                className={cn(
                  "p-4 rounded-xl border mb-4 flex justify-center",
                  isHighContrast
                    ? "bg-white border-4 border-yellow-400"
                    : "bg-white border-slate-200 shadow-inner"
                )}
              >
                {pixPayload.img ? (
                  <img
                    src={pixPayload.img}
                    alt="QR Pix"
                    className="h-48 w-48 object-contain"
                  />
                ) : (
                  <div className="h-48 w-48 flex items-center justify-center">
                    <QRCodeSVG value={pixPayload.text} size={180} />
                  </div>
                )}
              </div>

              <div className="w-full mb-6">
                <label
                  className={cn(
                    "font-bold uppercase tracking-wider mb-1 block",
                    isHighContrast ? "text-yellow-400" : "text-slate-400",
                    isLargeText ? "text-xs" : "text-[10px]"
                  )}
                >
                  Pix Copia e Cola
                </label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={pixPayload.text}
                    className={cn(
                      "border rounded-md px-3 py-2 flex-1 truncate font-mono outline-none",
                      isHighContrast
                        ? "bg-black text-white border-white focus:border-yellow-400"
                        : "bg-slate-50 text-slate-600 border-slate-200 focus:ring-1 focus:ring-blue-500",
                      isLargeText ? "text-base h-12" : "text-xs"
                    )}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(pixPayload.text);
                      alert("Código copiado!");
                    }}
                    className={cn(
                      isHighContrast &&
                        "border-white text-white hover:bg-zinc-800",
                      isLargeText && "h-12 w-12"
                    )}
                  >
                    <Copy className={cn(isLargeText ? "h-6 w-6" : "h-4 w-4")} />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handlePixPaid}
                className={cn(
                  "w-full font-bold shadow-lg",
                  isHighContrast
                    ? "bg-green-500 text-black hover:bg-green-400 border-2 border-white"
                    : "bg-green-600 hover:bg-green-700 text-white",
                  isLargeText ? "h-14 text-xl" : "h-12"
                )}
              >
                Já realizei o pagamento
              </Button>
            </div>
          )}

          {step === "SUCCESS" && (
            <div className="flex flex-col items-center py-6 animate-in zoom-in duration-500">
              <div
                className={cn(
                  "rounded-full flex items-center justify-center mb-4",
                  isLargeText ? "h-24 w-24" : "h-20 w-20",
                  isHighContrast ? "bg-green-900" : "bg-green-100"
                )}
              >
                <CheckCircle2
                  className={cn(
                    "text-green-600",
                    isLargeText ? "h-12 w-12" : "h-10 w-10",
                    isHighContrast && "text-green-400"
                  )}
                />
              </div>

              <h2
                className={cn(
                  "font-bold",
                  isHighContrast ? "text-white" : "text-slate-900",
                  isLargeText ? "text-2xl" : "text-xl"
                )}
              >
                Pedido Recebido!
              </h2>

              <p
                className={cn(
                  "text-center mt-2",
                  isHighContrast ? "text-gray-300" : "text-slate-500",
                  isLargeText ? "text-lg" : "text-sm"
                )}
              >
                Aguardando confirmação do banco.
              </p>

              <Button
                variant="ghost"
                className={cn(
                  "mt-6",
                  isHighContrast
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-blue-600",
                  isLargeText && "text-lg"
                )}
                onClick={() => router.push("/home")}
              >
                Voltar ao Início
              </Button>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
