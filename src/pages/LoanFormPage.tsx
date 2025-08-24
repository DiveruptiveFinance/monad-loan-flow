import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { monadTestnet } from 'wagmi/chains';

/**
 * LoanFormPage - Solicitud de Préstamo
 * 
 * Smart Contract Functions Used:
 * - 0x706f24a5 -> createLoanRequest(uint256) - Create new loan request
 * 
 * Contract Address: 0x7F5653D022E2084CD227b74920f88a407a40feA5
 */

const LoanFormPage = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useWalletConnection();
  const [interestRate, setInterestRate] = useState([15]);
  const [loanAmount, setLoanAmount] = useState('10000000000000000000'); // 10 ETH in wei
  const [loanPurpose, setLoanPurpose] = useState('Emprender un negocio');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('5000');
  const [monthlyExpenses, setMonthlyExpenses] = useState('3000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Wagmi hooks for contract interaction
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleContinue = async () => {
    if (!isConnected || !address) {
      setMessage({ type: 'error', text: 'No hay wallet conectada' });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      console.log('Creating loan request with amount:', loanAmount);

      // Call the smart contract using Wagmi
              // Function selector: 0x706f24a5 -> createLoanRequest(uint256)
        writeContract({
          address: '0x7F5653D022E2084CD227b74920f88a407a40feA5' as `0x${string}`,
        abi: [
          {
            inputs: [{ name: 'amountToBorrow', type: 'uint256' }],
            name: 'createLoanRequest',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        functionName: 'createLoanRequest',
        args: [BigInt(loanAmount)],
        chain: monadTestnet,
        account: address as `0x${string}`
      });

      setMessage({ 
        type: 'success', 
        text: 'Transacción enviada. Esperando confirmación...' 
      });

    } catch (error) {
      console.error('Error creating loan request:', error);
      setMessage({ 
        type: 'error', 
        text: `Error al crear solicitud: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      });
      setIsSubmitting(false);
    }
  };

  // Handle transaction success
  if (isSuccess && hash) {
    // Save loan request details to localStorage
    const loanRequestData = {
      amount: loanAmount,
      purpose: loanPurpose,
      additionalDetails,
      monthlyIncome,
      monthlyExpenses,
      txHash: hash,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('loanad-loan-request', JSON.stringify(loanRequestData));
    
    // Navigate to confirmations page
    setTimeout(() => {
      navigate('/confirmations');
    }, 2000);
  }

  // Show loading state
  if (isPending || isConfirming) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-monad-purple mx-auto mb-4" />
          <p className="text-muted-foreground">
            {isPending ? 'Enviando transacción...' : 'Esperando confirmación...'}
          </p>
          {hash && (
            <p className="text-xs text-muted-foreground mt-2">
              Hash: {hash.slice(0, 6)}...{hash.slice(-4)}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pt-8 pb-24">
      <div className="max-w-md mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-4 p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        
        <Card className="p-6 space-y-6 bg-card rounded-xl shadow-sm">
          <h2 className="text-2xl font-montserrat font-bold text-foreground text-center">
            Solicitud de Préstamo
          </h2>
          
          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ¿Cuánto dinero necesitas?
              </label>
              <Input 
                type="number" 
                value={parseFloat(loanAmount) / 1e18}
                onChange={(e) => setLoanAmount((parseFloat(e.target.value) * 1e18).toString())}
                placeholder="10"
                className="rounded-lg"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Monto en ETH (máximo 10 ETH)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ¿Para qué lo necesitas?
              </label>
              <Input 
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
                placeholder="Emprender un negocio"
                className="rounded-lg"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Detalles adicionales
              </label>
              <Textarea 
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Cuéntanos más sobre tu proyecto..."
                className="rounded-lg h-20"
                disabled={isSubmitting}
              />
            </div>

            <Button
              onClick={handleContinue}
              disabled={!isConnected || isSubmitting}
              className={`w-full font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300 ${
                isConnected && !isSubmitting
                  ? 'bg-monad-purple hover:bg-monad-purple/90 text-white cursor-pointer'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Procesando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="ml-2" size={20} />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoanFormPage;