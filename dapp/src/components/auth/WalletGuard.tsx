'use client';

import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import WalletButton from '@/components/wallet/WalletButton';

interface WalletGuardProps {
  children: ReactNode;
  redirectTo?: string;
  showConnectPrompt?: boolean;
}

const WalletGuard: React.FC<WalletGuardProps> = ({
  children,
  redirectTo = '/',
  showConnectPrompt = true,
}) => {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // If user is not connected and we don't want to show connect prompt,
    // redirect them away from protected pages
    if (!isConnected && !isConnecting && !showConnectPrompt) {
      router.push(redirectTo);
    }
  }, [isConnected, isConnecting, showConnectPrompt, redirectTo, router]);

  // If connecting, show loading state
  if (isConnecting) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  // If not connected and we want to show connect prompt
  if (!isConnected && showConnectPrompt) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Wallet Required
            </h2>
            <p className='text-gray-600'>
              Please connect your MetaMask wallet to access this page.
            </p>
          </div>

          <div className='mb-6'>
            <WalletButton />
          </div>

          <div className='text-sm text-gray-500'>
            <p>
              Don&apos;t have MetaMask?{' '}
              <a
                href='https://metamask.io/download/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary hover:text-primary-100 underline'
              >
                Download it here
              </a>
            </p>
          </div>

          <div className='mt-6'>
            <button
              onClick={() => router.push(redirectTo)}
              className='text-sm text-gray-500 hover:text-gray-700 underline'
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If connected, render protected content
  return <>{children}</>;
};

export default WalletGuard;
