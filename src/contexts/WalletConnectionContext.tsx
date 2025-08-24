import React, { createContext, useContext, ReactNode } from 'react';
import { useWalletConnection, WalletConnection } from '../hooks/useWalletConnection';

interface WalletConnectionContextType {
  isConnected: boolean;
  address: string | null;
  connectionType: 'none' | 'wallet' | 'email' | 'gmail';
  provider: 'none' | 'metamask' | 'appkit';
  isWalletConnected: boolean;
  walletAddress: string | null;
  refreshConnection: () => Promise<void>;
  getConnectionInfo: () => {
    status: string;
    message: string;
    action: string;
  };
}

const WalletConnectionContext = createContext<WalletConnectionContextType | undefined>(undefined);

export const useWalletConnectionContext = () => {
  const context = useContext(WalletConnectionContext);
  if (context === undefined) {
    throw new Error('useWalletConnectionContext must be used within a WalletConnectionProvider');
  }
  return context;
};

interface WalletConnectionProviderProps {
  children: ReactNode;
}

export const WalletConnectionProvider: React.FC<WalletConnectionProviderProps> = ({ children }) => {
  const walletConnection = useWalletConnection();

  return (
    <WalletConnectionContext.Provider value={walletConnection}>
      {children}
    </WalletConnectionContext.Provider>
  );
};
