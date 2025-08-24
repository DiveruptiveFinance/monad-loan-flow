import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppKitProvider } from '@/components/ReownButtonProvider';
import { useState, useEffect } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Monitor wallet connection status
  useEffect(() => {
    const checkConnection = () => {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        setIsWalletConnected(false);
        return;
      }
      
      // Check if there are any accounts connected
      ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          const connected = accounts && accounts.length > 0;
          console.log('Wallet connection check:', { accounts, connected });
          setIsWalletConnected(connected);
        })
        .catch((error) => {
          console.log('Wallet connection error:', error);
          setIsWalletConnected(false);
        });
    };

    // Initial check
    checkConnection();
    
    // Listen for connection events
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', checkConnection);
      (window as any).ethereum.on('connect', checkConnection);
      (window as any).ethereum.on('disconnect', checkConnection);
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', checkConnection);
        (window as any).ethereum.removeListener('connect', checkConnection);
        (window as any).ethereum.removeListener('disconnect', checkConnection);
      }
    };
  }, []);

  const handleContinue = () => {
    // Check if verification has already been completed
    const storedVerification = localStorage.getItem('loanad-verification');
    console.log('LandingPage - Checking verification status:', storedVerification);
    
    if (storedVerification) {
      try {
        const verification = JSON.parse(storedVerification);
        console.log('LandingPage - Parsed verification data:', verification);
        
        if (verification.documentUploaded && verification.kycCompleted) {
          console.log('LandingPage - Verification complete, going to dashboard');
          // Verification already completed, go directly to dashboard
          navigate('/dashboard');
          return;
        } else {
          console.log('LandingPage - Verification incomplete, going to verification page');
        }
      } catch (error) {
        console.error('LandingPage - Error parsing verification data:', error);
      }
    } else {
      console.log('LandingPage - No verification data found, going to verification page');
    }
    
    // If no verification or incomplete, go to verification page
    navigate('/all-form');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between px-4 py-8">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md w-full space-y-8">
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/b9433d6b-951c-4718-8950-f24aab2e29cf.png" 
              alt="LOANAD Logo" 
              className="w-24 h-24 mx-auto mb-2"
            />
            <h1 className="text-5xl font-montserrat font-bold text-foreground">
              LOANAD
            </h1>
            <h2 className="text-2xl font-montserrat font-bold text-foreground">
              Préstamos P2P On-chain
            </h2>
          </div>
          
          <div className="space-y-4">
            {isWalletConnected && (
              <Button 
                onClick={handleContinue}
                className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300"
              >
                Continuar
                <ArrowRight className="ml-2" size={20} />
              </Button>
            )}
            <div className="flex justify-center">
              <AppKitProvider>
                  <appkit-button label="Iniciar Sesión" />
              </AppKitProvider>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-light text-muted-foreground">
          Powered By Kairos Research
        </p>
      </div>
    </div>
  );
};

export default LandingPage;