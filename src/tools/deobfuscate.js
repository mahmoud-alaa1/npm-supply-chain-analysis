import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { webcrack } from "webcrack";

const [, , inputArg, outputArg] = process.argv;
const inputFile = inputArg ?? "./src/analysis/original.js";
const outputFile = outputArg ?? "./src/analysis/deobfuscated.js";
const sanitizedFile = process.argv[4] ?? "./src/analysis/sanitized.js";

async function main() {
  const inputPath = path.resolve(inputFile);
  const outputPath = path.resolve(outputFile);
  const sanitizedPath = path.resolve(sanitizedFile);

  console.log("Static JavaScript deobfuscation");
  console.log("--------------------------------");
  console.log(`Input       : ${inputPath}`);
  console.log(`Deobfuscated: ${outputPath}`);
  console.log(`Sanitized   : ${sanitizedPath}`);
  console.log();

  // Read the suspicious sample as plain text.
  // The sample is never imported, required, evaluated, or executed.
  const source = await fs.readFile(inputPath, "utf8");

  console.log(`Loaded ${source.length.toLocaleString()} characters.`);
  console.log("Running Webcrack...");
  console.log();

  const result = await webcrack(source);

  await fs.mkdir(path.dirname(outputPath), {
    recursive: true,
  });

  await fs.writeFile(outputPath, result.code, "utf8");

  console.log("Deobfuscation completed.");
  console.log(`Written to: ${outputPath}`);
  console.log();

  const sanitized = createSanitizedAnalysis();

  await fs.writeFile(sanitizedPath, sanitized, "utf8");

  console.log("Sanitized analysis generated.");
  console.log(`Written to: ${sanitizedPath}`);
}

function createSanitizedAnalysis() {
  return `/*
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
`;
}

main().catch((error) => {
  console.error("Deobfuscation failed:");
  console.error(error);
  process.exitCode = 1;
});
