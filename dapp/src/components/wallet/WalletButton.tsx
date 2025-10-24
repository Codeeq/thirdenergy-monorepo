'use client';

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';

interface WalletButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
  showBalance?: boolean;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  className = '',
  variant = 'primary',
  showBalance = false,
}) => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        const baseClassName = `
          font-semibold px-6 py-2 rounded-lg
          transition-all duration-200
          hover:transform hover:-translate-y-0.5
          focus:outline-none focus:ring-2
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:transform-none
        `;

        const variants = {
          primary: `
            bg-primary hover:bg-primary-100 
            text-gray-900
            focus:ring-primary/20
          `,
          secondary: `
            border border-primary bg-transparent 
            text-primary hover:bg-primary hover:text-gray-900
            focus:ring-primary/20
          `,
        };

        const buttonClassName =
          `${baseClassName} ${variants[variant]} ${className}`.trim();

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type='button'
                    className={buttonClassName}
                  >
                    Connect MetaMask
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type='button'
                    className={`${baseClassName} ${variants.secondary} px-4 text-sm bg-red-500 text-white hover:bg-red-600`.trim()}
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className='flex items-center justify-between md:justify-start gap-2'>
                  <div className='flex flex-col text-right'>
                    <div className='text-sm font-medium text-gray-900'>
                      {account.address.substring(0, 6)}...
                      {account.address.substring(account.address.length - 4)}
                    </div>
                    {showBalance && balance && (
                      <div className='text-xs text-gray-600'>
                        {parseFloat(balance.formatted).toFixed(2)}{' '}
                        {balance.symbol}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={openAccountModal}
                    type='button'
                    className={`${baseClassName} ${variants.secondary} px-4 text-sm`.trim()}
                  >
                    Account
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletButton;
