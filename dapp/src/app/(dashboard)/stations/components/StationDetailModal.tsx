'use client';

import { useEffect } from 'react';
import { Station } from '../actions';
import MapEmbed from '../../../../components/MapEmbed';
import {
  isFundable,
  getFundingStatusMessage,
  getContractStatus,
} from '../../../../lib/utils/station';

interface StationDetailModalProps {
  station: Station | null;
  isOpen: boolean;
  onClose: () => void;
  onFund?: () => void;
}

export default function StationDetailModal({
  station,
  isOpen,
  onClose,
  onFund,
}: StationDetailModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !station) {
    return null;
  }

  const progressPercentage = Math.min(
    (station.currentAmount / station.targetAmount) * 100,
    100
  );

  const handleFundClick = () => {
    if (isFundable(station) && onFund) {
      onFund();
    }
  };

  const fundable = isFundable(station);
  const fundingStatusMessage = getFundingStatusMessage(station);
  const contractStatus = getContractStatus(station);

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-[rgba(72,72,72,0.78)] transition-opacity z-40'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='fixed inset-0 z-50 overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full'>
            <div className='pointer-events-auto relative w-[576px] h-full'>
              <div className='bg-white h-full overflow-y-auto flex flex-col justify-between'>
                {/* Main Content */}
                <div className='flex flex-col gap-5 px-8 py-10'>
                  {/* Back Arrow */}
                  <button
                    onClick={onClose}
                    className='w-6 h-6 self-start'
                    aria-label='Close station details'
                  >
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M19 12H5M12 19l-7-7 7-7'
                      />
                    </svg>
                  </button>

                  {/* Station Details Container */}
                  <div className='flex flex-col gap-4 w-full'>
                    {/* Title Section */}
                    <div className='flex gap-1 items-start h-[73px]'>
                      <div className='flex-1 flex flex-col gap-1'>
                        {/* Location */}
                        <div className='flex gap-2 items-center text-[12px] text-[#5a5a5a]'>
                          <span>{station.location}</span>
                          <span>•</span>
                          <span>{station.region}</span>
                        </div>

                        {/* Title */}
                        <h2 className='text-[24px] font-bold text-[#1f1f1f] leading-none'>
                          {station.title}
                        </h2>

                        {/* Vendor Info */}
                        <div className='flex gap-1 items-center text-[10px] text-[#5a5a5a]'>
                          <div className='w-4 h-4 bg-[#ffb600] rounded-full'></div>
                          <span className='text-[12px]'>{station.vendor}</span>
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
                            <span className='text-[#1f1f1f] text-[10px]'>
                              {station.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* APY Badge */}
                      <div className='bg-[#e7f0ff] px-2 py-1 rounded-[32px]'>
                        <span className='text-[#2b81ff] text-[12px] font-medium'>
                          {station.apy}
                        </span>
                      </div>
                    </div>

                    {/* Station Map */}
                    <MapEmbed
                      latitude={station.latitude}
                      longitude={station.longitude}
                      title={station.title}
                      className='h-[226px] rounded-[11px]'
                    />

                    {/* Details Container */}
                    <div className='flex flex-col gap-[14px]'>
                      {/* Funding Progress */}
                      <div className='px-0 py-[6px] flex flex-col gap-[6px]'>
                        <div className='flex gap-1 items-center leading-none'>
                          <div className='flex-1 flex gap-1 items-center'>
                            <span className='text-[18px] font-bold text-[#1e1e1e]'>
                              ${station.currentAmount.toLocaleString()}
                            </span>
                            <span className='text-[12px] text-[#484848]'>
                              raised of ${station.targetAmount.toLocaleString()}{' '}
                              goal
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

                        <div className='text-[14px] text-[#484848]'>
                          Install ETA after funding:{' '}
                          <span className='font-medium text-[#1e1e1e]'>
                            30–45 days
                          </span>
                        </div>
                      </div>

                      {/* Contract Status Section */}
                      <div className='bg-[#f7f7f7] px-4 py-[10px] rounded-[12px] flex flex-col gap-2'>
                        <div className='text-[10px] font-medium text-[#484848]'>
                          Smart Contract Status
                        </div>
                        <div className='flex gap-1 items-center'>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              contractStatus.status === 'deployed'
                                ? 'bg-green-500'
                                : contractStatus.status === 'pending'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }`}
                          ></div>
                          <span className='text-[14px] text-[#1e1e1e]'>
                            {contractStatus.message}
                          </span>
                        </div>
                        {station.contractAddress && (
                          <div className='text-[10px] text-[#484848]'>
                            Address: {station.contractAddress}
                          </div>
                        )}
                      </div>

                      {/* Vendor Section */}
                      <div className='bg-[#f7f7f7] px-4 py-[10px] rounded-[12px] flex flex-col gap-2'>
                        <div className='text-[10px] font-medium text-[#484848]'>
                          Vendor
                        </div>
                        <div className='flex gap-1 items-center w-full'>
                          <div className='flex-1 flex gap-1 items-center'>
                            <div className='w-5 h-5 bg-[#ffb600] rounded-full'></div>
                            <span className='text-[14px] text-[#1e1e1e]'>
                              {station.vendor}
                            </span>
                            <span className='text-[10px] text-[#5a5a5a]'>
                              •
                            </span>
                            <div className='flex gap-[2.538px] items-center'>
                              <svg
                                width='10'
                                height='10'
                                viewBox='0 0 24 24'
                                fill='#ffb600'
                              >
                                <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                              </svg>
                              <span className='text-[#1f1f1f] text-[10px]'>
                                {station.rating}
                              </span>
                            </div>
                          </div>
                          <div className='flex gap-1 items-center'>
                            <span className='text-[10px] text-[#1f1f1f]'>
                              Stake:
                            </span>
                            <span className='text-[16px] font-medium text-[#1e1e1e]'>
                              10,000
                            </span>
                            <span className='text-[10px] text-[#1f1f1f]'>
                              $ENERGY
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Starting Tariff & Transparency */}
                      <div className='flex gap-4 items-start'>
                        {/* Starting Tariff */}
                        <div className='flex-1 border border-[#e8e8e8] px-4 py-3 rounded-[12px] flex flex-col gap-2'>
                          <div className='text-[10px] font-medium text-[#484848]'>
                            Starting Tariff
                          </div>
                          <div className='flex flex-col gap-1'>
                            <div className='flex items-center'>
                              <span className='text-[18px] font-bold text-[#1e1e1e]'>
                                ₦120
                              </span>
                              <span className='text-[12px] text-[#484848]'>
                                /kWh
                              </span>
                            </div>
                            <div className='text-[10px] text-[#484848]'>
                              Governance-controlled: funders may adjust this up
                              to ±5% per annum.
                            </div>
                          </div>
                        </div>

                        {/* Transparency */}
                        <div className='flex-1 border border-[#e8e8e8] px-4 py-3 rounded-[12px] flex flex-col gap-2 self-stretch'>
                          <div className='text-[10px] font-medium text-[#484848]'>
                            Transparency
                          </div>
                          <div className='flex gap-1 items-center text-[12px]'>
                            <span className='text-[#484848]'>HCS feed:</span>
                            <span className='text-[#1e1e1e]'>
                              0.0.station-2
                            </span>
                          </div>
                          <div className='flex gap-1 items-center text-[10px]'>
                            <span className='text-[#484848]'>Last sync:</span>
                            <span className='text-[#1e1e1e]'>Stale</span>
                          </div>
                        </div>
                      </div>

                      {/* Terms & Conditions */}
                      <div className='flex flex-col gap-2 leading-none rounded-[12px]'>
                        <div className='text-[14px] font-medium text-[#484848]'>
                          Terms & Conditions
                        </div>
                        <div className='text-[16px] text-[#1e1e1e]'>
                          <ul className='space-y-0 list-disc pl-6'>
                            <li>
                              Revenue split: Funders 60% · Vendor 20% ·
                              Maintenance 10% · Treasury 10%
                            </li>
                            <li>Payout cadence: weekly via HCS proofs</li>
                            <li>
                              Underfunded outcome: refund or roll (governance)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Fund Button */}
                <div className='border-t border-[#e1e1e1] px-10 py-10'>
                  <div className='flex flex-col gap-3'>
                    {!fundable && (
                      <div className='text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                        <div className='text-[14px] text-yellow-800 font-medium'>
                          Funding Not Available
                        </div>
                        <div className='text-[12px] text-yellow-600 mt-1'>
                          {fundingStatusMessage}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleFundClick}
                      disabled={!fundable}
                      className={`
                        w-full font-semibold text-[16px]
                        px-6 py-[14px] rounded-lg
                        transition-all duration-200
                        focus:outline-none
                        ${
                          fundable
                            ? 'bg-[#fcc744] hover:bg-[#fcc744]/90 text-[#1e1e1e] hover:transform hover:-translate-y-0.5 focus:ring-2 focus:ring-[#fcc744]/20'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      {fundable ? 'Fund this station' : 'Funding unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
