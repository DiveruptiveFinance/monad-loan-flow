import { useNavigate } from 'react-router-dom';
import { CheckCircle, TrendingUp } from 'lucide-react';
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
    <Card className="p-4 bg-card-background shadow-sm rounded-xl border border-border/50 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-monad-purple/20 to-monad-purple/40 rounded-xl flex items-center justify-center text-2xl">
          {avatar}
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-montserrat font-bold text-foreground text-lg">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">
                ${amount.toLocaleString()} - {purpose}
              </p>
            </div>
            <div className="bg-monad-purple text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              ID:{id}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp size={16} className="text-monad-purple" />
              <span className="font-medium">Score: {score}</span>
            </div>
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-600 font-medium">KYC</span>
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-green-600 font-medium">Comprobante</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso</span>
              <span className="font-medium">{fundedPercentage}% fondeado</span>
            </div>
            <Progress value={fundedPercentage} className="h-2" />
          </div>
          
          <Button 
            onClick={() => navigate('/borrower-detail', { state: { borrower: { id, name, amount, interestRate, purpose, score, fundedPercentage, avatar } } })}
            className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-3 rounded-lg transition-all duration-300"
          >
            Gana {interestRate}%
          </Button>
        </div>
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

  return (
    <div className="min-h-screen bg-background px-4 pt-8 pb-24">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-montserrat font-bold text-foreground mb-2">
            Lista de Solicitantes
          </h2>
          <h3 className="text-sm text-muted-text">
            Elige en quién invertir
          </h3>
        </div>
        
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