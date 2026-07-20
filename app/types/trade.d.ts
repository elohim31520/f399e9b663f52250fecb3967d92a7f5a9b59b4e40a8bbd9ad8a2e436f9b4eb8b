export interface TradeParams {
  stockSymbol: string;
  quantity: string;
  price: string;
  tradeType: 'buy' | 'sell';
  tradeDate: string;
}

export interface TradeResponse {
  id: number;
  company_id: number;
  quantity: string;
  price: string;
  type: 'buy' | 'sell';
  date: string;
  stock_id: string;
}

export interface TradeWithCompany {
  id: number;
  companyId: number;
  quantity: string; // PostgreSQL numeric 通常會被當作 string 處理。
  price: string;
  type: 'buy' | 'sell';
  date: string;
  stockSymbol: string;
  company?: {
    name: string;
    symbol: string;
  } | null;
}

export interface PaginatedTrades {
  data: TradeWithCompany[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface AnalyzeScreenshotRes {
  jobId: string;
  message: string;
}
