import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const LoanApprovedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Animated checkmark emoji */}
        <div className="text-8xl animate-bounce">
          ✅
        </div>
        
        <h2 className="text-2xl font-montserrat font-bold text-foreground">
          ¡Felicidades, tu solicitud de préstamo fue aprobada!
        </h2>
        
        <div className="space-y-4">
          <Card className="p-6 bg-card rounded-xl">
            <h3 className="text-lg font-montserrat font-bold text-foreground">
              Préstamo aprobado: $10,000
            </h3>
          </Card>
          
          <Card className="p-6 bg-card rounded-xl flex items-center justify-center gap-3">
            <TrendingUp className="text-monad-purple" size={24} />
            <h3 className="text-lg font-montserrat font-bold text-foreground">
              Score crediticio: 700
            </h3>
          </Card>
          
          <Card className="p-4 bg-monad-purple rounded-xl">
            <div className="bg-white rounded-lg p-2">
              <p className="text-lg font-montserrat font-bold text-foreground">
                Tasa a pagar: 12% fijo
              </p>
            </div>
          </Card>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/borrower-detail2')}
            className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg"
          >
            Ver solicitud
            <ArrowRight className="ml-2" size={20} />
          </Button>
          
          <Button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg"
          >
            Ir a Dashboard
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanApprovedPage;