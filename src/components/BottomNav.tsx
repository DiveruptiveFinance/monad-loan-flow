import { Home, TrendingUp, HandCoins } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // No mostrar en pantallas de verificación, carga, etc.
  const hideBottomNavRoutes = ['/loan-approved', '/investment-approved', '/confirmations', '/'];
  
  if (hideBottomNavRoutes.includes(location.pathname)) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-md mx-auto flex justify-around items-center py-3">
        <button 
          onClick={() => navigate('/borrowers-list')}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
            isActive('/borrowers-list') 
              ? 'text-monad-purple' 
              : 'text-muted-foreground hover:text-monad-purple'
          }`}
        >
          <TrendingUp size={24} />
          <span className="text-xs font-montserrat font-bold">Invertir</span>
        </button>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
            isActive('/dashboard') 
              ? 'text-monad-purple' 
              : 'text-muted-foreground hover:text-monad-purple'
          }`}
        >
          <Home size={28} />
          <span className="text-xs font-montserrat font-bold">Inicio</span>
        </button>
        
        <button 
          onClick={() => navigate('/loan-form')}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
            isActive('/loan-form') 
              ? 'text-monad-purple' 
              : 'text-muted-foreground hover:text-monad-purple'
          }`}
        >
          <HandCoins size={24} />
          <span className="text-xs font-montserrat font-bold">Préstamo</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;