export interface TradeParams {
  stockSymbol: string;
  quantity: string;
  price: string;
  tradeType: 'buy' | 'sell';
  tradeDate: string; /** ISO 8601 格式: YYYY-MM-DDTHH:mm:ssZ */
}

export interface TradeResponse {
  id: number;
  company_id: number;
  quantity: string;
  price: string;
  type: 'buy' | 'sell';
  date: string; /** ISO 8601 格式: YYYY-MM-DDTHH:mm:ssZ */
  stock_id: string;
}

// 用於返回的交易數據結構
export interface TradeWithCompany {
  id: number;
  companyId: number;
  quantity: string; // 在 Node.js 和資料庫（如 PostgreSQL）的互動中，numeric 通常會被當作 string 處理。
  price: string;
  type: 'buy' | 'sell';
  date: string;
  stockSymbol: string;
  company?: {
    name: string;
    symbol: string;
  } | null;
}

// 分頁響應
export interface PaginatedTrades {
  data: TradeWithCompany[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
