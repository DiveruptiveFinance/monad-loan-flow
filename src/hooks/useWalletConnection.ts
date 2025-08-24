import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface WalletConnection {
  isConnected: boolean;
  address: string | null;
  connectionType: 'none' | 'wallet' | 'email' | 'gmail';
  provider: 'none' | 'metamask' | 'appkit';
}

export const useWalletConnection = () => {
  const { isConnected: appkitConnected, address: appkitAddress } = useAccount();
  const [walletConnection, setWalletConnection] = useState<WalletConnection>({
    isConnected: false,
    address: null,
    connectionType: 'none',
    provider: 'none'
  });

  // Check for traditional wallet connections
  const checkTraditionalWallet = async () => {
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        return null;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        return {
          address: accounts[0],
          provider: 'metamask' as const,
          connectionType: 'wallet' as const
        };
      }
      return null;
    } catch (error) {
      console.log('Error checking traditional wallet:', error);
      return null;
    }
  };

  // Update connection state
  const updateConnectionState = async () => {
    // First check AppKit connection
    if (appkitConnected && appkitAddress) {
      setWalletConnection({
        isConnected: true,
        address: appkitAddress,
        connectionType: 'email', // AppKit primarily handles email connections
        provider: 'appkit'
      });
      return;
    }

    // Then check traditional wallet
    const traditionalWallet = await checkTraditionalWallet();
    if (traditionalWallet) {
      setWalletConnection({
        isConnected: true,
        address: traditionalWallet.address,
        connectionType: traditionalWallet.connectionType,
        provider: traditionalWallet.provider
      });
      return;
    }

    // No connection found
    setWalletConnection({
      isConnected: false,
      address: null,
      connectionType: 'none',
      provider: 'none'
    });
  };

  // Monitor connections
  useEffect(() => {
    updateConnectionState();

    // Set up polling for email connections
    const connectionInterval = setInterval(updateConnectionState, 2000);

    // Listen for traditional wallet events
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      const handleAccountsChanged = () => updateConnectionState();
      const handleConnect = () => updateConnectionState();
      const handleDisconnect = () => updateConnectionState();

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('connect', handleConnect);
      ethereum.on('disconnect', handleDisconnect);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('connect', handleConnect);
        ethereum.removeListener('disconnect', handleDisconnect);
        clearInterval(connectionInterval);
      };
    }

    return () => clearInterval(connectionInterval);
  }, [appkitConnected, appkitAddress]);

  // Manual connection check
  const refreshConnection = async () => {
    await updateConnectionState();
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
    // Expose individual states for backward compatibility
    isWalletConnected: walletConnection.isConnected,
    walletAddress: walletConnection.address
  };
};
