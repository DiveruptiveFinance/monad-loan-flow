import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { 
  Loader2, 
  LogOut, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  Shield, 
  CreditCard,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isConnected, address, disconnect } = useWalletConnection();
  const [contractData, setContractData] = useState({
    maxAmountForLoan: '0',
    isVerified: false,
    currentDebt: '0',
    hasLoanRequest: false,
    loanAmount: '0',
    totalLoans: '0',
    activeLoanIds: [],
    userLoanId: null,
    userLoanCollateral: '0',
    userDebt: '0'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isRepaying, setIsRepaying] = useState(false);
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('DashboardPage - Wallet connection state:', { isConnected, address });
  }, [isConnected, address]);

  // Fetch contract data using smart contract getter functions
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

      // Get verification status using getVerifiedUser(address) -> 0xd117fc99
      const verificationResponse = await fetch('http://localhost:4000/api/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress })
      });

      if (verificationResponse.ok) {
        const verificationResult = await verificationResponse.json();
        console.log('DashboardPage - Verification result:', verificationResult);
        
        // Get maximum amount for loan using getMaximumAmountForLoan(address) -> 0xe3fede90
        let maxAmount = '0';
        if (verificationResult.isVerified) {
          try {
            const maxAmountResponse = await fetch('http://localhost:4000/api/get-max-amount', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userAddress })
            });
            
            if (maxAmountResponse.ok) {
              const maxAmountResult = await maxAmountResponse.json();
              maxAmount = maxAmountResult.maxAmount || '0';
            }
          } catch (err) {
            console.log('Could not fetch max amount, using default');
            maxAmount = '10000000000000000000'; // 10 MON in wei
          }
        }

        // Get total loans using getTotalLoans() -> 0x833be5d5
        let totalLoans = '0';
        try {
          const totalLoansResponse = await fetch('http://localhost:4000/api/get-total-loans');
          if (totalLoansResponse.ok) {
            const totalLoansResult = await totalLoansResponse.json();
            totalLoans = totalLoansResult.totalLoans || '0';
          }
        } catch (err) {
          console.log('Could not fetch total loans');
        }

        // Get active loan IDs using getActiveLoanIds() -> 0xcb476b6b
        let activeLoanIds = [];
        try {
          const activeLoansResponse = await fetch('http://localhost:4000/api/get-active-loan-ids');
          if (activeLoansResponse.ok) {
            const activeLoansResult = await activeLoansResponse.json();
            activeLoanIds = activeLoansResult.activeLoanIds || [];
          }
        } catch (err) {
          console.log('Could not fetch active loan IDs');
        }

        // Find user's loan if they have one
        let userLoanId = null;
        let userLoanCollateral = '0';
        let userDebt = '0';
        if (activeLoanIds.length > 0) {
          for (const loanId of activeLoanIds) {
            try {
              // Get loan borrower using getLoanBorrower(uint256) -> 0x3ef0a2f7
              const borrowerResponse = await fetch('http://localhost:4000/api/get-loan-borrower', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loanId })
              });
              
              if (borrowerResponse.ok) {
                const borrowerResult = await borrowerResponse.json();
                if (borrowerResult.borrower.toLowerCase() === userAddress.toLowerCase()) {
                  userLoanId = loanId;
                  
                  // Get loan collateral using getLoanCollateral(uint256) -> 0x010d5730
                  const collateralResponse = await fetch('http://localhost:4000/api/get-loan-collateral', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ loanId })
                  });
                  
                  if (collateralResponse.ok) {
                    const collateralResult = await collateralResponse.json();
                    userLoanCollateral = collateralResult.collateral || '0';
                  }
                  
                  // Get user debt using s_debtorBorrowed(address) -> 0x6b9e1d93
                  try {
                    const debtResponse = await fetch(`http://localhost:4000/api/get-user-debt/${userAddress}`);
                    if (debtResponse.ok) {
                      const debtResult = await debtResponse.json();
                      userDebt = debtResult.userDebt || '0';
                    }
                  } catch (err) {
                    console.log('Could not fetch user debt, using default');
                    userDebt = '0';
                  }
                  
                  break;
                }
              }
            } catch (err) {
              console.log(`Could not fetch loan ${loanId} details`);
            }
          }
        }

        setContractData({
          isVerified: verificationResult.isVerified,
          maxAmountForLoan: maxAmount,
          currentDebt: userLoanCollateral,
          hasLoanRequest: !!userLoanId,
          loanAmount: userLoanCollateral,
          totalLoans: totalLoans,
          activeLoanIds: activeLoanIds,
          userLoanId: userLoanId,
          userLoanCollateral: userLoanCollateral,
          userDebt: userDebt
        });
      } else {
        console.error('DashboardPage - Verification request failed:', verificationResponse.status);
        setError('Error al verificar usuario');
      }

    } catch (err) {
      console.error('DashboardPage - Error fetching contract data:', err);
      setError('Error al cargar datos del contrato');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchContractData();
    setIsRefreshing(false);
  };

  // Handle borrow MON
  const handleBorrow = async () => {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      alert('Por favor ingresa una cantidad válida para pedir prestado');
      return;
    }

    const confirmBorrow = window.confirm(
      `¿Estás seguro de que quieres pedir prestado ${borrowAmount} MON?\n\nEsta acción aumentará tu deuda.`
    );

    if (!confirmBorrow) {
      return;
    }

    setIsWithdrawing(true);
    try {
      // Convert MON amount to wei
      const amountInWei = (parseFloat(borrowAmount) * 1e18).toString();
      
      const response = await fetch('http://localhost:4000/api/borrow-mon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: amountInWei // Amount to borrow
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ MON pedido prestado exitosamente!\n\nHash de transacción: ${result.txHash}\n\nTu deuda ha sido aumentada.`);
              // Clear input and refresh data after successful borrow
      setBorrowAmount('');
        await fetchContractData();
      } else {
        const error = await response.json();
        alert(`❌ Error al pedir prestado: ${error.error}`);
      }
    } catch (error) {
      console.error('Error borrowing MON:', error);
      alert('❌ Error al pedir prestado. Por favor, intenta de nuevo.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Handle repay MON
  const handleRepay = async () => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      alert('Por favor ingresa una cantidad válida para pagar');
      return;
    }

    const confirmRepay = window.confirm(
      `¿Estás seguro de que quieres pagar ${repayAmount} MON?\n\nEsta acción reducirá tu deuda pendiente.`
    );

    if (!confirmRepay) {
      return;
    }

    setIsRepaying(true);
    try {
      // Convert MON amount to wei
      const amountInWei = (parseFloat(repayAmount) * 1e18).toString();
      
      const response = await fetch('http://localhost:4000/api/repay-mon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userAddress: address,
          amount: amountInWei
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ MON pagado exitosamente!\n\nHash de transacción: ${result.txHash}\n\nTu deuda ha sido reducida.`);
        // Clear input and refresh data after successful repayment
        setRepayAmount('');
        await fetchContractData();
      } else {
        const error = await response.json();
        alert(`❌ Error al pagar MON: ${error.error}`);
      }
    } catch (error) {
      console.error('Error repaying MON:', error);
      alert('❌ Error al pagar MON. Por favor, intenta de nuevo.');
    } finally {
      setIsRepaying(false);
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
    total: parseFloat(contractData.maxAmountForLoan) / 1e18, // Convert wei to MON
    paid: parseFloat(contractData.currentDebt) / 1e18,
    remaining: (parseFloat(contractData.maxAmountForLoan) - parseFloat(contractData.currentDebt)) / 1e18,
    debt: parseFloat(contractData.userDebt) / 1e18 // Convert wei to MON
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-monad-purple mx-auto mb-6" />
            <div className="absolute inset-0 rounded-full border-4 border-monad-purple/20"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Cargando Dashboard</h2>
          <p className="text-gray-600">
            Estado: {isConnected ? 'Conectado' : 'No conectado'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="space-x-3">
            <Button onClick={fetchContractData} variant="outline" className="border-red-300">
              Reintentar
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              Ir al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show not connected state
  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No hay Wallet Conectada</h2>
          <p className="text-gray-600 mb-6">Conecta tu wallet para ver tu dashboard</p>
          <Button onClick={() => navigate('/')} variant="outline" className="border-gray-300">
            Ir al Inicio
          </Button>
        </div>
      </div>
    );
  }

  console.log('DashboardPage - Rendering dashboard with data:', contractData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 pt-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-monad-purple/10 rounded-xl">
              <BarChart3 className="h-8 w-8 text-monad-purple" />
            </div>
            <div>
              <h1 className="text-4xl font-montserrat font-bold bg-gradient-to-r from-monad-purple to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 text-sm">Tu resumen financiero en tiempo real</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="border-gray-300 hover:border-monad-purple"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-300 hover:border-red-400 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Wallet Info */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Wallet</p>
                <p className="text-sm font-mono text-gray-800">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Loading...'}
                </p>
              </div>
            </div>
          </Card>

          {/* Verification Status */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Estado</p>
                <div className="flex items-center space-x-2">
                  {contractData.isVerified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-700">Verificado</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">Pendiente</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Total Loans */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Préstamos</p>
                <p className="text-lg font-bold text-purple-700">
                  {parseInt(contractData.totalLoans) || 0}
                </p>
              </div>
            </div>
          </Card>

          {/* Active Loans */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Préstamos Activos</p>
                <p className="text-lg font-bold text-orange-700">
                  {contractData.activeLoanIds.length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Debt Overview */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-montserrat font-bold text-gray-800">
                  Resumen de Deuda
                </h2>
                <p className="text-sm text-gray-600">Tu estado financiero actual</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Monto Total</span>
                </div>
                <span className="text-xl font-bold text-green-700">{debtData.total.toFixed(2)} MON</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Monto Financiado</span>
                </div>
                <span className="text-xl font-bold text-blue-700">{debtData.paid.toFixed(2)} MON</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Deuda Pendiente</span>
                </div>
                <span className="text-xl font-bold text-red-700">
                  {(parseFloat(contractData.userDebt) / 1e18).toFixed(4)} MON
                </span>
              </div>
            </div>
          </Card>

          {/* Loan Details */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-montserrat font-bold text-gray-800">
                  Detalles del Préstamo
                </h2>
                <p className="text-sm text-gray-600">Información de tu préstamo activo</p>
              </div>
              
            </div>
            
            {contractData.hasLoanRequest ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">ID del Préstamo</span>
                    <span className="text-sm font-mono text-purple-600">#{contractData.userLoanId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Colateral</span>
                    <span className="text-lg font-bold text-purple-700">
                      {(parseFloat(contractData.userLoanCollateral) / 1e18).toFixed(2)} MON
                    </span>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Estado</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-700">Activo</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons with Inputs */}
                    <div className="space-y-3 pt-3 border-t border-green-200">
                      {/* Retirar Colateral Section */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">
                          Cantidad a Pedir Prestado (MON)
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            placeholder="0.0"
                            step="0.01"
                            min="0"
                            className="flex-1 h-9 text-sm"
                            value={borrowAmount}
                            onChange={(e) => setBorrowAmount(e.target.value)}
                          />
                          <Button 
                            onClick={handleBorrow}
                            variant="outline"
                            disabled={isWithdrawing || !borrowAmount || parseFloat(borrowAmount) <= 0}
                            size="sm"
                            className="border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-sm px-3"
                          >
                            {isWithdrawing ? (
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            ) : (
                              <ArrowUpCircle className="h-3 w-3 mr-2" />
                            )}
                            {isWithdrawing ? 'Pidiendo...' : 'Pedir Prestado'}
                          </Button>
                        </div>
                      </div>

                      {/* Pagar MON Section */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">
                          Cantidad a Pagar (MON)
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            placeholder="0.0"
                            step="0.01"
                            min="0"
                            className="flex-1 h-9 text-sm"
                            value={repayAmount}
                            onChange={(e) => setRepayAmount(e.target.value)}
                          />
                          <Button 
                            onClick={handleRepay}
                            variant="outline"
                            disabled={isRepaying || !repayAmount || parseFloat(repayAmount) <= 0}
                            size="sm"
                            className="border-gray-300 hover:border-green-400 hover:bg-green-50 text-sm px-3"
                          >
                            {isRepaying ? (
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            ) : (
                              <ArrowDownCircle className="h-3 w-3 mr-2" />
                            )}
                            {isRepaying ? 'Pagando...' : 'Pagar'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            ) : (
              <div className="text-center py-8">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">No tienes préstamos activos</p>
                <Button 
                  onClick={() => navigate('/loan-form')}
                  className="bg-monad-purple hover:bg-monad-purple/90"
                >
                  Solicitar Préstamo
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
          <h3 className="text-lg font-montserrat font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/loan-form')}
              className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white py-3"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Solicitar Préstamo
            </Button>
            <Button 
              onClick={() => navigate('/borrowers-list')}
              variant="outline"
              className="w-full border-gray-300 hover:border-monad-purple py-3"
            >
              <Users className="h-4 w-4 mr-2" />
              Ver Préstamos
            </Button>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="w-full border-gray-300 hover:border-monad-purple py-3"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar Datos
            </Button>

          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;