import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, RefreshCw } from 'lucide-react';

interface TransactionCardProps {
  type: 'payment' | 'refund';
  amount: string;
  date: string;
  status: 'completed' | 'pending';
  merchant: string;
}

export const TransactionCard = ({ type, amount, date, status, merchant }: TransactionCardProps) => (
  <Card>
    <CardContent className="p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${
          type === 'payment' ? 'bg-blue-100' : 'bg-orange-100'
        }`}>
          {type === 'payment' ? (
            <ArrowLeftRight className="h-5 w-5 text-blue-600" />
          ) : (
            <RefreshCw className="h-5 w-5 text-orange-600" />
          )}
        </div>
        <div>
          <p className="font-medium">{merchant}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{amount}</p>
        <p className={`text-sm ${
          status === 'completed' ? 'text-green-600' : 'text-orange-600'
        }`}>
          {status}
        </p>
      </div>
    </CardContent>
  </Card>
);