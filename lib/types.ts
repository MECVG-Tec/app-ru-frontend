export interface RegisterRequest {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  ehAluno: boolean;
  matricula: string;
  moradorResidencia: boolean;
  prefereAltoContraste: boolean;
  prefereLinguagemSimples: boolean;
  prefereFonteGrande: boolean;
}

export type PaymentMethod = 'CARTAO_CREDITO' | 'PIX' | 'BOLETO' | 'CARTAO_DEBITO' | 'CARTEIRA_DIGITAL';

export type PaymentStatus = 'PENDENTE' | 'PAGO' | 'CANCELADO' | 'RECUSADO';

export interface CreatePurchaseRequest {
  email: string;
  quantidadeAlmoco: number;
  quantidadeJantar: number;
  formaPagamento: PaymentMethod;
  
  paymentToken?: string;
  cardBrand?: string;
  cardLast4?: string;
}

export interface PurchaseResponse {
  id: number;
  clienteId: number;
  clienteNome: string;
  quantidade: number; 
  valorTotal: number;
  quantidadeAlmoco: number;
  quantidadeJantar: number;
  statusPagamento: PaymentStatus;
  formaPagamento: PaymentMethod;
  dataCompraFormatada: string;
  pixQrCodeText?: string;
  pixQrCodeImageUrl?: string | null;
}

export interface MenuItem {
  slot: string;
  title: string;
  notes?: string;
}

export interface MenuResponse {
  date: string;
  meal: "ALMOCO" | "JANTAR";
  slots: MenuItem[];
}
