import { defineChain } from "viem";

export const westend = defineChain({
  id: 420420421,
  name: "westend",
  nativeCurrency: {
    decimals: 18,
    name: "westend",
    symbol: "WST",
  },
  rpcUrls: {
    default: {
      http: ["https://westend-asset-hub-eth-rpc.polkadot.io"],
      //webSocket: ["wss://rpc.zora.energy"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://westend-asset-hub-eth-explorer.parity.io",
    },
  },
  contracts: {
    // multicall3: {
    //   address: "0xcA11bde05977b3631167028862bE2a173976CA11",
    //   blockCreated: 5882,
    // },
  },
});
