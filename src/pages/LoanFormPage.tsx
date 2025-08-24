import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Paperclip, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const LoanFormPage = () => {
  const navigate = useNavigate();
  const [interestRate, setInterestRate] = useState([15]);
  const [documentUploaded, setDocumentUploaded] = useState(false);

  const handleContinue = () => {
    navigate('/confirmations');
  };

  const handleDocumentUpload = () => {
    setDocumentUploaded(true);
  };

  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-8">
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
              onClick={handleDocumentUpload}
              variant={documentUploaded ? "secondary" : "outline"}
              className="w-full rounded-lg py-6"
            >
              <Paperclip className="mr-2" size={20} />
              {documentUploaded ? "Comprobante subido" : "Sube tu comprobante"}
            </Button>

            <Button 
              variant="outline"
              className="w-full rounded-lg py-6"
            >
              <User className="mr-2" size={20} />
              Realiza tu KYC
            </Button>

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