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

  // Check if verification has already been completed
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        // Check localStorage for existing verification
        const storedVerification = localStorage.getItem('loanad-verification');
        
        if (storedVerification) {
          const verification = JSON.parse(storedVerification);
          
          if (verification.documentUploaded && verification.kycCompleted) {
            // Verification already completed, redirect to dashboard
            navigate('/dashboard');
            return;
          } else {
            // Partial verification, restore state
            setDocumentUploaded(verification.documentUploaded || false);
            setKycCompleted(verification.kycCompleted || false);
          }
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

  const handleContinue = () => {
    // Save final verification status
    localStorage.setItem('loanad-verification', JSON.stringify({
      documentUploaded: true,
      kycCompleted: true
    }));
    navigate('/dashboard');
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
              disabled={!documentUploaded || !kycCompleted}
              className={`w-full font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300 mt-6 ${
                documentUploaded && kycCompleted
                  ? 'bg-monad-purple hover:bg-monad-purple/90 text-white cursor-pointer'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              Continuar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AllFormPage;