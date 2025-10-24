import { http } from 'wagmi';
import { defineChain } from 'viem';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Define Hedera Testnet chain
export const hederaTestnet = defineChain({
  id: 296,
  name: 'Hedera Testnet',
  network: 'hedera-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: {
      http: [
        'https://muddy-patient-spree.hedera-testnet.quiknode.pro/b3aa149e3775bcd0e32fc2495f292436629c8359',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hashscan',
      url: 'https://hashscan.io/testnet',
    },
  },
  testnet: true,
});

// RainbowKit configuration
export const config = getDefaultConfig({
  appName: 'Third Energy',
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [hederaTestnet],
  transports: {
    [hederaTestnet.id]: http(),
  },
  ssr: true,
});

// Contract addresses and ABIs
export const CROWDFUND_ABI = [
  // Add your contract ABI here
  {
    type: 'function',
    name: 'contribute',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'status',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'phase', type: 'uint8' },
      { name: 'raised', type: 'uint256' },
      { name: 'endTs', type: 'uint64' },
      { name: 'goal', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'totalRaised',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'goalTinybars',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

// Helper functions
export function tinybarsToHbar(tinybars: bigint): number {
  return Number(tinybars) / 100_000_000;
}

export function hbarToTinybars(hbar: number): bigint {
  return BigInt(Math.round(hbar * 100_000_000));
}

export function validateContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
