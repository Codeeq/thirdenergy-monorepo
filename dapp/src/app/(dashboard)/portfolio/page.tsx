'use client';

import { useState, useEffect } from 'react';
import PortfolioSummary from './components/PortfolioSummary';
import PortfolioCard from './components/PortfolioCard';
import {
  getPortfolioData,
  getPortfolioSummary,
  PortfolioProject,
} from './actions';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [summary, setSummary] = useState({
    totalClaimable: 236,
    rewards: 18.26,
  });
  const [loading, setLoading] = useState(true);

  // Fetch portfolio data on mount
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      try {
        const [portfolioData, summaryData] = await Promise.all([
          getPortfolioData(),
          getPortfolioSummary(),
        ]);
        setProjects(portfolioData);
        setSummary(summaryData);
      } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  return (
    <div className='bg-white min-h-screen'>
      {/* Portfolio Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Page Title */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-5'>Portfolio</h1>

          {/* Portfolio Summary */}
          <PortfolioSummary
            totalClaimable={summary.totalClaimable}
            rewards={summary.rewards}
            loading={loading}
          />
        </div>

        {/* Portfolio Grid */}
        <div className='mt-8'>
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1260px] mx-auto'>
              {/* Loading skeletons */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className='animate-pulse'>
                  <div className='bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] p-4'>
                    <div className='bg-gray-200 h-56 rounded-xl mb-4'></div>
                    <div className='space-y-3'>
                      <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                      <div className='h-6 bg-gray-200 rounded w-full'></div>
                      <div className='space-y-2'>
                        <div className='h-3 bg-gray-200 rounded w-full'></div>
                        <div className='h-3 bg-gray-200 rounded w-full'></div>
                        <div className='h-3 bg-gray-200 rounded w-full'></div>
                      </div>
                      <div className='flex gap-2'>
                        <div className='h-10 bg-gray-200 rounded flex-1'></div>
                        <div className='h-10 bg-gray-200 rounded flex-1'></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-gray-500 mb-4'>
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
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No portfolio projects
              </h3>
              <p className='text-gray-500'>
                You haven&apos;t invested in any stations yet
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1260px] mx-auto'>
              {projects.map((project) => (
                <PortfolioCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
