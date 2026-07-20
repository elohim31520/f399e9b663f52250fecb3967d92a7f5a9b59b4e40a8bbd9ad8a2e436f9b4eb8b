export interface MarketQuotes {
    symbol: string;
    price: string; //decimal string
    createdAt: string;
    assetId: string;
}

export interface AssetConfig {
    symbol: string
    label: string
    currency: string
    description: string
    tvSymbol: string
    tvPrefix?: string
}