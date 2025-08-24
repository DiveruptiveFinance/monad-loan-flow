import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AllFormPage = () => {
  const navigate = useNavigate();
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(false);

  const handleDocumentUpload = () => {
    setDocumentUploaded(true);
  };

  const handleKycComplete = () => {
    setKycCompleted(true);
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-8">
      <div className="max-w-md mx-auto">
        <Card className="p-6 space-y-6 bg-card rounded-xl shadow-sm">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-montserrat font-bold text-foreground">
              Documentación
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
              className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300 mt-6"
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