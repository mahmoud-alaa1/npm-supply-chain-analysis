````markdown
# Indicators of Compromise (IOCs)

> **Source Notice:** These indicators were extracted strictly during **static analysis** of the suspicious JavaScript sample. They are provided solely for defensive research, threat hunting, and rule detection.

---

## 1. Campaign Identifier

```text
A9-0003-1
```
````

The sample initializes this value via global assignment:

```javascript
global.i = "A9-0003-1";
```

---

## 2. Ethereum Infrastructure

### Sender Address

- **Address:** `0xa322E5f3D311D3080e6f0121063e9aDC2490Ef1a`
- **Note:** The address is normalized to lowercase prior to querying Ethereum transactions.

### Observed RPC Endpoints

- `https://1rpc.io/eth`
- `https://eth.drpc.org`
- `https://ethereum-rpc.publicnode.com`
- `https://eth-mainnet.public.blastapi.io`

### Observed JSON-RPC Methods

- `eth_blockNumber`
- `eth_getBlockByNumber`
- `eth_getTransactionCount`

---

## 3. Infrastructure Discovery Mechanism

The malware utilizes a **blockchain-assisted mechanism** (Dead Drop Resolver) to discover command-and-control (C2) network infrastructure dynamically:

1. Searches for a transaction originating from the hardcoded Ethereum sender address.
2. Extracts the destination field (`tx.to`) of the discovered transaction as raw hexadecimal bytes.
3. Decodes the first 8 bytes into two distinct IPv4 addresses:

```text
tx.to
 │
 ├── bytes[0..3] ──> IPv4 Address #1
 │
 └── bytes[4..7] ──> IPv4 Address #2

```

---

## 4. HTTP Indicators

### Observed Paths

- `/0x/cls`
- `/0x/ls`

### HTTP Methods

- `GET`
- `HEAD`

### Custom Headers

| Header          | Description / Purpose                                       |
| --------------- | ----------------------------------------------------------- |
| `Sec-V`         | Carries the campaign identifier (`A9-0003-1`)               |
| `x-payload-b64` | Transmits encoded payload in `HEAD`-response delivery paths |

---

## 5. Payload Encoding & Decryption Flow

The sample contains a repeating-key XOR decryption routine.

```text
Incoming Data (Base64)
          │
          ▼
    XOR Decryption (Repeating Key)
          │
          ▼
   Executable UTF-8 Payload

```

> **Note:** Direct binary byte streams from `GET` responses can also be processed directly through the XOR operation before execution.

---

## 6. Execution Primitives

Dynamically retrieved payloads are executed using the following primitives:

1. **In-Process Execution:**

```javascript
eval(...)

```

2. **Detached Process Spawning:**

```javascript
spawn("node", ["-e", ...], {
    detached: true,
    stdio: "ignore",
    windowsHide: true
}).unref();

```

---

## 7. Observed Global Variables

- `global._V`
- `global._H`
- `global._H2`
- `global._t_s`
- `global._t_u`

---

## 8. Defensive Detection Opportunities

Key telemetry points for detection and threat hunting:

- **Network Telemetry:**
- Node.js processes issuing unexpected JSON-RPC queries to public Ethereum endpoints.
- Inbound/Outbound HTTP traffic containing the custom `Sec-V` header or receiving `x-payload-b64`.

- **Package/Runtime Behavior:**
- JavaScript/npm packages querying blockchain infrastructure during post-install or runtime phases.

- **Process Lineage & Behavior:**
- Child processes matching `node -e` with `detached: true` and `windowsHide: true` spawned by web servers or application workers.
- Dynamic code execution using `eval()` on data retrieved from external network streams.

---

## ⚠️ Safety Notice

> **DO NOT** execute the original or deobfuscated sample in an unisolated environment.
> **DO NOT** connect to or interact with the listed infrastructure during routine analysis without proper anonymization and safeguards.
> All indicators provided herein are strictly for threat intelligence, defensive monitoring, and detection engineering.
