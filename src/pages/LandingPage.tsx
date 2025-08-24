import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoanClick = () => {
    navigate('/login', { state: { type: 'loan' } });
  };

  const handleInvestClick = () => {
    navigate('/login', { state: { type: 'invest' } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-montserrat font-bold text-foreground">
            LOANAD
          </h1>
          <h2 className="text-2xl font-montserrat font-bold text-foreground">
            Préstamos P2P On-chain
          </h2>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/login')}
            className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300"
          >
            Iniciar
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;