import { useState } from 'react';
import { PortfolioProject, claimEarnings, claimEnergy } from '../actions';
import MapEmbed from '../../../../components/MapEmbed';

interface PortfolioCardProps {
  project: PortfolioProject;
}

export default function PortfolioCard({ project }: PortfolioCardProps) {
  const [isClaimingEarnings, setIsClaimingEarnings] = useState(false);
  const [isClaimingEnergy, setIsClaimingEnergy] = useState(false);

  const handleClaimEarnings = async () => {
    setIsClaimingEarnings(true);
    try {
      const result = await claimEarnings(project.id);
      console.log(result.message);
    } catch (error) {
      console.error('Failed to claim earnings:', error);
    } finally {
      setIsClaimingEarnings(false);
    }
  };

  const handleClaimEnergy = async () => {
    setIsClaimingEnergy(true);
    try {
      const result = await claimEnergy(project.id);
      console.log(result.message);
    } catch (error) {
      console.error('Failed to claim $ENERGY:', error);
    } finally {
      setIsClaimingEnergy(false);
    }
  };

  const getStatusBadgeStyles = () => {
    switch (project.status) {
      case 'operational':
        return 'bg-[rgba(252,199,68,0.17)] text-[#cb940a]';
      case 'under_development':
        return 'bg-[#e1e1e1] text-[#1e1e1e]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (project.status) {
      case 'operational':
        return 'Operational';
      case 'under_development':
        return 'Under development';
      default:
        return project.status;
    }
  };

  const isUnderDevelopment = project.status === 'under_development';

  return (
    <div className='bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] p-4 overflow-hidden'>
      {/* Project Map */}
      <div className='mb-4'>
        <MapEmbed
          latitude={project.latitude}
          longitude={project.longitude}
          title={project.title}
          className='h-[226px] rounded-xl'
        />
      </div>

      {/* Project Info */}
      <div className='space-y-3.5'>
        {/* Title and Status */}
        <div className='flex items-start justify-between gap-1'>
          <div className='flex-1 space-y-1'>
            {/* Location */}
            <div className='flex items-center gap-2 text-[10px] text-[#5a5a5a]'>
              <span>{project.location}</span>
              <span>•</span>
              <span>{project.region}</span>
            </div>
            {/* Project Title */}
            <h3 className='text-[#1f1f1f] text-2xl font-bold leading-normal'>
              {project.title}
            </h3>
          </div>

          {/* Status Badge */}
          <div className={`px-2 py-1 rounded-full ${getStatusBadgeStyles()}`}>
            <span className='text-xs font-medium'>{getStatusText()}</span>
          </div>
        </div>

        {/* Stats */}
        <div className='bg-[#f8f8f8] rounded-xl p-4 space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-[#484848] text-xs'>Share</span>
            <span className='text-[#1e1e1e] text-sm font-medium'>
              {project.sharePercentage}%
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-[#484848] text-xs'>Claimable</span>
            <span className='text-[#1e1e1e] text-sm font-medium'>
              ${project.claimableAmount}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-[#484848] text-xs'>APY to date</span>
            <span className='text-[#1e1e1e] text-sm font-medium'>
              {project.apy}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-2 ${isUnderDevelopment ? 'opacity-50' : ''}`}>
          <button
            onClick={handleClaimEnergy}
            disabled={isClaimingEnergy || isUnderDevelopment}
            className='flex-1 border border-[#e8e8e8] text-[#1e1e1e] font-normal text-base px-6 py-1.5 rounded-lg transition-all duration-200 hover:bg-gray-25 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed'
          >
            {isClaimingEnergy ? 'Claiming...' : 'Claim $ENERGY'}
          </button>
          <button
            onClick={handleClaimEarnings}
            disabled={isClaimingEarnings || isUnderDevelopment}
            className='flex-1 bg-[#fcc744] hover:bg-[#fcc744]/90 text-[#1e1e1e] font-semibold text-base px-6 py-3.5 rounded-lg transition-all duration-200 hover:transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#fcc744]/20 disabled:cursor-not-allowed disabled:transform-none'
          >
            {isClaimingEarnings ? 'Claiming...' : 'Claim earnings'}
          </button>
        </div>
      </div>
    </div>
  );
}
