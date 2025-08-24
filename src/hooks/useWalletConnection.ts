import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

export interface WalletConnection {
  isConnected: boolean;
  address: string | null;
  connectionType: 'none' | 'wallet' | 'email' | 'gmail';
  provider: 'none' | 'metamask' | 'appkit';
}

export const useWalletConnection = () => {
  const { isConnected, address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const [walletConnection, setWalletConnection] = useState<WalletConnection>({
    isConnected: false,
    address: null,
    connectionType: 'none',
    provider: 'none'
  });

  // Update connection state based on Wagmi
  const updateConnectionState = () => {
    if (isConnected && address) {
      // Determine connection type based on connector
      let connectionType: 'wallet' | 'email' | 'gmail' = 'wallet';
      let provider: 'metamask' | 'appkit' = 'metamask';

      if (connector) {
        const connectorName = connector.name.toLowerCase();
        if (connectorName.includes('appkit') || connectorName.includes('reown')) {
          provider = 'appkit';
          // AppKit primarily handles email connections
          connectionType = 'email';
        } else if (connectorName.includes('metamask') || connectorName.includes('injected')) {
          provider = 'metamask';
          connectionType = 'wallet';
        }
      }

      setWalletConnection({
        isConnected: true,
        address: address,
        connectionType,
        provider
      });
    } else {
      setWalletConnection({
        isConnected: false,
        address: null,
        connectionType: 'none',
        provider: 'none'
      });
    }
  };

  // Monitor connections
  useEffect(() => {
    updateConnectionState();
  }, [isConnected, address, connector]);

  // Manual connection check
  const refreshConnection = async () => {
    updateConnectionState();
  };

  // Get connection info
  const getConnectionInfo = () => {
    if (!walletConnection.isConnected) {
      return {
        status: 'disconnected',
        message: 'No wallet connected',
        action: 'Connect your wallet or email'
      };
    }

    switch (walletConnection.connectionType) {
      case 'email':
        return {
          status: 'connected',
          message: `Connected via email: ${walletConnection.address?.slice(0, 6)}...${walletConnection.address?.slice(-4)}`,
          action: 'Ready to verify'
        };
      case 'wallet':
        return {
          status: 'connected',
          message: `Connected via wallet: ${walletConnection.address?.slice(0, 6)}...${walletConnection.address?.slice(-4)}`,
          action: 'Ready to verify'
        };
      default:
        return {
          status: 'unknown',
          message: 'Unknown connection type',
          action: 'Please reconnect'
        };
    }
  };

  return {
    ...walletConnection,
    refreshConnection,
    getConnectionInfo,
    disconnect,
    // Expose individual states for backward compatibility
    isWalletConnected: walletConnection.isConnected,
    walletAddress: walletConnection.address
  };
};
