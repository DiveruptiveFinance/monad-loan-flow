import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Loader2, LogOut, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isConnected, address, disconnect } = useWalletConnection();
  const [contractData, setContractData] = useState({
    maxAmountForLoan: '0',
    isVerified: false,
    currentDebt: '0',
    hasLoanRequest: false,
    loanAmount: '0'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('DashboardPage - Wallet connection state:', { isConnected, address });
  }, [isConnected, address]);

  // Fetch contract data
  const fetchContractData = async () => {
    console.log('DashboardPage - Fetching contract data...');
    
    if (!isConnected || !address) {
      console.log('DashboardPage - No wallet connected, skipping fetch');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const userAddress = address;
      console.log('DashboardPage - Fetching data for address:', userAddress);

      // Get maximum amount for loan
      const maxAmountResponse = await fetch('http://localhost:4000/api/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress })
      });

      console.log('DashboardPage - Verification response status:', maxAmountResponse.status);

      if (maxAmountResponse.ok) {
        const result = await maxAmountResponse.json();
        console.log('DashboardPage - Verification result:', result);
        
        setContractData(prev => ({
          ...prev,
          isVerified: result.isVerified,
          maxAmountForLoan: result.isVerified ? '10000000000000000000' : '0' // 10 ETH in wei if verified
        }));
      } else {
        console.error('DashboardPage - Verification request failed:', maxAmountResponse.status);
        setError('Error al verificar usuario');
      }

      // Check localStorage for loan request
      const loanRequest = localStorage.getItem('loanad-loan-request');
      if (loanRequest) {
        const loanData = JSON.parse(loanRequest);
        console.log('DashboardPage - Found loan request:', loanData);
        
        setContractData(prev => ({
          ...prev,
          hasLoanRequest: true,
          loanAmount: loanData.amount || '0'
        }));
      }

    } catch (err) {
      console.error('DashboardPage - Error fetching contract data:', err);
      setError('Error al cargar datos del contrato');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('DashboardPage - useEffect triggered, isConnected:', isConnected, 'address:', address);
    fetchContractData();
  }, [isConnected, address]);

  const handleLogout = async () => {
    try {
      console.log('DashboardPage - Logging out...');
      await disconnect();
      localStorage.removeItem('loanad-verification');
      localStorage.removeItem('loanad-loan-request');
      localStorage.removeItem('loanad-wallet-connected');
      localStorage.removeItem('loanad-wallet-address');
      navigate('/');
    } catch (error) {
      console.error('DashboardPage - Error during logout:', error);
      // Force navigation even if disconnect fails
      localStorage.removeItem('loanad-verification');
      localStorage.removeItem('loanad-loan-request');
      localStorage.removeItem('loanad-wallet-connected');
      localStorage.removeItem('loanad-wallet-address');
      navigate('/');
    }
  };

  // Calculate debt data
  const debtData = {
    total: parseFloat(contractData.maxAmountForLoan) / 1e18, // Convert wei to ETH
    paid: 0,
    remaining: parseFloat(contractData.maxAmountForLoan) / 1e18
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-monad-purple mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando dashboard...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Estado: {isConnected ? 'Conectado' : 'No conectado'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchContractData} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Show not connected state
  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No hay wallet conectada</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Ir al Inicio
          </Button>
        </div>
      </div>
    );
  }

  console.log('DashboardPage - Rendering dashboard with data:', contractData);

  return (
    <div className="min-h-screen bg-background px-4 pt-8 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-montserrat font-bold text-foreground">
            Dashboard
          </h1>
          <Button 
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>

        {/* Wallet Info */}
        <Card className="p-4 bg-card/50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-mono text-muted-foreground">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Loading...'}
            </span>
          </div>
        </Card>

        {/* Verification Status */}
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${contractData.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="font-medium">
              {contractData.isVerified ? 'Usuario Verificado' : 'Usuario No Verificado'}
            </span>
          </div>
        </Card>

        {/* Loan Request Status */}
        {contractData.hasLoanRequest && (
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium">
                Solicitud de Préstamo: {parseFloat(contractData.loanAmount) / 1e18} ETH
              </span>
            </div>
          </Card>
        )}

        {/* Debt Overview */}
        <Card className="p-6">
          <h2 className="text-xl font-montserrat font-bold text-foreground mb-4">
            Resumen de Deuda
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-muted-foreground">Monto total</span>
              </div>
              <span className="font-bold">{debtData.total.toFixed(2)} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span className="text-muted-foreground">Por pagar</span>
              </div>
              <span className="font-bold">{debtData.remaining.toFixed(2)} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-muted-foreground">Pagado</span>
              </div>
              <span className="font-bold">{debtData.paid.toFixed(2)} ETH</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;