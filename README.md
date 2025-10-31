# ThirdEnergy

**Track:** DEPIN

### Pitch Deck
https://drive.google.com/file/d/1eB801piseOoSSOJcDC9U7OgKNRJPthST/view?usp=sharing

### Hedera certificate link
https://drive.google.com/file/d/141VLUosK0ZkKzCAOB7B0UFjDKzAEH0X4/view?usp=drivesdk


## Vision & Impact

ThirdEnergy lets anyone fund and operate off-grid micro-stations that deliver reliable electricity to underserved communities in Nigeria, while keeping performance and impact verifiable on Hedera. Vetted local vendors collect cash, an ESP32 data logger meters energy and gates the charging dock, and funders earn performance-based returns and participate in governance via a DAO.

- **Problem:** Off-grid communities lack reliable energy access and financiers lack trustable performance data.
- **Solution:** Tokenized micro-stations with prepaid energy firmware, on-chain telemetry proofs, and contributor dashboards.
- **North Star Metrics:** Stations deployed, Watt-hours delivered, contributor APY, Hedera message volume, and outage response time.
- **Impact Story:** Pilot station in Mamu Village, Nigeria demonstrates prepaid credits, automatic cut-offs, and Hedera-backed activity logs that financiers can audit in real time.

## Hedera Integration Summary

- **On-Chain Transparency:** ThirdEnergy anchors station performance to Hedera Consensus Service (HCS), producing a public, ordered, and tamper-evident audit trail. A lightweight bridge normalizes logger telemetry (voltage, current, power, energy, power factor, frequency) and submits messages to a single global HCS topic. Anyone can verify records via mirror nodes and filter by station_id. For cost control, the bridge can batch 1-minute digests (min/max/avg, energy delta, batch hash) instead of every reading.
- **Crowdfunding Stations:** Crowdfunding runs on Hedera Smart Contract Service (HSCS) using Solidity. Contributions are escrowed on-chain under clear goal/deadline rules. Successful campaigns activate stations for operations; unsuccessful campaigns refund contributors. The on-chain state provides the authoritative funding record, while off-chain vendor workflows handle local cash operations in the field.

**Transaction Types**

- `TopicMessageSubmitTransaction`
- `TokenCreateTransaction`

**Economic Justification**

- Low, predictable fees keep telemetry logging, payouts, and fundraising affordable for African communities where each cent matters.
- High throughput supports frequent firmware-to-Hedera submissions without backlog, preserving real-time transparency.
- ABFT finality prevents double-spend or rollback scenarios, reinforcing trust for diaspora investors funding infrastructure back home.

## Monorepo Layout

| Package     | What It Does                                                                                                | Highlights                                                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `firmware/` | Firmware code for the Data Logger connected to microstation for metering, credit enforcement, relay control | PZEM004T sensing, automatic relay cutoff, Firebase log snapshots every 5s.                                                           |
| `bridge/`   | publish records from datalogger DB logs to a Hedera HCS topic for an ordered, tamper-evident audit trail    | Conditional watchers, Hedera topic publishing, pluggable callbacks, structured logging.                                              |
| `contract/` | Hardhat framework with Crowdfunding Escrow and DAO Governance contracts                                     | CrowdFundStation, StationShare, StationGovernor, optimizer-tuned Solidity 0.8.28, Hedera Testnet endpoint.                           |
| `webapp/`   | ThirdEnergy Dapp, Crowdfunding & Impact Overview                                                            | Tailored Hedera chain via `wagmi`/`RainbowKit`, Firestore-backed station catalog, React Query data hooks, landing + dashboard flows. |

## Architecture Overview

![ThirdEnergy Architecture Diagram](/docs/architecture.png)

## Component Deep Dive

### Firmware (`firmware/`)

- Written in Arduino C++ for ESP32/ESP8266 with PZEM004T v3.0 energy metering.
- Syncs NTP timestamps, polls Firebase for new credit limits and manual relay overrides, and logs every action (`logs` path).
- Forces relay cut-off once energy >= prepaid limit and pushes sensor snapshot + event log every 5 seconds.
- Provides clear serial logging for field diagnostics and ships with circuit diagram.

![Circuit Diagram](/docs/circuit-diagram.jpg)

