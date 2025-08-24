import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ConfirmationItem {
  id: string;
  label: string;
  isConfirmed: boolean;
  isLoading: boolean;
}

const ConfirmationsPage = () => {
  const navigate = useNavigate();
  const [confirmations, setConfirmations] = useState<ConfirmationItem[]>([
    { id: 'income', label: 'Comprobante de Ingresos', isConfirmed: false, isLoading: true },
    { id: 'kyc', label: 'ZK Passport', isConfirmed: false, isLoading: false },
    { id: 'score', label: 'Builder Score', isConfirmed: false, isLoading: false }
  ]);

  useEffect(() => {
    // Simular proceso de confirmación secuencial
    const confirmSequentially = async () => {
      for (let i = 0; i < confirmations.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setConfirmations(prev => prev.map((item, index) => {
          if (index === i) {
            return { ...item, isLoading: false, isConfirmed: true };
          } else if (index === i + 1) {
            return { ...item, isLoading: true };
          }
          return item;
        }));
      }
      
      // Cuando todas estén confirmadas, navegar después de un breve delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    };

    confirmSequentially();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-montserrat font-bold text-foreground text-center">
          Confirmando datos
        </h2>
        
        <div className="space-y-6">
          {confirmations.map((item) => (
            <div 
              key={item.id}
              className={`flex items-center justify-between p-6 rounded-full border-2 transition-all duration-500 ${
                item.isConfirmed 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-muted border-border'
              }`}
            >
              <span className="font-montserrat font-medium text-foreground">
                {item.label}
              </span>
              
              {item.isLoading && (
                <Loader2 className="animate-spin text-monad-purple" size={24} />
              )}
              
              {item.isConfirmed && (
                <CheckCircle className="text-green-500" size={24} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationsPage;