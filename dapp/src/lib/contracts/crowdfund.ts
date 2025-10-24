import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { config } from '@/lib/web3/config';
import { CROWDFUND_ABI, hederaTestnet } from '@/lib/web3/config';

export interface ContractContributionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface ContractStatus {
  phase: number;
  raised: bigint;
  endTs: bigint;
  goal: bigint;
}

/**
 * Contribute to a crowdfunding station
 */
export async function contributeToStation(
  contractAddress: `0x${string}`,
  contributionAmountHbar: number
): Promise<ContractContributionResult> {
  try {
    // Convert HBAR to wei (1 HBAR = 10^18 wei in EVM context)
    const contributionWei = BigInt(Math.round(contributionAmountHbar * 1e18));

    const hash = await writeContract(config, {
      address: contractAddress,
      abi: CROWDFUND_ABI,
      functionName: 'contribute',
      value: contributionWei,
      chainId: hederaTestnet.id,
    });

    // Wait for transaction confirmation
    const receipt = await waitForTransactionReceipt(config, {
      hash,
      chainId: hederaTestnet.id,
    });

    if (receipt.status === 'success') {
      return {
        success: true,
        transactionHash: hash,
      };
    } else {
      return {
        success: false,
        error: 'Transaction failed',
      };
    }
  } catch (error: unknown) {
    console.error('Contract contribution error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get contract status (phase, raised amount, deadline, goal)
 */
export async function getContractStatus(
  contractAddress: `0x${string}`
): Promise<ContractStatus | null> {
  try {
    const result = await readContract(config, {
      address: contractAddress,
      abi: CROWDFUND_ABI,
      functionName: 'status',
      chainId: hederaTestnet.id,
    });

    if (Array.isArray(result) && result.length === 4) {
      return {
        phase: Number(result[0]),
        raised: result[1] as bigint,
        endTs: result[2] as bigint,
        goal: result[3] as bigint,
      };
    }

    return null;
  } catch (error: unknown) {
    console.error('Contract status query error:', error);
    return null;
  }
}

/**
 * Get total raised amount from contract
 */
export async function getTotalRaised(
  contractAddress: `0x${string}`
): Promise<bigint | null> {
  try {
    const result = await readContract(config, {
      address: contractAddress,
      abi: CROWDFUND_ABI,
      functionName: 'totalRaised',
      chainId: hederaTestnet.id,
    });

    return result as bigint;
  } catch (error: unknown) {
    console.error('Total raised query error:', error);
    return null;
  }
}

/**
 * Get contract goal
 */
export async function getContractGoal(
  contractAddress: `0x${string}`
): Promise<bigint | null> {
  try {
    const result = await readContract(config, {
      address: contractAddress,
      abi: CROWDFUND_ABI,
      functionName: 'goalTinybars',
      chainId: hederaTestnet.id,
    });

    return result as bigint;
  } catch (error: unknown) {
    console.error('Contract goal query error:', error);
    return null;
  }
}

/**
 * Convert wei to HBAR (for EVM compatibility)
 */
export function weiToHbar(wei: bigint): number {
  return Number(wei) / 1e18;
}

/**
 * Convert HBAR to wei (for EVM compatibility)
 */
export function hbarToWei(hbar: number): bigint {
  return BigInt(Math.round(hbar * 1e18));
}
