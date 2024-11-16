import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Clock } from 'lucide-react';
import { PaymentHandler } from './PaymentHandler';

interface QuickActionsProps {
  onActionSelect: (action: 'history') => void;
}

export const QuickActions = ({ onActionSelect }: QuickActionsProps) => {
  const [showPaymentHandler, setShowPaymentHandler] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {!showPaymentHandler ? (
          <>
            <Card
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setShowPaymentHandler(true)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <QrCode className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-medium">Scan & Pay</h3>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => onActionSelect('history')}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Clock className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-medium">Payment History</h3>
              </CardContent>
            </Card>
          </>
        ) : (
          <PaymentHandler onClose={() => setShowPaymentHandler(false)} />
        )}
      </div>
    </div>
  );
};
