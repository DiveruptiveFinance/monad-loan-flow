import { useState } from 'react';
import DebtSection from '@/components/DebtSection';
import InvestmentsSection from '@/components/InvestmentsSection';

const Dashboard = () => {
  // Datos de ejemplo para la deuda
  const [debtData] = useState({
    porPagar: 15000,
    pagado: 5000
  });

  // Datos de ejemplo para las inversiones
  const [investmentData] = useState({
    totalInvested: 45000,
    averageReturn: 12.5,
    investments: [
      {
        id: '1',
        borrowerName: 'carlos.nad',
        amount: 15000,
        expectedReturn: 12.8
      },
      {
        id: '2',
        borrowerName: 'maria.nad',
        amount: 8500,
        expectedReturn: 11.2
      },
      {
        id: '3',
        borrowerName: 'juan.nad',
        amount: 12000,
        expectedReturn: 13.5
      },
      {
        id: '4',
        borrowerName: 'ana.nad',
        amount: 9500,
        expectedReturn: 10.8
      }
    ]
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard LOANAD
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus préstamos e inversiones de manera inteligente
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-in fade-in-50 duration-500">
            <DebtSection data={debtData} />
          </div>
          
          <div className="animate-in fade-in-50 duration-700">
            <InvestmentsSection 
              totalInvested={investmentData.totalInvested}
              averageReturn={investmentData.averageReturn}
              investments={investmentData.investments}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;