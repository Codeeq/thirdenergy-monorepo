'use server';

export interface Station {
  id: string;
  title: string;
  location: string;
  region: string;
  image: string;
  vendor: string;
  rating: number;
  status: 'open' | 'operational' | 'closing' | 'development';
  currentAmount: number;
  targetAmount: number;
  apy: string;
  closesIn: string;
  priority: 'essential' | 'high' | 'standard';
  // Map coordinates
  latitude: number;
  longitude: number;
  // Contract information
  contractId?: string;
  contractAddress?: string;
  // Additional fields for modal
  images?: string[];
  installETA?: string;
  startingTariff?: string;
  vendorStake?: number;
  hcsFeed?: string;
  lastSync?: string;
  revenueTerms?: {
    funders: number;
    vendor: number;
    maintenance: number;
    treasury: number;
  };
  payoutCadence?: string;
  underfundedOutcome?: string;
}

export interface FilterParams {
  region?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  search?: string;
}

export async function getRegions(): Promise<string[]> {
  return [
    'All Regions',
    'North Central',
    'North East',
    'North West',
    'South East',
    'South South',
    'South West',
    'East Africa',
    'Central Uganda',
  ];
}

export async function getStatuses(): Promise<string[]> {
  return ['All', 'Open', 'Operational', 'Closing soon', 'Under development'];
}

export async function getPriorities(): Promise<string[]> {
  return ['All', 'Essential', 'High', 'Standard'];
}

export async function getSortOptions(): Promise<
  Array<{ value: string; label: string }>
> {
  return [
    { value: 'latest', label: 'Latest' },
    { value: 'amount', label: 'Funding Amount' },
    { value: 'apy', label: 'APY' },
    { value: 'closing', label: 'Closes Soon' },
  ];
}
