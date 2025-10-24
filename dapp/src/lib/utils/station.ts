import { Station } from '../../app/(dashboard)/stations/actions';

/**
 * Check if a station is fundable based on contract address presence
 */
export function isFundable(station: Station): boolean {
  return !!(station.contractAddress || station.contractId);
}

/**
 * Get the funding status message for a station
 */
export function getFundingStatusMessage(station: Station): string {
  if (isFundable(station)) {
    return '';
  }

  if (station.status === 'development') {
    return 'Contract deployment pending - funding not yet available';
  }

  return 'Contract not available - funding disabled';
}

/**
 * Get contract status for display
 */
export function getContractStatus(station: Station): {
  hasContract: boolean;
  status: 'deployed' | 'pending' | 'unavailable';
  message: string;
} {
  if (station.contractAddress || station.contractId) {
    return {
      hasContract: true,
      status: 'deployed',
      message: 'Smart contract deployed',
    };
  }

  if (station.status === 'development') {
    return {
      hasContract: false,
      status: 'pending',
      message: 'Contract deployment pending',
    };
  }

  return {
    hasContract: false,
    status: 'unavailable',
    message: 'Contract not available',
  };
}
