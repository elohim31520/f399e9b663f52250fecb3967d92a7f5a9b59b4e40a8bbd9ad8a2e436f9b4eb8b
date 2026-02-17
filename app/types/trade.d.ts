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

export interface TradeWithCompany extends TradeResponse {
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
