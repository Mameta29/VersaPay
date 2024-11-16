import React from 'react';
import { QuickActions } from '../components/payment/QuickActions';
import { TransactionCard } from '../components/payment/TransactionCard';

export const CustomerDashboard = () => (
  <div className="grid md:grid-cols-2 gap-8">
    <QuickActions onActionSelect={(action) => console.log(action)} />
    
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Recent Transactions</h2>
      <div className="space-y-4">
        <TransactionCard
          type="payment"
          amount="500 USDC"
          date="2024.03.15"
          status="completed"
          merchant="Coffee Shop"
        />
        <TransactionCard
          type="refund"
          amount="200 USDC"
          date="2024.03.14"
          status="pending"
          merchant="Electronics Store"
        />
      </div>
    </div>
  </div>
);