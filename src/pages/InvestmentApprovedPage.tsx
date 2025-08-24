import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const InvestmentApprovedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { borrower, investmentAmount, expectedReturn } = location.state || {};

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Animated checkmark emoji */}
        <div className="text-8xl animate-bounce">
          ✅
        </div>
        
        <h2 className="text-2xl font-montserrat font-bold text-foreground">
          ¡Inversión Completada!
        </h2>
        
        <div className="space-y-4">
          {expectedReturn && (
            <Card className="p-6 bg-green-50 border-green-200 rounded-xl">
              <h3 className="text-lg font-montserrat font-bold text-green-800">
                Ganancia anual esperada: ${expectedReturn.toFixed(2)}
              </h3>
            </Card>
          )}
          
          {borrower && (
            <Card className="p-6 bg-monad-purple/10 border-monad-purple/20 rounded-xl">
              <h3 className="text-lg font-montserrat font-bold text-monad-purple">
                Tasa de rendimiento: {borrower.interestRate}%
              </h3>
            </Card>
          )}
          
          {investmentAmount && (
            <Card className="p-4 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground">
                Has invertido <span className="font-bold text-foreground">${investmentAmount}</span> en {borrower?.name || 'el préstamo'}
              </p>
            </Card>
          )}
        </div>
        
        <Button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300"
        >
          Volver al Dashboard
          <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default InvestmentApprovedPage;