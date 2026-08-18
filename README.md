# npm Supply-Chain Malware Analysis

Static analysis and deobfuscation of a suspicious JavaScript payload discovered inside a malicious npm package.

> ⚠️ **Disclaimer**
>
> This repository is for educational and defensive security research only.
> The original and deobfuscated samples are preserved for analysis and should not be executed.

---

## Overview

During the security analysis of an npm package, a heavily obfuscated JavaScript payload was discovered embedded inside the **`postcss.config.mjs`** configuration file.

Because `postcss.config.mjs` is automatically imported and executed during standard JavaScript/frontend build pipelines (such as PostCSS, Vite, Next.js, and Webpack), embedding malicious code within it allows full command execution during development or CI/CD builds without raising immediate suspicion.

Instead of executing the code, I treated the sample as an unknown artifact and performed static analysis and deobfuscation to understand its underlying mechanics and capabilities.

The analysis revealed a staged malware loader that:

1. **Initializes Campaign Tracking:** Uses a hardcoded campaign identifier (`A9-0003-1`).
2. **Queries Ethereum RPC Endpoints:** Leverages public blockchain nodes (`1rpc.io`, `drpc.org`, etc.) as a resilient Dead Drop Resolver.
3. **Discovers Dynamic Infrastructure:** Searches for transactions originating from a specific Ethereum sender address and parses the target address (`tx.to`) to reconstruct dynamic IPv4 C2 addresses.
4. **Retrieves Next-Stage Payloads:** Issues HTTP `GET` and `HEAD` requests using custom headers (`Sec-V`, `x-payload-b64`).
5. **Decrypts In-Memory Payloads:** Decodes retrieved payloads via Base64 and a repeating-key XOR routine.
6. **Executes Arbitrary Code:** Dynamically executes code inside the active process via `eval()` or spawns hidden, detached `node -e` child processes.

The combination of build-config hijacking (`postcss.config.mjs`), blockchain-assisted C2 discovery, encrypted payload delivery, and dynamic execution confirms this as a sophisticated supply-chain malware loader.

---

## Analysis Workflow

```text
Suspicious npm package (postcss.config.mjs)
                 │
                 ▼
       Obfuscated JavaScript
                 │
                 │ Static analysis
                 ▼
String-table / control-flow reconstruction
                 │
                 │ Webcrack / Manual deobfuscation
                 ▼
       Deobfuscated JavaScript
                 │
                 ▼
         Behavior Analysis
                 │
                 ├── Ethereum RPC (Dead Drop Resolver)
                 ├── Transaction discovery & address parsing
                 ├── Infrastructure extraction (IPv4 decoding)
                 ├── HTTP payload retrieval (Sec-V / x-payload-b64)
                 ├── Base64 / XOR payload decryption
                 └── Dynamic execution (eval / detached node process)
```
