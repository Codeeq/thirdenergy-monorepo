interface PortfolioSummaryProps {
  totalClaimable: number;
  rewards: number;
  loading?: boolean;
}

export default function PortfolioSummary({
  totalClaimable,
  rewards,
  loading = false,
}: PortfolioSummaryProps) {
  const handleClaimAll = async () => {
    // Handle claim all functionality
    console.log('Claiming all rewards...');
  };

  if (loading) {
    return (
      <div className='bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] p-4 w-full max-w-[1262px] mx-auto'>
        <div className='flex items-center justify-center gap-4 animate-pulse'>
          <div className='flex-1 space-y-1'>
            <div className='h-3 bg-gray-200 rounded w-24'></div>
            <div className='h-6 bg-gray-200 rounded w-16'></div>
          </div>
          <div className='flex-1 space-y-1'>
            <div className='h-3 bg-gray-200 rounded w-16'></div>
            <div className='h-6 bg-gray-200 rounded w-28'></div>
          </div>
          <div className='h-12 bg-gray-200 rounded w-28'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] p-4 w-full max-w-[1262px] mx-auto'>
      <div className='flex items-center justify-center gap-4'>
        {/* Total Claimable */}
        <div className='flex-1 flex flex-col items-start gap-1'>
          <div className='flex items-center gap-0.5'>
            <span className='text-[#5a5a5a] text-[10px] font-normal leading-none'>
              Total Claimable
            </span>
          </div>
          <div className='text-[#1f1f1f] text-2xl font-bold leading-none'>
            ${totalClaimable}
          </div>
        </div>

        {/* Rewards */}
        <div className='flex-1 flex flex-col items-start gap-1'>
          <div className='flex items-center gap-0.5'>
            <span className='text-[#5a5a5a] text-[10px] font-normal leading-none'>
              Rewards
            </span>
          </div>
          <div className='text-[#1f1f1f] text-2xl font-bold leading-none'>
            {rewards} $<span className='uppercase'>ENERGY</span>
          </div>
        </div>

        {/* Claim All Button */}
        <div className='flex items-stretch'>
          <button
            onClick={handleClaimAll}
            className='bg-[#fcc744] hover:bg-[#fcc744]/90 text-[#1e1e1e] font-semibold text-base px-6 py-3.5 rounded-lg transition-all duration-200 hover:transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#fcc744]/20 min-w-[117px]'
          >
            Claim all
          </button>
        </div>
      </div>
    </div>
  );
}
