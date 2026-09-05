// @ts-check
const { NewsTracker } = require("./jsfiles/news_storage.js");

console.log("================================================================================");
console.log("=== News Storage & News-Evaluator Pipeline (Node.js Execution)               ===");
console.log("================================================================================");

// 1. Instantiate NewsTracker with 0-ed store across all assets
const tracker = new NewsTracker();

console.log("\n[1] Initial 0-ed Store Object (Baseline State):");
console.log(JSON.stringify(tracker.store["BTC"], null, 2));

// 2. Simulated output from sub-agent 'news-evaluator':
const evaluatedNewsBatch1 = {
    assets: [
        { asset: "BTC", assetCompleteName: "BITCOIN" }
    ],
    source: "CoinMarketCap & Bitcoin Core Releases (4 September 2026)",
    sessions: [
        {
            asset: { asset: "BTC", assetCompleteName: "BITCOIN" },
            source: "IMF / Review Committee",
            summarization: "IMF confirmed that El Salvador's $628M Bitcoin reserves were funded entirely via private philanthropic donations, resolving transparency concerns.",
            trendDirection: "NEUTRAL",
            category: "institutional"
        },
        {
            asset: { asset: "BTC", assetCompleteName: "BITCOIN" },
            source: "Bitcoin Core Repo / v32 Milestone",
            summarization: "Bitcoin Core v32 reached feature freeze; delivers IP privacy leak patch and faster block validation.",
            trendDirection: "BULLISH",
            category: "development"
        }
    ]
};

console.log("\n[2] Ingesting Evaluated News (Batch 1 from 'news-evaluator'):");
const updatedStore = tracker.pushNews(evaluatedNewsBatch1);

console.log("\n[3] Latest BTC Particle with Progression (Compared to Previous):");
console.log(JSON.stringify(tracker.getLatest("BTC"), null, 2));

// 3. Simulated second batch with regulatory or tooling update
const evaluatedNewsBatch2 = {
    assets: [
        { asset: "ARB", assetCompleteName: "ARBITRUM" },
        { asset: "BTC", assetCompleteName: "BITCOIN" }
    ],
    source: "Arbitrum Foundation & SEC Filing (5 September 2026)",
    sessions: [
        {
            asset: { asset: "ARB", assetCompleteName: "ARBITRUM" },
            source: "Arbitrum Foundation / Stylus Mainnet",
            summarization: "Stylus upgrade deployed to Arbitrum One mainnet enabling WASM smart contracts in Rust and C++.",
            trendDirection: "BULLISH",
            category: "tools"
        },
        {
            asset: { asset: "BTC", assetCompleteName: "BITCOIN" },
            source: "SEC Division of Corporation Finance",
            summarization: "SEC issues advisory notice clarifying digital asset custody requirements for registered investment advisers.",
            trendDirection: "NEUTRAL",
            category: "institutional"
        }
    ]
};

console.log("\n[4] Ingesting Evaluated News (Batch 2):");
tracker.pushNews(evaluatedNewsBatch2);

console.log("\n[5] Latest ARB Particle:");
console.log(JSON.stringify(tracker.getLatest("ARB"), null, 2));

console.log("\n[6] Latest BTC Particle (shows trend shift from BULLISH to NEUTRAL):");
console.log(JSON.stringify(tracker.getLatest("BTC"), null, 2));

console.log("\n[7] Full Constructed Store Object for BTC:");
console.log(JSON.stringify(tracker.get("BTC"), null, 2));