> Firmware circuit diagram

### Hedera Bridge Service (`bridge/`)

- Firebase Admin SDK monitors `/inverter`, `/logs`, `/energy_limit` paths; watchers are enabled only when callbacks are supplied.
- Transforms RTDB payloads into Hedera telemetry envelopes (`metrics`, `state`, `station_id`) and submits to the configured topic.
- Includes topic creation utility, structured logger with log-level gating, and graceful shutdown handling (SIGINT/SIGTERM).
- [Example data](/bridge/example.json) mirrors the firmware payload schema to accelerate integration or backfill testing.

### Smart Contracts (`contract/`)

- Hardhat toolbox with Solidity (0.8.28, Cancun EVM) and Hedera Testnet RPC (`https://testnet.hashio.io/api`).
- CrowdFundStation contract exposes contribution, sweep, refund, and governance-essential enumerations.
- `StationShare` and `StationGovernor` extend liquidity/oversight features for revenue splits and community votes.
- Scripts and flattening artifacts support verification on Hashscan; `.env` driven private key injection.

### Web Application (`webapp/`)

- Next.js 15 (App Router) with TypeScript, Tailwind v4/PostCSS pipeline, and React Query state management.
- `Providers` layer wraps Wagmi + RainbowKit for Hedera Testnet (chain id 296) using WalletConnect Project ID.
- Firestore data access layer (`lib/firebase/`) seeds demo stations (`initializeStationsData`) and supports filterable station catalog.
- Dashboard UX includes landing hero, filterable stations grid, station detail readiness (images, APY, revenue splits), and wallet gating components.

## Smart Contract (Hedera Tesnet)

- `$ENERGY` token ID: [0.0.6862100](https://hashscan.io/testnet/token/0.0.6862100).
- CrowdFundStation – (Mamu Village): [0.0.6864361](https://hashscan.io/testnet/contract/0.0.6864361).
- Hedera telementry topic ID: [0.0.6883134](https://hashscan.io/testnet/topic/0.0.6883134)

## Data & Value Flow

1. **Prepaid Credits** added in Firebase (`energy_limit`) either via vendor portal or automated purchase.
2. **Firmware Loop** resets counters, restores power, and resumes telemetry streaming every 5 seconds.
3. **Logs & Telemetry** persisted in Firebase (`logs`, `inverter`) for local monitoring and redundancy.
4. **Bridge Service** converts snapshots to Hedera Consensus Service messages, anchoring immutable proofs of consumption and relay state.
5. **Web App** reads Firestore to present funding opportunities, APY projections, and sync status; it can cross-reference Hedera topic hashes.
6. **Contributors** connect wallets via RainbowKit to pledge HBAR, receive StationShare allocations, and audit Hashscan events.

## Setup Instructions (Web App)

- **Step 1 — Clone this repo:** then `cd thirdenergy`.
- **Step 2 — Install dependencies:** `cd webapp` and run `npm install` (Node.js 18+ recommended).
- **Step 3 — Create local env file:** `cp .env.example .env.local` to mirror the template.
- **Step 4 — Configure Firebase:** Update `.env.local` with your Firebase web app values (`NEXT_PUBLIC_FIREBASE_*` fields) from Project Settings → General.
- **Step 5 — Configure Hedera access:** Set `NEXT_PUBLIC_HEDERA_RPC_URL` to your preferred Hedera Testnet RPC (e.g., `https://testnet.hashio.io/api`) and supply a WalletConnect Project ID via `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.
- **Step 6 — Run the dev server:** `npm run dev`, then open `http://localhost:3000` to explore the landing page, wallet connect flow, and stations dashboard.

## Roadmap

- Deploy on mainnet.
- Launch crowdfunding for our pilot base station ($20,000 funding goal), in Mamu village, Ogun State, Nigeria.
- Produce Improve version of pilot power station.
- Produce 20-50 powerbanks for the Mamu power station subscribers.
- Integrate on-device failover (LoRaWAN/SMS) for sites with intermittent internet.
- Launch governance UI for StationGovernor proposals and community voting.
  
Built by the ThirdEnergy team to demonstrate how Hedera-secured telemetry can unlock bankable microgrid financing for emerging markets.
