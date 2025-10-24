'use client';

import { useEffect, useState } from 'react';

interface ClientWalletProviderProps {
  children: React.ReactNode;
}

export const ClientWalletProvider: React.FC<ClientWalletProviderProps> = ({
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
