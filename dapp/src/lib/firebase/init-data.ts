import { Station } from '../../app/(dashboard)/stations/actions';
import { saveStationWithIdToFirestore } from './stations';

// Mamu Village Station data (from existing mock data)
const mamuVillageStation: Station = {
  id: 'mamu-village-station',
  title: 'Mamu Village Station',
  location: 'Mamu Village, Ogun State',
  region: 'South West',
  image: '/api/placeholder/400/200',
  vendor: 'Adunni Olatunji',
  rating: 4.8,
  status: 'open',
  currentAmount: 100,
  targetAmount: 1500,
  apy: 'APY 9-13%',
  closesIn: '12 days',
  priority: 'high',
  latitude: 7.0846,
  longitude: 3.9088,
  contractId: '0.0.6864361-lgpnt',
  contractAddress: '0x426da47e80738aa8847e4e7204ee40b24333f063',
  images: [
    '/api/placeholder/400/200',
    '/api/placeholder/400/200',
    '/api/placeholder/400/200',
  ],
  installETA: '30-45 days',
  startingTariff: '₦115/kWh',
  vendorStake: 8000,
  hcsFeed: '0.0.station-7',
  lastSync: 'Active',
  revenueTerms: {
    funders: 60,
    vendor: 20,
    maintenance: 10,
    treasury: 10,
  },
  payoutCadence: 'weekly via HCS proofs',
  underfundedOutcome: 'refund or roll (governance)',
};

// New "coming soon" station for a Nigerian village
const comingSoonStation: Station = {
  id: 'oluwaseun-village-station',
  title: 'Oluwaseun Village Energy Project',
  location: 'Oluwaseun Village, Kwara State',
  region: 'North Central',
  image: '/api/placeholder/400/200',
  vendor: 'Aisha Abdullahi',
  rating: 4.5,
  status: 'development',
  currentAmount: 0,
  targetAmount: 2500,
  apy: 'APY 10-14%',
  closesIn: 'Coming Soon',
  priority: 'essential',
  latitude: 8.9967,
  longitude: 4.542,
  images: [
    '/api/placeholder/400/200',
    '/api/placeholder/400/200',
    '/api/placeholder/400/200',
  ],
  installETA: '45-60 days',
  startingTariff: '₦110/kWh',
  vendorStake: 12000,
  hcsFeed: 'TBD',
  lastSync: 'Pending',
  revenueTerms: {
    funders: 65,
    vendor: 20,
    maintenance: 10,
    treasury: 5,
  },
  payoutCadence: 'weekly via HCS proofs',
  underfundedOutcome: 'refund or roll (governance)',
};

// Initialize the stations in Firestore
export async function initializeStationsData(): Promise<void> {
  try {
    console.log('Initializing stations data in Firestore...');

    // Save Mamu Village Station
    await saveStationWithIdToFirestore(
      mamuVillageStation.id,
      mamuVillageStation
    );
    console.log('✓ Mamu Village Station saved to Firestore');

    // Save Coming Soon Station
    await saveStationWithIdToFirestore(comingSoonStation.id, comingSoonStation);
    console.log('✓ Oluwaseun Village Station saved to Firestore');

    console.log('✅ All stations initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing stations data:', error);
    throw error;
  }
}

// Export station data for reference
export { mamuVillageStation, comingSoonStation };
