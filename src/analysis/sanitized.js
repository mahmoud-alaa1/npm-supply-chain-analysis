/*
 * SANITIZED STATIC ANALYSIS
 *
 * This file is a non-executable representation of the behavior
 * observed during static analysis of the suspicious JavaScript sample.
 *
 * The original network communication, payload retrieval,
 * dynamic execution, and child-process execution have intentionally
 * NOT been reproduced here.
 */

"use strict";

const analysis = {
  classification: "Suspicious npm supply-chain JavaScript",

  campaign: {
    id: "A9-0003-1",
  },

  ethereum: {
    sender:
      "0xa322E5f3D311D3080e6f0121063e9aDC2490Ef1a",

    rpcMethods: [
      "eth_blockNumber",
      "eth_getBlockByNumber",
      "eth_getTransactionCount",
    ],

    purpose:
      "Locate blockchain transactions originating from the hardcoded sender.",
  },

  infrastructureDiscovery: {
    transactionField: "tx.to",

    extraction:
      "The first eight bytes of tx.to are interpreted as two IPv4 addresses.",

    purpose:
      "Derive network infrastructure from blockchain transaction data.",
  },

  payloadDelivery: {
    methods: [
      "GET",
      "HEAD",
    ],

    headers: [
      "Sec-V",
      "x-payload-b64",
    ],

    decoding: [
      "Base64 decoding",
      "Repeating-key XOR",
    ],
  },

  execution: {
    observedPrimitives: [
      "eval(decodedPayload)",
      'spawn("node", ["-e", decodedPayload], { detached: true })',
    ],

    status: "REMOVED FROM SANITIZED VERSION",
  },

  observedGlobals: [
    "global._V",
    "global._H",
    "global._H2",
    "global._t_s",
    "global._t_u",
  ],

  attackChain: [
    "Ethereum RPC lookup",
    "Transaction discovery",
    "Infrastructure extraction",
    "HTTP payload retrieval",
    "Payload decoding",
    "Dynamic code execution",
  ],
};

console.log(
  "Static analysis summary:"
);

console.log(
  JSON.stringify(analysis, null, 2)
);
