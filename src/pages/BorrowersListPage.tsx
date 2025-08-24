import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, TrendingUp, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useWalletConnection } from '@/hooks/useWalletConnection';

interface LoanData {
  loanId: number;
  borrower: string;
  amount: string;
  collateral: string;
  isActive: boolean;
  requestAmount?: string; // Amount requested in the loan request
  hasLoanRequest: boolean; // Whether this loan has an active request
  inputAmount?: string; // User input amount in wei
  inputAmountEth?: string; // User input amount in ETH
}

interface BorrowerCardProps {
  loanData: LoanData;
}

const BorrowerCard = ({ loanData }: BorrowerCardProps) => {
  const navigate = useNavigate();
  
  // Convert wei to ETH for display
  const amountInEth = parseFloat(loanData.amount) / 1e18;
  const collateralInEth = parseFloat(loanData.collateral) / 1e18;
  const requestAmountInEth = parseFloat(loanData.requestAmount || '0') / 1e18;
  
  // Generate avatar based on address
  const generateAvatar = (address: string) => {
    const emojis = ['🚀', '💼', '📚', '🏠', '💰', '🎯', '🌟', '💡'];
    const index = parseInt(address.slice(2, 4), 16) % emojis.length;
    return emojis[index];
  };

  // Calculate funding percentage (simplified - could be enhanced with real funding data)
  const fundingPercentage = Math.min(100, Math.floor((collateralInEth / amountInEth) * 100));

  return (
    <Card className="p-4 bg-card shadow-sm rounded-xl border border-border/50 hover:shadow-md transition-all duration-300">
      <div className="space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-monad-purple/20 to-monad-purple/40 rounded-xl flex items-center justify-center text-xl shrink-0">
              {generateAvatar(loanData.borrower)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-montserrat font-bold text-foreground text-lg truncate">
                {loanData.borrower.slice(0, 6)}...{loanData.borrower.slice(-4)}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {amountInEth.toFixed(2)} ETH - Préstamo #{loanData.loanId}
              </p>
            </div>
          </div>
          <div className="bg-monad-purple text-white rounded-full w-10 h-6 flex items-center justify-center text-xs font-bold shrink-0">
            ID{loanData.loanId}
          </div>
        </div>
        
        {/* Loan details row */}
        <div className="space-y-3">
          {/* Collateral and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-monad-purple shrink-0" />
              <span className="text-sm font-medium">Colateral: {collateralInEth.toFixed(2)} ETH</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-green-600 text-xs font-medium">Verificado</span>
              </div>
              <div className={`flex items-center gap-1 ${loanData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full ${loanData.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs font-medium">{loanData.isActive ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
          </div>
          
          {/* Loan Request Information */}
          {loanData.hasLoanRequest && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-xs font-medium">📋 Solicitud de Préstamo</span>
                </div>
                <span className="text-blue-600 text-xs font-medium">#{loanData.loanId}</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Monto Solicitado:</span>
                  <span className="font-medium text-blue-700">{requestAmountInEth.toFixed(2)} ETH</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-blue-700">Estado:</span>
                  <span className="font-medium text-green-600">Pendiente de Fondeo</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso de Colateral</span>
            <span className="font-medium text-foreground">{fundingPercentage}% colateralizado</span>
          </div>
          <Progress value={fundingPercentage} className="h-2" />
        </div>
        
        {/* Action buttons and inputs */}
        <div className="space-y-3">
          {/* Input for amount */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-muted-foreground">
              Cantidad en ETH
            </label>
            <Input 
              type="number"
              placeholder="0.0"
              step="0.01"
              min="0"
              className="h-9 text-sm"
              value={loanData.inputAmount || ''}
              onChange={(e) => {
                const value = e.target.value;
                const weiValue = value ? (parseFloat(value) * 1e18).toString() : '';
                loanData.inputAmount = weiValue;
                loanData.inputAmountEth = value;
              }}
            />
          </div>
          
          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* Fund Loan Button */}
            <Button 
              onClick={() => handleFundLoan(loanData)}
              className="bg-green-600 hover:bg-green-700 text-white font-montserrat font-bold py-2 px-3 rounded-lg transition-all duration-300 text-sm"
              disabled={!loanData.isActive || !loanData.inputAmount || parseFloat(loanData.inputAmount || '0') <= 0}
            >
              <span className="mr-1">💰</span>
              Fondear
            </Button>
            
            {/* Withdraw Funds Button */}
            <Button 
              onClick={() => handleWithdrawFunds(loanData)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-montserrat font-bold py-2 px-3 rounded-lg transition-all duration-300 text-sm"
              disabled={!loanData.isActive || !loanData.inputAmount || parseFloat(loanData.inputAmount || '0') <= 0}
            >
              <span className="mr-1">💸</span>
              Retirar
            </Button>
          </div>
          
          {/* View Details Button */}
          <Button 
            onClick={() => navigate('/borrower-detail', { state: { loanData } })}
            variant="outline"
            className="w-full border-monad-purple/30 text-monad-purple hover:bg-monad-purple/10 font-montserrat font-medium py-2 rounded-lg transition-all duration-300 text-sm"
          >
            <span className="mr-1">👁️</span>
            Ver Detalles
          </Button>
        </div>
      </div>
    </Card>
  );
};

const BorrowersListPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useWalletConnection();
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOnlyRequests, setShowOnlyRequests] = useState(false);

  const fetchLoanData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch total loans count
      const totalLoansResponse = await fetch('http://localhost:4000/api/get-total-loans');
      if (!totalLoansResponse.ok) throw new Error('Error fetching total loans');
      const totalLoans = await totalLoansResponse.json();
      
      if (totalLoans.totalLoans === '0') {
        setLoans([]);
        return;
      }

      // Fetch active loan IDs
      const activeLoansResponse = await fetch('http://localhost:4000/api/get-active-loan-ids');
      if (!activeLoansResponse.ok) throw new Error('Error fetching active loan IDs');
      const activeLoans = await activeLoansResponse.json();
      
      const activeLoanIds = activeLoans.activeLoanIds || [];
      
      // Fetch details for each loan
      const loanDetails: LoanData[] = [];
      
      for (const loanId of activeLoanIds) {
        try {
          // Fetch borrower for this loan
          const borrowerResponse = await fetch('http://localhost:4000/api/get-loan-borrower', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loanId: parseInt(loanId) })
          });
          if (!borrowerResponse.ok) continue;
          const borrowerData = await borrowerResponse.json();
          
          // Fetch collateral for this loan
          const collateralResponse = await fetch('http://localhost:4000/api/get-loan-collateral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loanId: parseInt(loanId) })
          });
          if (!collateralResponse.ok) continue;
          const collateralData = await collateralResponse.json();
          
          // Fetch maximum amount for this borrower
          const maxAmountResponse = await fetch('http://localhost:4000/api/get-max-amount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddress: borrowerData.borrower })
          });
          if (!maxAmountResponse.ok) continue;
          const maxAmountData = await maxAmountResponse.json();
          
          // Check if this loan has a loan request by calling the contract
          // We'll need to check if there's a loan request for this loanId
          let hasLoanRequest = false;
          let requestAmount = '0';
          
          try {
            // For now, we'll assume all active loans have requests
            // In a real implementation, you'd check the loan request status
            hasLoanRequest = true;
            requestAmount = maxAmountData.maxAmount || '0';
          } catch (err) {
            console.error(`Error checking loan request for loan ${loanId}:`, err);
            hasLoanRequest = false;
          }
          
          loanDetails.push({
            loanId: parseInt(loanId),
            borrower: borrowerData.borrower,
            amount: maxAmountData.maxAmount || '0',
            collateral: collateralData.collateral || '0',
            isActive: true,
            hasLoanRequest,
            requestAmount
          });
        } catch (err) {
          console.error(`Error fetching details for loan ${loanId}:`, err);
          continue;
        }
      }
      
      setLoans(loanDetails);
    } catch (err) {
      console.error('Error fetching loan data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar los préstamos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLoanData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (isConnected) {
      fetchLoanData();
    }
  }, [isConnected]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 pt-6 pb-24">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-muted rounded-lg transition-colors mr-3 shrink-0"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-montserrat font-bold text-foreground mb-1 truncate">
                Lista de Solicitantes
              </h2>
              <h3 className="text-sm text-muted-foreground">
                Cargando préstamos...
              </h3>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-monad-purple" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background px-4 pt-6 pb-24">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-muted rounded-lg transition-colors mr-3 shrink-0"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-montserrat font-bold text-foreground mb-1 truncate">
                Lista de Solicitantes
              </h2>
              <h3 className="text-sm text-muted-foreground">
                Error al cargar datos
              </h3>
            </div>
          </div>
          
          <Card className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Error al cargar préstamos</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh} className="bg-monad-purple hover:bg-monad-purple/90">
              Reintentar
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Show no loans state
  if (loans.length === 0 || (showOnlyRequests && loans.filter(loan => loan.hasLoanRequest).length === 0)) {
    return (
      <div className="min-h-screen bg-background px-4 pt-6 pb-24">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-muted rounded-lg transition-colors mr-3 shrink-0"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-montserrat font-bold text-foreground mb-1 truncate">
                Lista de Solicitantes
              </h2>
              <h3 className="text-sm text-muted-foreground">
                No hay préstamos activos
              </h3>
            </div>
          </div>
          
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No hay préstamos disponibles</h3>
            <p className="text-muted-foreground mb-4">
              Actualmente no hay solicitudes de préstamo activas en el sistema.
            </p>
            <Button onClick={handleRefresh} className="bg-monad-purple hover:bg-monad-purple/90">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pt-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-muted rounded-lg transition-colors mr-3 shrink-0"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-montserrat font-bold text-foreground mb-1 truncate">
                Lista de Solicitantes
              </h2>
              <h3 className="text-sm text-muted-foreground">
                {loans.length} préstamo{loans.length !== 1 ? 's' : ''} activo{loans.length !== 1 ? 's' : ''}
                {loans.filter(loan => loan.hasLoanRequest).length > 0 && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • {loans.filter(loan => loan.hasLoanRequest).length} solicitud{loans.filter(loan => loan.hasLoanRequest).length !== 1 ? 'es' : ''} pendiente{loans.filter(loan => loan.hasLoanRequest).length !== 1 ? 's' : ''}
                  </span>
                )}
              </h3>
              {/* Active Loan IDs Summary */}
              {loans.length > 0 && (
                <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">📋 IDs de Préstamos Activos:</span>
                      <span className="text-xs text-monad-purple font-bold">{loans.length}</span>
                    </div>
                    <Button
                      onClick={() => {
                        const loanIds = loans.map(loan => loan.loanId).join(', ');
                        navigator.clipboard.writeText(loanIds);
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      📋 Copiar IDs
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {loans.map((loan) => (
                      <div 
                        key={loan.loanId}
                        className="px-2 py-1 bg-monad-purple/10 border border-monad-purple/20 rounded-md text-xs font-mono text-monad-purple"
                      >
                        #{loan.loanId}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <strong>Lista completa:</strong> [{loans.map(loan => loan.loanId).join(', ')}]
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowOnlyRequests(!showOnlyRequests)}
                variant={showOnlyRequests ? "default" : "outline"}
                size="sm"
                className="shrink-0"
              >
                {showOnlyRequests ? '📋' : '📋'} Solicitudes
              </Button>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="shrink-0"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
        
        {/* Active Loans Summary Table */}
        {loans.length > 0 && (
          <Card className="p-4 mb-6">
            <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              📊 Resumen de Préstamos Activos
              <span className="text-sm text-muted-foreground font-normal">
                ({loans.length} total)
              </span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Prestatario</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Monto Máx</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Colateral</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Solicitud</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.loanId} className="border-b border-border/20 hover:bg-muted/30">
                      <td className="py-2">
                        <span className="font-mono font-bold text-monad-purple">#{loan.loanId}</span>
                      </td>
                      <td className="py-2">
                        <span className="font-mono text-xs">
                          {loan.borrower.slice(0, 6)}...{loan.borrower.slice(-4)}
                        </span>
                      </td>
                      <td className="py-2">
                        <span className="font-medium">
                          {(parseFloat(loan.amount) / 1e18).toFixed(2)} ETH
                        </span>
                      </td>
                      <td className="py-2">
                        <span className="font-medium">
                          {(parseFloat(loan.collateral) / 1e18).toFixed(2)} ETH
                        </span>
                      </td>
                      <td className="py-2">
                        {loan.hasLoanRequest ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Pendiente
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                      <td className="py-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                          loan.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            loan.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          {loan.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Loans list */}
        <div className="space-y-4">
          {loans
            .filter(loan => !showOnlyRequests || loan.hasLoanRequest)
            .map((loan) => (
              <BorrowerCard key={loan.loanId} loanData={loan} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BorrowersListPage;