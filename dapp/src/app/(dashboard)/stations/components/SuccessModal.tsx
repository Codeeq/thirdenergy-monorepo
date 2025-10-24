'use client';

import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPortfolio?: () => void;
}

export default function SuccessModal({
  isOpen,
  onClose,
  onViewPortfolio,
}: SuccessModalProps) {
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

  if (!isOpen) {
    return null;
  }

  const handleViewPortfolio = () => {
    if (onViewPortfolio) {
      onViewPortfolio();
    }
    onClose();
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
          <div className='relative w-[437px] bg-white rounded-[32px] shadow-xl flex flex-col gap-7 overflow-hidden'>
            {/* Close button */}
            <button
              onClick={onClose}
              className='absolute right-6 top-6 w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors'
              aria-label='Close success modal'
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

            {/* Content */}
            <div className='flex flex-col gap-1 items-center justify-center text-center pt-10 px-4 pb-0'>
              <div className='text-[24px] font-bold text-[#1f1f1f] leading-none'>
                Success
              </div>
              <div className='flex flex-col text-[16px] text-[#1e1e1e] leading-normal'>
                <p className='mb-0'>
                  Transaction submitted to Hedera (simulated).
                </p>
                <p>StationShare minted to your address (simulated).</p>
              </div>
            </div>

            {/* Footer */}
            <div className='border-t border-[#e1e1e1] px-6 py-10'>
              <div className='flex gap-2 items-start justify-center w-full'>
                <button
                  onClick={onClose}
                  className='
                    flex-1 border border-[#fcc744] 
                    text-[#484848] font-semibold text-[16px]
                    px-6 py-[14px] rounded-lg
                    transition-all duration-200
                    hover:bg-[#fcc744]/10
                    focus:outline-none focus:ring-2 focus:ring-[#fcc744]/20
                  '
                >
                  Close
                </button>
                <button
                  onClick={handleViewPortfolio}
                  className='
                    flex-1 bg-[#fcc744] hover:bg-[#fcc744]/90
                    text-[#1e1e1e] font-semibold text-[16px]
                    px-6 py-[14px] rounded-lg
                    transition-all duration-200
                    hover:transform hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-[#fcc744]/20
                  '
                >
                  View portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
