import { Home, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // No mostrar la topbar en las pantallas 5 y 7 (aprobaciones)
  const hideTopBarRoutes = ['/loan-approved', '/borrower-detail'];
  
  if (hideTopBarRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
      <div className="max-w-md mx-auto flex justify-between items-center p-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-foreground hover:text-monad-purple transition-colors"
        >
          <Home size={24} />
          <span className="font-montserrat font-bold">Inicio</span>
        </button>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-foreground hover:text-monad-purple transition-colors"
        >
          <User size={24} />
          <span className="font-montserrat font-bold">Usuario</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;