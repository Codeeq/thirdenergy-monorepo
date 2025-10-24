'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface WalletButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
  showBalance?: boolean;
}

const DynamicWalletButton = dynamic(() => import('./WalletButton'), {
  ssr: false,
  loading: () => (
    <div className='bg-[#fcc744] text-[#1e1e1e] px-6 py-2 rounded-lg font-semibold animate-pulse'>
      Loading...
    </div>
  ),
}) as ComponentType<WalletButtonProps>;

export default DynamicWalletButton;
