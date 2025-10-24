'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStations } from '../../../hooks/useStations';
import FilterBar from './components/FilterBar';
import StationCard from './components/StationCard';

export default function StationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    region: searchParams.get('region') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    sortBy: searchParams.get('sortBy') || '',
  });

  // Use the custom hook to fetch stations
  const { stations, loading } = useStations(filters);

  // Static data for filters (in real app, these would be fetched)
  const regions = [
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

  const statuses = [
    'All',
    'Open',
    'Operational',
    'Closing soon',
    'Under development',
  ];

  const priorities = ['All', 'Essential', 'High', 'Standard'];

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'amount', label: 'Funding Amount' },
    { value: 'apy', label: 'APY' },
    { value: 'closing', label: 'Closes Soon' },
  ];

  // Handle filter changes and update URL
  const handleFiltersChange = (newFilters: {
    search?: string;
    region?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
  }) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
    };

    setFilters(updatedFilters);

    // Update URL query parameters
    const params = new URLSearchParams();

    if (updatedFilters.search) params.set('search', updatedFilters.search);
    if (updatedFilters.region && updatedFilters.region !== 'all')
      params.set('region', updatedFilters.region);
    if (updatedFilters.status && updatedFilters.status !== 'all')
      params.set('status', updatedFilters.status);
    if (updatedFilters.priority && updatedFilters.priority !== 'all')
      params.set('priority', updatedFilters.priority);
    if (updatedFilters.sortBy && updatedFilters.sortBy !== 'latest')
      params.set('sortBy', updatedFilters.sortBy);

    // Update URL without page refresh
    const queryString = params.toString();
    router.replace(`/stations${queryString ? `?${queryString}` : ''}`, {
      scroll: false,
    });
  };

  // Loading state
  if (loading && stations.length === 0) {
    return (
      <div className=''>
        <FilterBar
          onFiltersChange={handleFiltersChange}
          regions={regions}
          statuses={statuses}
          priorities={priorities}
          sortOptions={sortOptions}
          initialFilters={filters}
        />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Loading skeletons */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className='animate-pulse'>
                <div className='bg-gray-100 rounded-xl h-80'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white min-h-screen'>
      <FilterBar
        onFiltersChange={handleFiltersChange}
        regions={regions}
        statuses={statuses}
        priorities={priorities}
        sortOptions={sortOptions}
        initialFilters={filters}
      />

      <main className='flex flex-col gap-8 items-center pb-[100px] pt-8'>
        {/* Stations Grid Container */}
        <div className='w-[1260px] max-w-full px-4'>
          {/* Results count and loading indicator */}
          <div className='flex items-center justify-between mb-6'>
            <div className='text-[#484848] text-[14px]'>
              {loading ? (
                <div className='flex items-center gap-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
                  Loading stations...
                </div>
              ) : (
                <span>
                  {stations.length} station
                  {stations.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
          </div>

          {/* Stations Grid */}
          {stations.length === 0 && !loading ? (
            <div className='text-center py-12'>
              <div className='text-[#484848] mb-4'>
                <svg
                  className='mx-auto h-16 w-16 text-gray-300'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-medium text-[#1e1e1e] mb-2'>
                No stations found
              </h3>
              <p className='text-[#484848]'>
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {stations.map((station) => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>
          )}

          {/* Load more button (for future pagination) */}
          {stations.length > 0 && (
            <div className='text-center mt-12'>
              <button
                className='
                bg-transparent border border-[#f4f4f4]
                text-[#484848] font-medium text-[14px]
                px-8 py-3 rounded-lg
                hover:bg-gray-50 hover:border-[#f4f4f4]
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-gray-100
              '
              >
                Load more stations
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
