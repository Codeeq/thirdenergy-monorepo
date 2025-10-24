import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { Station, FilterParams } from '../../app/(dashboard)/stations/actions';

const COLLECTION_NAME = 'stations';
const stationsCollection = collection(db, COLLECTION_NAME);

// Save a station to Firestore
export async function saveStationToFirestore(
  station: Station
): Promise<string> {
  try {
    const docRef = await addDoc(stationsCollection, {
      ...station,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving station to Firestore:', error);
    throw error;
  }
}

// Save a station with a specific ID to Firestore
export async function saveStationWithIdToFirestore(
  stationId: string,
  station: Station
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, stationId);
    await setDoc(docRef, {
      ...station,
      id: stationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error saving station with ID to Firestore:', error);
    throw error;
  }
}

// Get stations from Firestore with filtering
export async function getStationsFromFirestore(
  filters: FilterParams = {}
): Promise<Station[]> {
  try {
    const constraints: QueryConstraint[] = [];

    // Add filters
    if (
      filters.region &&
      filters.region !== 'all' &&
      filters.region !== 'All Regions'
    ) {
      constraints.push(where('region', '==', filters.region));
    }

    if (
      filters.status &&
      filters.status !== 'all' &&
      filters.status !== 'All'
    ) {
      // Map frontend status values to database values
      const statusMap: { [key: string]: string } = {
        Open: 'open',
        Operational: 'operational',
        'Closing soon': 'closing',
        'Under development': 'development',
      };
      const dbStatus =
        statusMap[filters.status] || filters.status.toLowerCase();
      constraints.push(where('status', '==', dbStatus));
    }

    if (
      filters.priority &&
      filters.priority !== 'all' &&
      filters.priority !== 'All'
    ) {
      const dbPriority = filters.priority.toLowerCase();
      constraints.push(where('priority', '==', dbPriority));
    }

    // Add sorting (Firestore requires orderBy to be last)
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'amount':
          constraints.push(orderBy('currentAmount', 'desc'));
          break;
        case 'closing':
          constraints.push(orderBy('closesIn', 'asc'));
          break;
        default:
          constraints.push(orderBy('createdAt', 'desc'));
          break;
      }
    } else {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    const q = query(stationsCollection, ...constraints);
    const querySnapshot = await getDocs(q);

    let stations: Station[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stations.push({
        ...data,
        id: doc.id,
      } as Station);
    });

    // Apply search filter (client-side since Firestore doesn't have full-text search)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      stations = stations.filter(
        (station) =>
          station.title.toLowerCase().includes(searchTerm) ||
          station.location.toLowerCase().includes(searchTerm) ||
          station.vendor.toLowerCase().includes(searchTerm)
      );
    }

    // Apply APY sorting (client-side since it's a string field)
    if (filters.sortBy === 'apy') {
      stations.sort((a, b) => {
        const apyA = parseInt(a.apy.match(/\d+/)?.[0] || '0');
        const apyB = parseInt(b.apy.match(/\d+/)?.[0] || '0');
        return apyB - apyA;
      });
    }

    return stations;
  } catch (error) {
    console.error('Error getting stations from Firestore:', error);
    throw error;
  }
}

// Get a single station by ID
export async function getStationById(
  stationId: string
): Promise<Station | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, stationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id: docSnap.id,
      } as Station;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting station by ID:', error);
    throw error;
  }
}

// Update a station in Firestore
export async function updateStationInFirestore(
  stationId: string,
  updates: Partial<Station>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, stationId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating station in Firestore:', error);
    throw error;
  }
}

// Delete a station from Firestore
export async function deleteStationFromFirestore(
  stationId: string
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, stationId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting station from Firestore:', error);
    throw error;
  }
}

// Initialize database with stations data
export async function initializeStationsInFirestore(
  stations: Station[]
): Promise<void> {
  try {
    for (const station of stations) {
      const docRef = doc(db, COLLECTION_NAME, station.id);
      await setDoc(docRef, {
        ...station,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Error initializing stations in Firestore:', error);
    throw error;
  }
}
