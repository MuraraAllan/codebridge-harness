export type TrendDirection = "BULLISH" | "BEARISH" | "NEUTRAL";
export type AssetSymbol = "BTC" | "ARB" | "ETH" | "BNB" | "XRP" | "AVAX";

export interface Asset {
    asset: AssetSymbol;
    assetCompleteName: "BITCOIN" | "ARBITRUM" | "ETHEREUM" | "BNB" | "XRP" | "AVAX";
}

export interface Particle {
    asset: Asset;
    source: string;
    summarization: string;
    trendDirection: TrendDirection;
    category?: "institutional" | "development" | "tools";
    timestamp?: number;
}

export interface News {
    assets: Asset[];
    source: string;
    sessions: Particle[];
    timestamp?: number;
}
