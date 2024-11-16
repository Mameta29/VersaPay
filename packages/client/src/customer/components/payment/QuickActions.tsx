import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Clock } from 'lucide-react';

interface QuickActionsProps {
  onActionSelect: (action: 'pay' | 'history') => void;
}

export const QuickActions = ({ onActionSelect }: QuickActionsProps) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold">Quick Actions</h2>
    <div className="grid grid-cols-2 gap-4">
      <Card 
        className="hover:shadow-lg transition-all cursor-pointer" 
        onClick={() => onActionSelect('pay')}
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
    </div>
  </div>
);