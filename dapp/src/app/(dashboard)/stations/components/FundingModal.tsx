'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Station } from '../actions';
import { useAccount, useBalance } from 'wagmi';
import { contributeToStation } from '@/lib/contracts/crowdfund';
import { validateContractAddress } from '@/lib/web3/config';
import {
  usdToHbar,
  getHbarPriceUsd,
  formatHbar,
  formatCurrency,
} from '@/lib/utils/currency';
import SuccessModal from './SuccessModal';

interface FundingModalProps {
  station: Station | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (station: Station, amount: number, method: string) => void;
}

export default function FundingModal({
  station,
  isOpen,
  onClose,
  onSuccess,
}: FundingModalProps) {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  const [amountUsd, setAmountUsd] = useState(
    station ? Math.min(1000, station.targetAmount * 0.1) : 1000
  );
  const [amountHbar, setAmountHbar] = useState(0);
  const [hbarPrice, setHbarPrice] = useState(0.054); // Fallback price
  const [selectedMethod] = useState('hbar');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  const router = useRouter();

  // Fetch HBAR price and initialize amounts
  useEffect(() => {
    const initializeAmounts = async () => {
      try {
        const price = await getHbarPriceUsd();
        setHbarPrice(price);
      } catch (error) {
        console.warn('Failed to fetch HBAR price:', error);
      }
    };

    if (isOpen) {
      initializeAmounts();
    }
  }, [isOpen]);

  // Update default amount when station changes
  useEffect(() => {
    if (station) {
      const defaultUsdAmount = Math.min(1000, station.targetAmount * 0.1);
      setAmountUsd(defaultUsdAmount);
      setAmountHbar(usdToHbar(defaultUsdAmount, hbarPrice));
    }
  }, [station, hbarPrice]);

  // Update HBAR amount when USD amount or price changes
  useEffect(() => {
    setAmountHbar(usdToHbar(amountUsd, hbarPrice));
  }, [amountUsd, hbarPrice]);

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

  // Calculate estimated share percentage
  const estimatedShare = (amountUsd / station.targetAmount) * 100;
  const sliderValue = (amountUsd / station.targetAmount) * 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = parseFloat(e.target.value);
    const newAmountUsd = Math.round((percentage / 100) * station.targetAmount);
    setAmountUsd(newAmountUsd);
  };

  const handleSubmit = async () => {
    if (amountHbar <= 0 || amountUsd > station.targetAmount) return;

    // Check wallet connection first
    if (!isConnected || !address) {
      setTransactionError('Please connect your wallet first');
      return;
    }

    // Check if station has contract info
    if (!station.contractAddress) {
      setTransactionError(
        'This station does not support HBAR contributions yet. Contract address not available.'
      );
      return;
    }

    // Validate contract address
    if (!validateContractAddress(station.contractAddress)) {
      setTransactionError('Invalid contract address format');
      return;
    }

    setIsSubmitting(true);
    setTransactionError(null);

    try {
      // Execute the contribution transaction
      const result = await contributeToStation(
        station.contractAddress as `0x${string}`,
        amountHbar // This represents HBAR amount
      );

      if (result.success) {
        setShowSuccessModal(true);
      } else {
        setTransactionError(result.error || 'Transaction failed');
      }
    } catch (error: unknown) {
      console.error('Contribution error:', error);
      setTransactionError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const handleViewPortfolio = () => {
    if (onSuccess) {
      onSuccess(station, amountHbar, selectedMethod);
    }
    setShowSuccessModal(false);
    onClose();
    router.push('/portfolio');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-[rgba(72,72,72,0.78)] transition-opacity z-50'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='fixed inset-0 z-50 overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center'>
          <div className='relative w-[576px] bg-white rounded-[32px] shadow-xl flex flex-col gap-7'>
            {/* Close button */}
            <button
              onClick={onClose}
              className='absolute right-4 top-4 w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors'
              aria-label='Close funding modal'
            >
              <svg
                width='32'
                height='32'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <circle cx='12' cy='12' r='10' />
                <path d='m15 9-6 6' />
                <path d='m9 9 6 6' />
              </svg>
            </button>

            {/* Header */}
            <div className='pt-10 px-4 pb-0'>
              <h2 className='text-[24px] font-bold text-[#1f1f1f] text-center leading-none'>
                Fund this Station
              </h2>
            </div>

            {/* Content */}
            <div className='flex flex-col gap-6 px-4'>
              {/* Amount Input Section */}
              <div className='flex flex-col gap-[6px]'>
                <div className='flex gap-1 items-center justify-between'>
                  <div className='text-[16px] text-[#1e1e1e]'>
                    Enter amount to pledge
                  </div>
                  <div className='flex gap-[2px] items-center text-[13px]'>
                    <span className='text-[#484848]'>Available HBAR:</span>
                    <span className='text-[16px] text-[#1e1e1e]'>
                      {isConnected && balance
                        ? `${parseFloat(balance.formatted).toFixed(2)}`
                        : 'Connect wallet'}
                    </span>
                  </div>
                </div>

                {/* Amount Display */}
                <div className='border border-[#e4e7ec] rounded-lg px-4 py-[14px] flex flex-col gap-1'>
                  <div className='flex items-center justify-between'>
                    <div className='text-[16px] text-[#1e1e1e] font-semibold'>
                      {formatHbar(amountHbar)}
                    </div>
                    <div className='flex gap-[3px] items-center text-[10px] w-[134px] justify-end'>
                      <span className='text-[#667085]'>Est share:</span>
                      <span className='text-[14px] text-[#1d2439]'>
                        {estimatedShare.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className='text-[14px] text-[#777777]'>
                    ≈ {formatCurrency(amountUsd)} USD
                  </div>
                </div>

                {/* Progress Bar with Slider */}
                <div className='py-[6px] flex flex-col gap-[6px] h-[22px] relative'>
                  <div className='w-full bg-[#f2f4f7] rounded-2xl h-2 overflow-hidden relative'>
                    <div
                      className='bg-[#2b81ff] h-2 rounded-2xl transition-all duration-500 ease-out'
                      style={{ width: `${sliderValue}%` }}
                    />
                    {/* Slider Handle */}
                    <div
                      className='absolute bg-[#2b81ff] w-6 h-6 rounded-full top-[-8px] cursor-pointer flex items-center justify-center'
                      style={{
                        left: `${Math.max(0, Math.min(sliderValue - 4, 96))}%`,
                      }}
                    >
                      <div className='w-[9px] h-[9px] bg-white rounded-full'></div>
                    </div>

                    {/* Hidden range input for functionality */}
                    <input
                      type='range'
                      min='0'
                      max='100'
                      value={sliderValue}
                      onChange={handleSliderChange}
                      className='absolute inset-0 opacity-0 cursor-pointer'
                      aria-label='Funding amount slider'
                    />
                  </div>
                </div>

                {/* APY and Closes info */}
                <div className='flex items-center justify-between'>
                  <div className='bg-[#e7f0ff] px-2 py-1 rounded-[32px]'>
                    <span className='text-[#2b81ff] text-[12px] font-medium'>
                      {station.apy}
                    </span>
                  </div>
                  <div className='text-[14px] text-[#484848]'>
                    Closes in {station.closesIn}
                  </div>
                </div>
              </div>

              {/* Funding Method Section */}
              <div className='flex flex-col gap-3'>
                <div className='text-[16px] font-semibold text-[#1e1e1e]'>
                  Choose Funding method
                </div>

                <div className='flex flex-col gap-[10px]'>
                  {/* HBAR Option - Active */}
                  <div className='border-2 border-[#2b81ff] bg-[#f8faff] rounded-lg px-4 py-[14px] flex items-center gap-3 relative'>
                    {/* Active indicator */}
                    <div className='absolute right-3 top-3'>
                      <svg
                        className='w-5 h-5 text-[#2b81ff]'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='w-6 h-6 bg-black rounded-sm flex items-center justify-center'>
                      <div className='text-white text-[12px] font-bold'>H</div>
                    </div>
                    <div className='flex-1 flex items-center justify-between leading-none pr-8'>
                      <div className='text-[16px] text-[#1e1e1e] font-medium'>
                        HBAR
                      </div>
                      <div className='text-[14px] text-[#2b81ff] font-medium'>
                        MetaMask via Hedera
                      </div>
                    </div>
                  </div>

                  {/* USDC Option - Disabled */}
                  <div className='border border-[#e4e7ec] bg-[#f9f9f9] rounded-lg px-4 py-[14px] flex items-center gap-3 opacity-60 relative'>
                    <div className='w-6 h-6 relative'>
                      {/* USDC Icon placeholder */}
                      <div className='w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center'>
                        <span className='text-white text-[10px]'>U</span>
                      </div>
                    </div>
                    <div className='flex-1 flex items-center justify-between leading-none'>
                      <div className='text-[16px] text-[#1e1e1e]'>USDC</div>
                      <div className='flex items-center gap-2'>
                        <span className='text-[12px] text-[#777777]'>
                          Hedera USDC
                        </span>
                        <span className='bg-[#ffd700] text-[#8b7000] text-[11px] px-2 py-1 rounded-full font-medium'>
                          Coming soon
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fiat Option - Disabled */}
                  <div className='border border-[#e4e7ec] bg-[#f9f9f9] rounded-lg px-4 py-[14px] flex items-center gap-3 opacity-60 relative'>
                    <div className='w-6 h-6 relative'>
                      {/* Fiat Icon placeholder */}
                      <div className='w-6 h-6 bg-green-400 rounded-full flex items-center justify-center'>
                        <span className='text-white text-[10px]'>$</span>
                      </div>
                    </div>
                    <div className='flex-1 flex items-center justify-between leading-none'>
                      <div className='text-[16px] text-[#1e1e1e]'>Fiat</div>
                      <div className='flex items-center gap-2'>
                        <span className='text-[12px] text-[#777777]'>
                          NGN/USD
                        </span>
                        <span className='bg-[#ffd700] text-[#8b7000] text-[11px] px-2 py-1 rounded-full font-medium'>
                          Coming soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {transactionError && (
                <div className='bg-red-50 border border-red-200 rounded-lg px-4 py-3'>
                  <div className='flex'>
                    <div className='flex-shrink-0'>
                      <svg
                        className='h-5 w-5 text-red-400'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm text-red-800'>{transactionError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className='bg-[#f7f7f7] px-4 py-[14px] rounded-lg flex flex-col gap-2'>
                <div className='flex items-center justify-between leading-none'>
                  <span className='text-[14px] text-[#777777]'>Amount</span>
                  <span className='text-[16px] text-[#1e1e1e]'>
                    {formatHbar(amountHbar)} (≈ {formatCurrency(amountUsd)})
                  </span>
                </div>
                <div className='flex items-center justify-between leading-none'>
                  <span className='text-[14px] text-[#777777]'>Est. share</span>
                  <span className='text-[16px] text-[#1e1e1e]'>
                    {estimatedShare.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className='flex gap-1 items-start px-4'>
              <div className='w-[22px] h-[22px] relative flex items-center justify-center'>
                <input
                  type='checkbox'
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className='w-[18px] h-[18px] border-2 border-[#eaeaea] rounded-[2.444px] appearance-none checked:bg-[#2b81ff] checked:border-[#2b81ff] relative'
                  aria-label='I understand this is a utility/governance instrument and not investment advice'
                />
                {agreed && (
                  <svg
                    className='absolute w-3 h-3 text-white pointer-events-none'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </div>
              <div className='flex-1 text-[14px] text-[#777777] leading-normal'>
                I understand this is a utility/governance instrument and not
                investment advice. Availability subject to local laws.
              </div>
            </div>

            {/* Footer */}
            <div className='border-t border-[#e1e1e1] px-10 py-10'>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || amountHbar <= 0 || !agreed}
                className='
                  w-full bg-[#fcc744] hover:bg-[#fcc744]/90
                  text-[#1e1e1e] font-semibold text-[16px]
                  px-6 py-[14px] rounded-lg
                  transition-all duration-200
                  hover:transform hover:-translate-y-0.5
                  focus:outline-none focus:ring-2 focus:ring-[#fcc744]/20
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                '
              >
                {isSubmitting ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-[#1e1e1e] mr-2'></div>
                    Processing...
                  </div>
                ) : (
                  'Fund this station'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        onViewPortfolio={handleViewPortfolio}
      />
    </>
  );
}
