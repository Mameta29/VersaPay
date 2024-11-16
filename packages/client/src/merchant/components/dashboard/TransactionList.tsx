import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, CreditCard, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  customer: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending';
  type: 'payment' | 'refund';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    customer: 'Wallet ...5fa3',
    amount: '500 USDC',
    date: '2024.03.15 15:30',
    status: 'completed',
    type: 'payment'
  },
  {
    id: '2',
    customer: 'Wallet ...8dc1',
    amount: '200 USDC',
    date: '2024.03.15 14:45',
    status: 'pending',
    type: 'refund'
  },
  {
    id: '3',
    customer: 'Wallet ...2ef7',
    amount: '150 USDC',
    date: '2024.03.15 13:20',
    status: 'completed',
    type: 'payment'
  }
];

const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
  <Card>
    <CardContent className="p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${
          transaction.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
        }`}>
          {transaction.type === 'refund' ? (
            <RefreshCw className="h-5 w-5 text-orange-600" />
          ) : (
            <CreditCard className="h-5 w-5 text-green-600" />
          )}
        </div>
        <div>
          <p className="font-medium">{transaction.customer}</p>
          <p className="text-sm text-gray-500">{transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{transaction.amount}</p>
        <p className={`text-sm ${
          transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
        }`}>
          {transaction.status}
        </p>
      </div>
    </CardContent>
  </Card>
);

export const TransactionList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions"
              className="pl-8 pr-4 py-2 border rounded-md text-sm"
            />
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_TRANSACTIONS.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
};