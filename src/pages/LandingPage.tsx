import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppKitProvider } from '@/components/ReownButtonProvider';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useEffect } from 'react';

const LandingPageContent = () => {
  const navigate = useNavigate();
  const { 
    isConnected, 
    address, 
    connectionType, 
    provider, 
    refreshConnection 
  } = useWalletConnection();

  // Log connection changes
  useEffect(() => {
    console.log('Wallet connection state changed:', { 
      isConnected, 
      address, 
      connectionType, 
      provider 
    });
  }, [isConnected, address, connectionType, provider]);

  const handleContinue = async () => {
    if (!isConnected || !address) {
      console.error('No wallet connected');
      return;
    }

    try {
      console.log('LandingPage - Checking verification status for:', address);
      
      // Call backend API to check if user is already verified on-chain
      const response = await fetch('http://localhost:4000/api/check-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('LandingPage - Verification check result:', result);

      if (result.isVerified) {
        console.log('LandingPage - User already verified on-chain, going to dashboard');
        // User is already verified on-chain, go directly to dashboard
        navigate('/dashboard');
        return;
      } else {
        console.log('LandingPage - User not verified on-chain, going to verification page');
        // User is not verified, go to verification page
        navigate('/verification');
      }
    } catch (error) {
      console.error('LandingPage - Error checking verification:', error);
      // On error, fallback to verification page
      navigate('/verification');
    }
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
            {isConnected && (
              <>
                {/* Wallet Display */}
                <div className="border border-monad-purple rounded-lg p-3 bg-card/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-monad-purple rounded-full animate-pulse"></div>
                    <span className="text-sm text-foreground font-mono">
                      {address ? `0x${address.slice(2, 6)}...${address.slice(-4)}` : 'Connecting...'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300"
                >
                  Continuar
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </>
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

const LandingPage = () => {
  return <LandingPageContent />;
};

export default LandingPage;