export interface PortfolioProject {
  id: string;
  title: string;
  location: string;
  region: string;
  status: 'operational' | 'under_development';
  sharePercentage: number;
  claimableAmount: number;
  apy: number;
  imageProgress: string; // "1/10"
  // Map coordinates
  latitude: number;
  longitude: number;
}

export interface PortfolioSummary {
  totalClaimable: number;
  rewards: number;
}

// Mock data for portfolio projects
const mockPortfolioData: PortfolioProject[] = [
  {
    id: '1',
    title: 'Lekki Coastal Project',
    location: 'Lagos, Nigeria',
    region: 'South West',
    status: 'operational',
    sharePercentage: 2.4,
    claimableAmount: 180,
    apy: 12.3,
    imageProgress: '1/10',
    latitude: 6.4474,
    longitude: 3.4106,
  },
  {
    id: '2',
    title: 'Mamu Village Station',
    location: 'Mamu Village, Ogun State',
    region: 'South West',
    status: 'under_development',
    sharePercentage: 1.8,
    claimableAmount: 0,
    apy: 9.7,
    imageProgress: '1/10',
    latitude: 7.0846,
    longitude: 3.9088,
  },
];

// Mock data for portfolio summary
const mockSummaryData: PortfolioSummary = {
  totalClaimable: 236,
  rewards: 18.26,
};

export async function getPortfolioData(): Promise<PortfolioProject[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, this would fetch from your API
  return mockPortfolioData;
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, this would fetch from your API
  return mockSummaryData;
}

export async function claimEarnings(
  projectId: string
): Promise<{ success: boolean; message: string }> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock response
  return {
    success: true,
    message: `Successfully claimed earnings for project ${projectId}`,
  };
}

export async function claimEnergy(
  projectId: string
): Promise<{ success: boolean; message: string }> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock response
  return {
    success: true,
    message: `Successfully claimed $ENERGY for project ${projectId}`,
  };
}

export async function claimAll(): Promise<{
  success: boolean;
  message: string;
}> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Mock response
  return {
    success: true,
    message: 'Successfully claimed all available rewards',
  };
}
