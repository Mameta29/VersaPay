import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, CreditCard } from 'lucide-react';

interface TransactionCardProps {
  customer: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending';
  type: 'payment' | 'refund';
}

const MerchantTransactionCard = ({ customer, amount, date, status, type }: TransactionCardProps) => (
  <Card>
    <CardContent className="p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${
          status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
        }`}>
          {type === 'refund' ? (
            <RefreshCw className="h-5 w-5 text-orange-600" />
          ) : (
            <CreditCard className="h-5 w-5 text-green-600" />
          )}
        </div>
        <div>
          <p className="font-medium">{customer}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{amount}</p>
        <p className={`text-sm ${
          status === 'completed' ? 'text-green-600' : 'text-yellow-600'
        }`}>
          {status}
        </p>
      </div>
    </CardContent>
  </Card>
);

export const TransactionList = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold">Recent Transactions</h2>
    <div className="space-y-4">
      <MerchantTransactionCard
        customer="Wallet ...5fa3"
        amount="500 USDC"
        date="2024.03.15 15:30"
        status="completed"
        type="payment"
      />
      <MerchantTransactionCard
        customer="Wallet ...8dc1"
        amount="200 USDC"
        date="2024.03.15 14:45"
        status="pending"
        type="refund"
      />
      <MerchantTransactionCard
        customer="Wallet ...2ef7"
        amount="150 USDC"
        date="2024.03.15 13:20"
        status="completed"
        type="payment"
      />
    </div>
  </div>
);