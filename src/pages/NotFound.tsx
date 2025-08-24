import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-md w-full space-y-6">
        <div className="text-8xl">🔍</div>
        <h1 className="text-4xl font-montserrat font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">
          Oops! Página no encontrada
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-4 px-8 rounded-xl"
        >
          Regresar a Inicio
          <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
