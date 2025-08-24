import { useNavigate } from 'react-router-dom';
import { CheckCircle, TrendingUp, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface BorrowerCardProps {
  id: number;
  name: string;
  amount: number;
  interestRate: number;
  purpose: string;
  score: number;
  fundedPercentage: number;
  avatar: string;
}

const BorrowerCard = ({ id, name, amount, interestRate, purpose, score, fundedPercentage, avatar }: BorrowerCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-4 bg-card shadow-sm rounded-xl border border-border/50 hover:shadow-md transition-all duration-300">
      <div className="space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-monad-purple/20 to-monad-purple/40 rounded-xl flex items-center justify-center text-xl shrink-0">
              {avatar}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-montserrat font-bold text-foreground text-lg truncate">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                ${amount.toLocaleString()} - {purpose}
              </p>
            </div>
          </div>
          <div className="bg-monad-purple text-white rounded-full w-10 h-6 flex items-center justify-center text-xs font-bold shrink-0">
            ID{id}
          </div>
        </div>
        
        {/* Score and verification row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-monad-purple shrink-0" />
            <span className="text-sm font-medium">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-green-600 text-xs font-medium">KYC</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-green-600 text-xs font-medium">Comprobante</span>
            </div>
          </div>
        </div>
        
        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium text-foreground">{fundedPercentage}% fondeado</span>
          </div>
          <Progress value={fundedPercentage} className="h-2" />
        </div>
        
        {/* Action button */}
        <Button 
          onClick={() => navigate('/borrower-detail', { state: { borrower: { id, name, amount, interestRate, purpose, score, fundedPercentage, avatar } } })}
          className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-3 rounded-lg transition-all duration-300"
        >
          Gana {interestRate}%
        </Button>
      </div>
    </Card>
  );
};

const BorrowersListPage = () => {
  const borrowers = [
    {
      id: 1,
      name: 'Molandaki.nad',
      amount: 15000,
      interestRate: 12,
      purpose: 'Expandir negocio',
      score: 750,
      fundedPercentage: 45,
      avatar: '🚀'
    },
    {
      id: 2,
      name: 'Carlos.nad',
      amount: 8500,
      interestRate: 10,
      purpose: 'Comprar equipo',
      score: 680,
      fundedPercentage: 72,
      avatar: '💼'
    },
    {
      id: 3,
      name: 'Maria.nad',
      amount: 12000,
      interestRate: 8,
      purpose: 'Educación',
      score: 720,
      fundedPercentage: 23,
      avatar: '📚'
    },
    {
      id: 4,
      name: 'Juan.nad',
      amount: 20000,
      interestRate: 6,
      purpose: 'Vivienda',
      score: 800,
      fundedPercentage: 89,
      avatar: '🏠'
    }
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 pt-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-muted rounded-lg transition-colors mr-3 shrink-0"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-montserrat font-bold text-foreground mb-1 truncate">
                Lista de Solicitantes
              </h2>
              <h3 className="text-sm text-muted-foreground">
                Elige en quién invertir
              </h3>
            </div>
          </div>
        </div>
        
        {/* Borrowers list */}
        <div className="space-y-4">
          {borrowers.map((borrower) => (
            <BorrowerCard key={borrower.id} {...borrower} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BorrowersListPage;