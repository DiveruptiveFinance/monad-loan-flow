import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoanClick = () => {
    navigate('/all-form', { state: { type: 'loan' } });
  };

  const handleInvestClick = () => {
    navigate('/all-form', { state: { type: 'invest' } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md w-full space-y-8">
        <div className="space-y-4">
          <img 
            src="/lovable-uploads/b9433d6b-951c-4718-8950-f24aab2e29cf.png" 
            alt="LOANAD Logo" 
            className="w-16 h-16 mx-auto mb-2"
          />
          <h1 className="text-5xl font-montserrat font-bold text-foreground">
            LOANAD
          </h1>
          <h2 className="text-2xl font-montserrat font-bold text-foreground">
            Préstamos P2P On-chain
          </h2>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/all-form')}
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