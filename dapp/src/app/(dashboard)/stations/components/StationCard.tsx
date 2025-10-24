'use client';

import { useState } from 'react';
import { Station } from '../actions';
import StationDetailModal from './StationDetailModal';
import FundingModal from './FundingModal';
import MapEmbed from '../../../../components/MapEmbed';
import {
  isFundable,
  getFundingStatusMessage,
} from '../../../../lib/utils/station';

interface StationCardProps {
  station: Station;
  onFund?: (station: Station, amount: number, method: string) => void;
}

function getStatusLabel(status: Station['status']) {
  switch (status) {
    case 'open':
      return 'Open';
    case 'operational':
      return 'Operational';
    case 'closing':
      return 'Closing soon';
    case 'development':
      return 'Under development';
    default:
      return 'Unknown';
  }
}

export default function StationCard({ station, onFund }: StationCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFundingModalOpen, setIsFundingModalOpen] = useState(false);
  const progressPercentage = Math.min(
    (station.currentAmount / station.targetAmount) * 100,
    100
  );

  const handleViewDetails = () => {
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleOpenFundingModal = () => {
    setIsFundingModalOpen(true);
    setIsDetailModalOpen(false); // Close detail modal if open
  };

  const handleCloseFundingModal = () => {
    setIsFundingModalOpen(false);
  };

  const handleFundingSuccess = (
    stationToFund: Station,
    amount: number,
    method: string
  ) => {
    if (onFund) {
      onFund(stationToFund, amount, method);
    }
    setIsFundingModalOpen(false);
  };

  const handleDirectFund = () => {
    if (isFundable(station)) {
      setIsFundingModalOpen(true);
    }
  };

  const fundable = isFundable(station);
  const fundingStatusMessage = getFundingStatusMessage(station);

  return (
    <>
      <div className='bg-white rounded-2xl border-0 overflow-hidden shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] hover:shadow-[0px_8px_30px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 p-4'>
        {/* Station Map */}
        <div className='mb-4'>
          <MapEmbed
            latitude={station.latitude}
            longitude={station.longitude}
            title={station.title}
            className='h-[226px] rounded-[11px]'
          />
        </div>

        {/* Card Content */}
        <div className='flex flex-col gap-[14px]'>
          {/* Title Section */}
          <div className='flex gap-1 items-start'>
            <div className='flex-1 flex flex-col gap-1'>
              {/* Location */}
              <div className='flex gap-2 items-center text-[10px] text-[#5a5a5a]'>
                <span>{station.location}</span>
                <span>•</span>
                <span>{station.region}</span>
              </div>

              {/* Title */}
              <h3 className='text-[24px] font-bold text-[#1f1f1f] leading-none'>
                {station.title}
              </h3>

              {/* Vendor Info */}
              <div className='flex gap-1 items-center text-[10px] text-[#5a5a5a]'>
                <div className='w-4 h-4 bg-[#ffb600] rounded-full'></div>
                <span>{station.vendor}</span>
                <span>•</span>
                <div className='flex gap-[2.538px] items-center'>
                  <svg
                    width='10'
                    height='10'
                    viewBox='0 0 24 24'
                    fill='#ffb600'
                  >
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                  </svg>
                  <span className='text-[#1f1f1f]'>{station.rating}</span>
                </div>
                <span>•</span>
                <span className='text-[#23b155] capitalize'>
                  {getStatusLabel(station.status)}
                </span>
              </div>
            </div>

            {/* APY Badge */}
            <div className='bg-[#e7f0ff] px-2 py-1 rounded-[32px]'>
              <span className='text-[#2b81ff] text-[12px] font-medium'>
                {station.apy}
              </span>
            </div>
          </div>

          {/* Funding Progress */}
          <div className='bg-transparent px-2 py-[6px] flex flex-col gap-1'>
            <div className='flex gap-1 items-center leading-none'>
              <div className='flex-1 flex gap-1 items-center'>
                <span className='text-[18px] font-bold text-[#1e1e1e]'>
                  ${station.currentAmount.toLocaleString()}
                </span>
                <span className='text-[12px] text-[#484848]'>
                  raised of ${station.targetAmount.toLocaleString()} goal
                </span>
              </div>
              <span className='text-[14px] text-[#484848]'>
                Closes in {station.closesIn}
              </span>
            </div>

            {/* Progress Bar */}
            <div className='w-full bg-[#f2f4f7] rounded-2xl h-2 overflow-hidden'>
              <div
                className='bg-[#2b81ff] h-2 rounded-2xl transition-all duration-500 ease-out'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col gap-2'>
            <div className='relative group'>
              <button
                onClick={handleDirectFund}
                disabled={!fundable}
                className={`
                  w-full font-semibold text-base
                  px-6 py-[14px] rounded-lg
                  transition-all duration-200
                  focus:outline-none
                  ${
                    fundable
                      ? 'bg-[#fcc744] hover:bg-[#fcc744]/90 text-[#1e1e1e] hover:transform hover:-translate-y-0.5 focus:ring-2 focus:ring-[#fcc744]/20'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
                title={!fundable ? fundingStatusMessage : ''}
              >
                {fundable ? 'Fund' : 'Not Available'}
              </button>

              {/* Tooltip for disabled state */}
              {!fundable && (
                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                  {fundingStatusMessage}
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800'></div>
                </div>
              )}
            </div>
            <button
              onClick={handleViewDetails}
              className='
              w-full bg-transparent
              text-[#1e1e1e] font-normal text-base
              px-6 py-[6px] rounded-lg
              hover:bg-gray-50
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-100
            '
            >
              View details
            </button>
          </div>
        </div>
      </div>

      {/* Station Detail Modal */}
      <StationDetailModal
        station={station}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onFund={handleOpenFundingModal}
      />

      {/* Funding Modal */}
      <FundingModal
        station={station}
        isOpen={isFundingModalOpen}
        onClose={handleCloseFundingModal}
        onSuccess={handleFundingSuccess}
      />
    </>
  );
}
