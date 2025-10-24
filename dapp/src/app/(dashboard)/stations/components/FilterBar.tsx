'use client';

import { useState, useTransition, useRef, useEffect } from 'react';

interface FilterBarProps {
  onFiltersChange: (filters: {
    search?: string;
    region?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
  }) => void;
  regions: string[];
  statuses: string[];
  priorities: string[];
  sortOptions: Array<{ value: string; label: string }>;
  initialFilters?: {
    search: string;
    region: string;
    status: string;
    priority: string;
    sortBy: string;
  };
}

export default function FilterBar({
  onFiltersChange,
  regions,
  statuses,
  priorities,
  sortOptions,
  initialFilters,
}: FilterBarProps) {
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [region, setRegion] = useState(initialFilters?.region || 'all');
  const [status, setStatus] = useState(initialFilters?.status || 'all');
  const [priority, setPriority] = useState(initialFilters?.priority || 'all');
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || 'latest');
  const [isPending, startTransition] = useTransition();
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (
    newFilters: Partial<{
      search: string;
      region: string;
      status: string;
      priority: string;
      sortBy: string;
    }>
  ) => {
    const updatedFilters = {
      search,
      region,
      status,
      priority,
      sortBy,
      ...newFilters,
    };

    // Update local state
    if (newFilters.search !== undefined) setSearch(newFilters.search);
    if (newFilters.region !== undefined) setRegion(newFilters.region);
    if (newFilters.status !== undefined) setStatus(newFilters.status);
    if (newFilters.priority !== undefined) setPriority(newFilters.priority);
    if (newFilters.sortBy !== undefined) setSortBy(newFilters.sortBy);

    // Trigger parent update with transition
    startTransition(() => {
      onFiltersChange({
        search: updatedFilters.search || undefined,
        region:
          updatedFilters.region !== 'all' ? updatedFilters.region : undefined,
        status:
          updatedFilters.status !== 'all'
            ? mapStatusToServerValue(updatedFilters.status)
            : undefined,
        priority:
          updatedFilters.priority !== 'all'
            ? updatedFilters.priority.toLowerCase()
            : undefined,
        sortBy:
          updatedFilters.sortBy !== 'latest'
            ? updatedFilters.sortBy
            : undefined,
      });
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Map display status to server status values
  const mapStatusToServerValue = (displayStatus: string) => {
    switch (displayStatus.toLowerCase()) {
      case 'open':
        return 'open';
      case 'operational':
        return 'operational';
      case 'closing soon':
        return 'closing';
      case 'under development':
        return 'development';
      default:
        return displayStatus.toLowerCase();
    }
  };

  return (
    <div className='bg-white pt-[60px] pb-8'>
      <div className='flex flex-col gap-8 items-center relative w-full'>
        {/* Page Title */}
        <h1 className='text-2xl md:text-4xl lg:text-[44px] font-bold text-[#1e1e1e] text-center leading-none px-4'>
          Fund a Station
        </h1>

        {/* Search & Filter Container */}
        <div className='border-t border-b border-[#f4f4f4] w-full relative'>
          <div className='px-4 md:px-8 lg:px-[108px] py-[14px] w-full max-w-[1440px] mx-auto'>
            {/* Mobile & Tablet Layout */}
            <div className='flex items-center gap-4 lg:hidden'>
              {/* Search Input */}
              <div className='flex-1 bg-[#f7f7f7] border border-[#f4f4f4] rounded-lg px-4 py-3 flex gap-2 items-center'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#484848'
                  strokeWidth='2'
                >
                  <circle cx='11' cy='11' r='8' />
                  <path d='m21 21-4.35-4.35' />
                </svg>
                <input
                  type='text'
                  placeholder='Search by name or location'
                  value={search}
                  onChange={(e) =>
                    handleFilterChange({ search: e.target.value })
                  }
                  className='flex-1 bg-transparent text-[14px] text-[#484848] placeholder-[#484848] outline-none tracking-[-0.5px]'
                />
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className='bg-white border border-[#f4f4f4] rounded-lg px-4 py-3 flex gap-2 items-center text-[14px] text-[#484848] cursor-pointer hover:bg-gray-50 transition-colors'
                aria-label='Toggle filters'
              >
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#484848'
                  strokeWidth='2'
                >
                  <path d='M3 6h18' />
                  <path d='M7 12h10' />
                  <path d='M10 18h4' />
                </svg>
                <span>Filter</span>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='#484848'
                  className={`transform transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
                </svg>
              </button>
            </div>

            {/* Desktop Layout */}
            <div className='hidden lg:flex gap-[18px] items-center w-full max-w-[1113px] mx-auto'>
              {/* Search Input */}
              <div className='flex-1 bg-[#f7f7f7] border border-[#f4f4f4] rounded-lg px-[18px] py-[13px] flex gap-2 items-center'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#484848'
                  strokeWidth='2'
                >
                  <circle cx='11' cy='11' r='8' />
                  <path d='m21 21-4.35-4.35' />
                </svg>
                <input
                  type='text'
                  placeholder='Search by name or location'
                  value={search}
                  onChange={(e) =>
                    handleFilterChange({ search: e.target.value })
                  }
                  className='flex-1 bg-transparent text-[14px] text-[#484848] placeholder-[#484848] outline-none tracking-[-0.5px]'
                />
              </div>

              {/* Filter Buttons */}
              <div className='flex gap-3 items-center'>
                {/* Region Filter */}
                <div className='relative'>
                  <select
                    value={region}
                    onChange={(e) =>
                      handleFilterChange({ region: e.target.value })
                    }
                    aria-label='Filter by region'
                    className='appearance-none bg-white border border-[#f4f4f4] rounded-lg px-[18px] py-[13px] pr-10 pl-12 text-[14px] text-[#484848] cursor-pointer hover:bg-gray-50 transition-colors'
                  >
                    {regions.map((regionOption) => (
                      <option
                        key={regionOption}
                        value={
                          regionOption === 'All Regions' ? 'all' : regionOption
                        }
                      >
                        {regionOption}
                      </option>
                    ))}
                  </select>
                  <div className='absolute left-[18px] top-1/2 transform -translate-y-1/2 pointer-events-none'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='#484848'
                      strokeWidth='2'
                    >
                      <circle cx='12' cy='12' r='10' />
                      <path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' />
                      <path d='M2 12h20' />
                    </svg>
                  </div>
                  <div className='absolute right-[18px] top-1/2 transform -translate-y-1/2 pointer-events-none'>
                    <svg
                      width='18'
                      height='18'
                      viewBox='0 0 24 24'
                      fill='#484848'
                    >
                      <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
                    </svg>
                  </div>
                </div>

                {/* Status Filter */}
                <div className='relative'>
                  <select
                    value={status}
                    onChange={(e) =>
                      handleFilterChange({ status: e.target.value })
                    }
                    aria-label='Filter by status'
                    className='appearance-none bg-white border border-[#f4f4f4] rounded-lg px-[18px] py-[13px] pr-10 pl-12 text-[14px] text-[#484848] cursor-pointer hover:bg-gray-50 transition-colors'
                  >
                    {statuses.map((statusOption) => (
                      <option
                        key={statusOption}
                        value={statusOption === 'All' ? 'all' : statusOption}
                      >
                        {statusOption === 'All' ? 'Status' : statusOption}
                      </option>
                    ))}
                  </select>
                  <div className='absolute left-[18px] top-1/2 transform -translate-y-1/2 pointer-events-none'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='#484848'
                      strokeWidth='2'
                    >
                      <path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' />
                      <polyline points='14,2 14,8 20,8' />
                    </svg>
                  </div>
                  <div className='absolute right-[18px] top-1/2 transform -translate-y-1/2 pointer-events-none'>
                    <svg
                      width='18'
                      height='18'
                      viewBox='0 0 24 24'
                      fill='#484848'
                    >
                      <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
                    </svg>
                  </div>
                </div>

                {/* Priority Filter */}
                <div className='relative'>
                  <select
                    value={priority}
                    onChange={(e) =>
                      handleFilterChange({ priority: e.target.value })
                    }
                    aria-label='Filter by priority'
                    className='appearance-none bg-white border border-[#f4f4f4] rounded-lg px-[18px] py-[13px] pr-10 pl-12 text-[14px] text-[#484848] cursor-pointer hover:bg-gray-50 transition-colors'
                  >
                    {priorities.map((priorityOption) => (
                      <option
                        key={priorityOption}
                        value={
                          priorityOption === 'All' ? 'all' : priorityOption
                        }
                      >
                        {priorityOption === 'All' ? 'All' : priorityOption}
                      </option>
                    ))}
                  </select>
                  <div className='absolute left-[18px] top-1/2 transform -translate-y-1/2 pointer-events-none'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='#484848'
                      strokeWidth='2'
                    >
                      <polyline points='22,12 18,12 15,21 9,3 6,12 2,12' />
                    </svg>
                  </div>
                  <div className='absolute right-[18px] top-1/2 transform -translate-y-1/2 pointer-events-none'>
                    <svg
                      width='18'
                      height='18'
                      viewBox='0 0 24 24'
                      fill='#484848'
                    >
                      <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
                    </svg>
                  </div>
                </div>

                {/* Sort Filter */}
                <div className='relative'>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      handleFilterChange({ sortBy: e.target.value })
                    }
                    aria-label='Sort stations'
                    className='appearance-none bg-white border border-[#f4f4f4] rounded-lg px-[18px] py-[13px] pr-10 pl-12 text-[14px] text-[#484848] cursor-pointer hover:bg-gray-50 transition-colors'
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        Sort by {option.label}
                      </option>
                    ))}
                  </select>
                  <div className='absolute left-[18px] top-1/2 transform -translate-y-1/2 pointer-events-none'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='#484848'
                      strokeWidth='2'
                    >
                      <path d='M3 6h18' />
                      <path d='M7 12h10' />
                      <path d='M10 18h4' />
                    </svg>
                  </div>
                  <div className='absolute right-[18px] top-1/2 transform -translate-y-1/2 pointer-events-none'>
                    <svg
                      width='18'
                      height='18'
                      viewBox='0 0 24 24'
                      fill='#484848'
                    >
                      <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filter Dropdown */}
            {isFilterDropdownOpen && (
              <div
                ref={dropdownRef}
                className='lg:hidden absolute top-full left-0 right-0 bg-white border-t border-[#f4f4f4] z-10 shadow-lg'
              >
                <div className='px-4 md:px-8 py-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    {/* Region Filter */}
                    <div className='relative'>
                      <select
                        value={region}
                        onChange={(e) =>
                          handleFilterChange({ region: e.target.value })
                        }
                        aria-label='Filter by region'
                        className='w-full appearance-none bg-white border border-[#f4f4f4] rounded-lg px-4 py-3 pr-10 pl-12 text-[14px] text-[#484848] cursor-pointer hover:bg-gray-50 transition-colors'
                      >
                        {regions.map((regionOption) => (
                          <option
                            key={regionOption}
                            value={
                              regionOption === 'All Regions'
                                ? 'all'
                                : regionOption
                            }
                          >
                            {regionOption}
                          </option>
                        ))}
                      </select>
                      <div className='absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='#484848'
                          strokeWidth='2'
                        >
                          <circle cx='12' cy='12' r='10' />
                          <path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' />
                          <path d='M2 12h20' />
                        </svg>
                      </div>
                      <div className='absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='#484848'
                        >
                          <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
                        </svg>
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className='relative'>
                      <select
                        value={status}
                        onChange={(e) =>
                          handleFilterChange({ status: e.target.value })
                        }
                        aria-label='Filter by status'
                        className='w-full appearance-none bg-white border border-[#f4f4f4] rounded-lg px-4 py-3 pr-10 pl-12 text-[14px] text-[#484848] cursor-pointer hover:bg-gray-50 transition-colors'
                      >
                        {statuses.map((statusOption) => (
                          <option
                            key={statusOption}
                            value={
                              statusOption === 'All' ? 'all' : statusOption
                            }
                          >
                            {statusOption === 'All' ? 'Status' : statusOption}
                          </option>
                        ))}
                      </select>
                      <div className='absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='#484848'
                          strokeWidth='2'
                        >
                          <path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' />
                          <polyline points='14,2 14,8 20,8' />
                        </svg>
                      </div>
                      <div className='absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='#484848'
                        >
                          <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
                        </svg>
                      </div>
                    </div>

                    {/* Priority Filter */}
                    <div className='relative'>
                      <select
                        value={priority}
                        onChange={(e) =>
                          handleFilterChange({ priority: e.target.value })
                        }
                        aria-label='Filter by priority'
                        className='w-full appearance-none bg-white border border-[#f4f4f4] rounded-lg px-4 py-3 pr-10 pl-12 text-[14px] text-[#484848] cursor-pointer hover:bg-gray-50 transition-colors'
                      >
                        {priorities.map((priorityOption) => (
                          <option
                            key={priorityOption}
                            value={
                              priorityOption === 'All' ? 'all' : priorityOption
                            }
                          >
                            {priorityOption === 'All' ? 'All' : priorityOption}
                          </option>
                        ))}
                      </select>
                      <div className='absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='#484848'
                          strokeWidth='2'
                        >
                          <polyline points='22,12 18,12 15,21 9,3 6,12 2,12' />
                        </svg>
                      </div>
                      <div className='absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='#484848'
                        >
                          <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
                        </svg>
                      </div>
                    </div>

                    {/* Sort Filter */}
                    <div className='relative'>
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          handleFilterChange({ sortBy: e.target.value })
                        }
                        aria-label='Sort stations'
                        className='w-full appearance-none bg-white border border-[#f4f4f4] rounded-lg px-4 py-3 pr-10 pl-12 text-[14px] text-[#484848] cursor-pointer hover:bg-gray-50 transition-colors'
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            Sort by {option.label}
                          </option>
                        ))}
                      </select>
                      <div className='absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='#484848'
                          strokeWidth='2'
                        >
                          <path d='M3 6h18' />
                          <path d='M7 12h10' />
                          <path d='M10 18h4' />
                        </svg>
                      </div>
                      <div className='absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='#484848'
                        >
                          <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading indicator */}
        {isPending && (
          <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
          </div>
        )}
      </div>
    </div>
  );
}
