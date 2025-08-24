import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const LoanFormPage = () => {
  const navigate = useNavigate();
  const [interestRate, setInterestRate] = useState([15]);

  const handleContinue = () => {
    navigate('/confirmations');
  };

  return (
    <div className="min-h-screen bg-background px-4 pt-8 pb-24">
      <div className="max-w-md mx-auto">
        <Card className="p-6 space-y-6 bg-card rounded-xl shadow-sm">
          <h2 className="text-2xl font-montserrat font-bold text-foreground text-center">
            Solicitud de Préstamo
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ¿Cuánto dinero necesitas?
              </label>
              <Input 
                type="number" 
                placeholder="$10,000"
                className="rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ¿Para qué lo necesitas?
              </label>
              <Input 
                placeholder="Emprender un negocio"
                className="rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Detalles adicionales
              </label>
              <Textarea 
                placeholder="Cuéntanos más sobre tu proyecto..."
                className="rounded-lg h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ingresos mensuales
              </label>
              <Input 
                type="number" 
                placeholder="$5,000"
                className="rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Egresos mensuales
              </label>
              <Input 
                type="number" 
                placeholder="$3,000"
                className="rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tasa de interés dispuesto a pagar: {interestRate[0]}%
              </label>
              <Slider
                value={interestRate}
                onValueChange={setInterestRate}
                max={35}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            <Button
              onClick={handleContinue}
              className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300"
            >
              Continuar
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoanFormPage;