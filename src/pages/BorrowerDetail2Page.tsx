import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const BorrowerDetail2Page = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const borrower = location.state?.borrower;

  // Data por defecto si no viene del state
  const defaultBorrower = {
    id: 1,
    name: 'Tu préstamo',
    age: 28,
    amount: 15000,
    interestRate: 12,
    purpose: 'Expandir mi negocio de desarrollo web',
    score: 750,
    fundedPercentage: 45,
    avatar: '🚀',
    income: 8000,
    expenses: 4500,
    description: 'Necesito capital para expandir mi agencia de desarrollo web. Con esta inversión podré contratar más desarrolladores y tomar proyectos más grandes.'
  };

  const data = {
    ...defaultBorrower,
    ...borrower
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 pb-32">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="p-6 bg-card rounded-xl shadow-lg border border-border/50">
          {/* Botón de regresar en el lado izquierdo */}
          <div className="flex justify-start mb-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-foreground hover:text-monad-purple transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          </div>
          
          {/* Header con avatar y datos básicos */}
          <div className="text-center space-y-4 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-monad-purple/30 to-monad-purple/60 rounded-2xl flex items-center justify-center text-4xl mx-auto">
              {data.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-montserrat font-bold text-foreground">
                {data.name}
              </h2>
              <p className="text-muted-foreground">
                Estado de tu préstamo
              </p>
            </div>
          </div>

          {/* Información del préstamo */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Monto</p>
                <p className="font-bold text-lg text-foreground">
                  ${data.amount.toLocaleString()}
                </p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Tasa</p>
                <p className="font-bold text-lg text-monad-purple">
                  {data.interestRate}%
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-montserrat font-bold text-foreground mb-2">
                Descripción del préstamo
              </h3>
              <p className="text-muted-foreground text-sm">
                {data.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos</p>
                <p className="font-bold text-foreground">
                  ${data.income.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Egresos</p>
                <p className="font-bold text-foreground">
                  ${data.expenses.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="text-monad-purple" size={20} />
              <span className="font-bold text-foreground">
                Score crediticio: {data.score}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso del préstamo</span>
                <span className="font-medium">{data.fundedPercentage}% fondeado</span>
              </div>
              <Progress value={data.fundedPercentage} className="h-3" />
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                💰 Pagar
              </button>
              <button className="h-9 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                💸 Retirar
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BorrowerDetail2Page;