import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const navigate = useNavigate();

  // Datos de deuda
  const [debtData] = useState({
    porPagar: 7000,
    pagado: 3000
  });

  // Datos de inversiones
  const [investmentData] = useState({
    totalInvested: 15500,
    averageReturn: 11.2,
    investments: [
      { id: '1', name: 'Carlos.nad', amount: 5000, expectedReturn: 12.8 },
      { id: '2', name: 'Maria.nad', amount: 3500, expectedReturn: 11.2 },
      { id: '3', name: 'Juan.nad', amount: 4000, expectedReturn: 10.5 },
      { id: '4', name: 'Ana.nad', amount: 3000, expectedReturn: 9.8 }
    ]
  });

  // Datos para gráfico de pastel
  const total = debtData.porPagar + debtData.pagado;
  const porPagarPct = ((debtData.porPagar / total) * 100).toFixed(1);
  const pagadoPct = ((debtData.pagado / total) * 100).toFixed(1);

  const pieData = [
    { name: 'Por pagar', value: debtData.porPagar, percentage: porPagarPct },
    { name: 'Pagado', value: debtData.pagado, percentage: pagadoPct }
  ];

  // Datos para gráfico lineal
  const lineData = [
    { month: 'Ene', return: 8.5 },
    { month: 'Feb', return: 9.2 },
    { month: 'Mar', return: 10.1 },
    { month: 'Abr', return: 11.0 },
    { month: 'May', return: 11.2 },
    { month: 'Jun', return: 12.5 }
  ];

  const COLORS = ['hsl(var(--monad-purple))', 'hsl(var(--muted))'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-montserrat font-bold text-foreground">{data.name}</p>
          <p className="text-monad-purple font-bold">${data.value.toLocaleString()}</p>
          <p className="text-muted-foreground">{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const LineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-montserrat font-bold">{label}</p>
          <p className="text-monad-purple font-bold">{payload[0].value}% retorno</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-8">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-montserrat font-bold text-foreground mb-2">
            Dashboard LOANAD
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus finanzas DeFi
          </p>
        </div>

        {/* Sección Deuda */}
        <Card className="p-6 bg-card rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-montserrat font-bold text-foreground">
              Deuda
            </h2>
            <Button 
              onClick={() => navigate('/loan-form')}
              className="bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold px-4 py-2 rounded-lg"
            >
              Pedir prestado
            </Button>
          </div>
          <h3 className="text-sm text-muted-text mb-6">
            Los préstamos solicitados
          </h3>
          
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-1">Monto total</p>
            <p className="text-3xl font-bold text-foreground">
              ${(debtData.porPagar + debtData.pagado).toLocaleString()}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Por pagar</p>
              <p className="text-2xl font-bold text-monad-purple">
                ${debtData.porPagar.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Pagado</p>
              <p className="text-2xl font-bold text-foreground">
                ${debtData.pagado.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sección Inversiones */}
        <Card className="p-6 bg-card rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-montserrat font-bold text-foreground">
              Inversiones
            </h2>
            <Button 
              onClick={() => navigate('/borrowers-list')}
              className="bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold px-4 py-2 rounded-lg"
            >
              Dar prestado
            </Button>
          </div>
          <h3 className="text-sm text-muted-text mb-6">
            Los préstamos que has otorgado
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Monto total invertido</p>
              <p className="text-2xl font-bold text-monad-purple">
                ${investmentData.totalInvested.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Tasa promedio</p>
              <p className="text-2xl font-bold text-foreground">
                {investmentData.averageReturn}%
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="text-lg font-montserrat font-bold text-foreground">
              Préstamos activos
            </h4>
            {investmentData.investments.map((investment) => (
              <div key={investment.id} className="bg-card-background p-3 rounded-lg border border-border/30">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-montserrat font-bold text-foreground text-sm">
                      {investment.name}
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      ${investment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-monad-purple font-bold text-sm">
                      {investment.expectedReturn}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      retorno
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-48">
            <h4 className="text-sm font-montserrat font-bold text-foreground mb-3">
              Rendimiento proyectado
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip content={<LineTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="return" 
                  stroke="hsl(var(--monad-purple))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--monad-purple))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--monad-purple))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Button 
          onClick={() => navigate('/')}
          className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300"
        >
          Regresar a Inicio
          <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;