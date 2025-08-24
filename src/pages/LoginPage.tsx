import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, Mail } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.type; // 'loan' or 'invest'

  const handleWalletLogin = () => {
    navigate('/all-form');
  };

  const handleSocialLogin = () => {
    navigate('/all-form');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-20">
      <div className="text-center max-w-md w-full space-y-8">
        <h2 className="text-3xl font-montserrat font-bold text-foreground">
          Conéctate para continuar
        </h2>
        
        <div className="space-y-4">
          <Button 
            onClick={handleWalletLogin}
            className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300"
          >
            <Wallet className="mr-2" size={20} />
            Entrar con Wallet
          </Button>
          
          <Button 
            onClick={handleSocialLogin}
            className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300"
          >
            <Mail className="mr-2" size={20} />
            Entrar con Google / Email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;