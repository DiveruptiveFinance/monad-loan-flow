import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AllFormPage = () => {
  const navigate = useNavigate();
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check if verification has already been completed
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        // Check localStorage for existing verification
        const storedVerification = localStorage.getItem('loanad-verification');
        console.log('Checking verification status:', storedVerification);
        
        if (storedVerification) {
          const verification = JSON.parse(storedVerification);
          console.log('Parsed verification data:', verification);
          
          if (verification.documentUploaded && verification.kycCompleted) {
            console.log('Verification complete, but waiting for user to click continue');
            // Don't redirect automatically - let user click continue
            setDocumentUploaded(true);
            setKycCompleted(true);
          } else {
            console.log('Partial verification, restoring state');
            // Partial verification, restore state
            setDocumentUploaded(verification.documentUploaded || false);
            setKycCompleted(verification.kycCompleted || false);
          }
        } else {
          console.log('No verification data found');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkVerificationStatus();
  }, [navigate]);

  const handleDocumentUpload = () => {
    setDocumentUploaded(true);
    // Save to localStorage
    localStorage.setItem('loanad-verification', JSON.stringify({
      documentUploaded: true,
      kycCompleted
    }));
  };

  const handleKycComplete = () => {
    setKycCompleted(true);
    // Save to localStorage
    localStorage.setItem('loanad-verification', JSON.stringify({
      documentUploaded,
      kycCompleted: true
    }));
  };

  const handleContinue = async () => {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    setMessage(null); // Clear previous messages
    try {
      // Get the connected wallet address
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        console.error('No ethereum provider found');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        console.error('No wallet connected');
        return;
      }

      const userAddress = accounts[0];
      console.log('User address:', userAddress);

      // First, check if user is already verified
      const verificationResponse = await fetch('http://localhost:4000/api/check-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: userAddress
        }),
      });

      if (!verificationResponse.ok) {
        throw new Error(`HTTP error! status: ${verificationResponse.status}`);
      }

      const verificationResult = await verificationResponse.json();
      console.log('Verification check result:', verificationResult);

      if (verificationResult.isVerified) {
        // User is already verified, skip to dashboard
        setMessage({ type: 'success', text: 'Usuario ya verificado. Redirigiendo...' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        return;
      }

      // User is not verified, proceed with verification and loan initialization
      const response = await fetch('http://localhost:4000/api/init-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: userAddress
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Loan initialization result:', result);

      // Show success message
      const shortHash = `${result.txHash.slice(0, 8)}...${result.txHash.slice(-6)}`;
      setMessage({ type: 'success', text: `Verificación completada! Hash: ${shortHash}` });
      
      // Save final verification status
      localStorage.setItem('loanad-verification', JSON.stringify({
        documentUploaded: true,
        kycCompleted: true
      }));

      // Wait a bit to show success message, then navigate
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error initializing loan:', error);
      setMessage({ type: 'error', text: 'Error al inicializar el préstamo. Intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking verification status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-monad-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando estado...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background px-4 pt-8 pb-24">
      <div className="max-w-md mx-auto">
        <Card className="p-6 space-y-6 bg-card rounded-xl shadow-sm">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-montserrat font-bold text-foreground">
              Verificación
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Necesitamos estos documentos para verificar tu identidad y capacidad de pago. 
              Esto nos ayuda a ofrecerte las mejores condiciones y proteger tanto tu información 
              como la de nuestros inversores.
            </p>
          </div>
          
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
            <Button 
              onClick={handleDocumentUpload}
              className={`w-full rounded-lg py-6 transition-all duration-300 font-montserrat font-bold ${
                documentUploaded 
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                  : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
              }`}
            >
              <Paperclip className="mr-2" size={20} />
              {documentUploaded ? "Comprobante subido" : "Comprobante de ingresos"}
            </Button>

            <Button 
              onClick={handleKycComplete}
              className={`w-full rounded-lg py-6 transition-all duration-300 font-montserrat font-bold ${
                kycCompleted 
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                  : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
              }`}
            >
              <User className="mr-2" size={20} />
              {kycCompleted ? "KYC completado" : "Realiza KYC"}
            </Button>

            <Button 
              onClick={handleContinue}
              disabled={!documentUploaded || !kycCompleted || isSubmitting}
              className={`w-full font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300 mt-6 ${
                documentUploaded && kycCompleted && !isSubmitting
                  ? 'bg-monad-purple hover:bg-monad-purple/90 text-white cursor-pointer'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                'Continuar'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AllFormPage;