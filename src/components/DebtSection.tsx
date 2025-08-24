import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DebtData {
  porPagar: number;
  pagado: number;
}

interface DebtSectionProps {
  data: DebtData;
}

const DebtSection = ({ data }: DebtSectionProps) => {
  const total = data.porPagar + data.pagado;
  const pagadoPct = ((data.pagado / total) * 100).toFixed(1);

  const chartData = [
    { name: 'Monto Financiado', value: data.pagado, percentage: pagadoPct }
  ];

  const COLORS = ['hsl(var(--monad-purple))', 'hsl(var(--muted))'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-card-foreground">{data.name}</p>
          <p className="text-monad-purple font-bold">${data.value.toLocaleString()}</p>
          <p className="text-muted-foreground">{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-2">Deuda</h2>
      <h3 className="text-sm text-muted-text mb-6">Los préstamos solicitados</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Por pagar</p>
          <p className="text-2xl font-bold text-monad-purple">
            ${data.porPagar.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Pagado</p>
          <p className="text-2xl font-bold text-foreground">
            ${data.pagado.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
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
    </div>
  );
};

export default DebtSection;