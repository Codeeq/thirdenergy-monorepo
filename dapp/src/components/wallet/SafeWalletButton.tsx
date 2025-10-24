'use client';

import { useEffect, useState } from 'react';

interface WalletButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
  showBalance?: boolean;
}

// Fallback component that shows during SSR
const WalletButtonFallback: React.FC<WalletButtonProps> = ({
  className = '',
  variant = 'primary',
}) => {
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
      bg-[#fcc744] hover:bg-[#e6b33d] 
      text-[#1e1e1e]
      focus:ring-primary/20
    `,
    secondary: `
      border border-[#fcc744] bg-transparent 
      text-[#fcc744] hover:bg-[#fcc744] hover:text-[#1e1e1e]
      focus:ring-primary/20
    `,
  };

  const buttonClassName =
    `${baseClassName} ${variants[variant]} ${className}`.trim();

  return (
    <button disabled className={buttonClassName}>
      Loading...
    </button>
  );
};

const SafeWalletButton: React.FC<WalletButtonProps> = (props) => {
  const [mounted, setMounted] = useState(false);
  const [WalletButtonComponent, setWalletButtonComponent] =
    useState<React.ComponentType<WalletButtonProps> | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const { default: WalletButton } = await import('./WalletButton');
        setWalletButtonComponent(() => WalletButton);
        setMounted(true);
      } catch (error) {
        console.error('Failed to load WalletButton:', error);
        setMounted(true);
      }
    };

    loadComponent();
  }, []);

  if (!mounted || !WalletButtonComponent) {
    return <WalletButtonFallback {...props} />;
  }

  return <WalletButtonComponent {...props} />;
};

export default SafeWalletButton;
