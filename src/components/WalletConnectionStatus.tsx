import React from 'react';
import { Button } from '@/components/ui/button';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { RefreshCw, Wallet, Mail, AlertCircle } from 'lucide-react';

export const WalletConnectionStatus: React.FC = () => {
  const { 
    isConnected, 
    connectionType, 
    provider, 
    address, 
    refreshConnection,
    getConnectionInfo 
  } = useWalletConnection();

  const connectionInfo = getConnectionInfo();

  if (!isConnected) {
    return (
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            {connectionInfo.message}
          </span>
        </div>
      </div>
    );
  }

  const getConnectionIcon = () => {
    switch (connectionType) {
      case 'email':
        return <Mail className="h-4 w-4 text-green-600" />;
      case 'wallet':
        return <Wallet className="h-4 w-4 text-blue-600" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-600" />;
    }
  };

  const getConnectionLabel = () => {
    switch (connectionType) {
      case 'email':
        return 'Email';
      case 'wallet':
        return 'Wallet';
      default:
        return 'Unknown';
    }
  };

  const getProviderLabel = () => {
    switch (provider) {
      case 'appkit':
        return 'Reown AppKit';
      case 'metamask':
        return 'MetaMask';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getConnectionIcon()}
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-green-800">
                {getConnectionLabel()} Connected
              </span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                {getProviderLabel()}
              </span>
            </div>
            <div className="text-xs text-green-700 font-mono">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Loading...'}
            </div>
          </div>
        </div>
        <Button
          onClick={refreshConnection}
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-800 hover:bg-green-100"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WalletConnectionStatus;
