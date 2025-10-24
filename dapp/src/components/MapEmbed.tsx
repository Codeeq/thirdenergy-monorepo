'use client';

import { useState } from 'react';

interface MapEmbedProps {
  latitude: number;
  longitude: number;
  title?: string;
  className?: string;
}

export default function MapEmbed({
  latitude,
  longitude,
  title = 'Station Location',
  className = 'h-[226px] rounded-[11px]',
}: MapEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Calculate appropriate bbox for the map based on coordinates
  const calculateMapBounds = (lat: number, lng: number) => {
    // Zoom level 15 provides good detail for stations
    const delta = 0.01; // Approximately 1km at equator
    return {
      bbox: `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`,
      marker: `${lat},${lng}`,
    };
  };

  const { bbox, marker } = calculateMapBounds(latitude, longitude);

  // Construct OpenStreetMap embed URL
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading State */}
      {isLoading && (
        <div className='absolute inset-0 bg-[#f5edfe] flex items-center justify-center z-10'>
          <div className='animate-pulse flex flex-col items-center'>
            <div className='w-8 h-8 text-[#5a5a5a] mb-2 text-2xl'>🗺️</div>
            <div className='text-xs text-[#5a5a5a]'>Loading map...</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className='absolute inset-0 bg-gradient-to-br from-[#f5edfe] to-[#ebe7f0] flex items-center justify-center z-10'>
          <div className='text-[#5a5a5a] text-center'>
            <div className='text-2xl mb-2'>📍</div>
            <div className='text-sm font-medium'>{title}</div>
            <div className='text-xs mt-1'>
              {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
            </div>
          </div>
        </div>
      )}

      {/* Map Iframe */}
      <iframe
        src={mapUrl}
        className={`w-full h-full border-none transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        frameBorder='0'
        scrolling='no'
        marginHeight={0}
        marginWidth={0}
        title={`Map showing ${title}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{ border: '1px solid transparent' }}
      />

      {/* Image count overlay (matching original design) */}
      <div className='absolute top-[13.81px] right-4 bg-black/50 backdrop-blur-sm px-[6px] py-[6px] rounded-[4px] z-20'>
        <span className='text-[#f4f4f4] text-[10px] font-normal'>Map</span>
      </div>
    </div>
  );
}
