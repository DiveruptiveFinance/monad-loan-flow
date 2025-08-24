interface InvestmentCardProps {
  borrowerName: string;
  amount: number;
  expectedReturn: number;
}

const InvestmentCard = ({ borrowerName, amount, expectedReturn }: InvestmentCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-monad-purple/30">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground text-sm mb-1">
            {borrowerName}
          </h4>
          <p className="text-muted-foreground text-xs mb-2">
            Solicitante
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-monad-purple text-lg">
            ${amount.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {expectedReturn}% retorno estimado
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;