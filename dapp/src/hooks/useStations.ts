'use client';

import { useState, useEffect, useCallback } from 'react';
import { Station, FilterParams } from '../app/(dashboard)/stations/actions';
import { getStationsFromFirestore } from '../lib/firebase/stations';
import { initializeStationsData } from '../lib/firebase/init-data';

export interface UseStationsResult {
  stations: Station[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStations(filters: FilterParams = {}): UseStationsResult {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize data on first run if needed
      await initializeStationsData();

      // Fetch stations from Firestore
      const fetchedStations = await getStationsFromFirestore(filters);
      setStations(fetchedStations);
    } catch (err) {
      console.error('Error fetching stations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stations');
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refetch = async () => {
    await fetchStations();
  };

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  return {
    stations,
    loading,
    error,
    refetch,
  };
}
