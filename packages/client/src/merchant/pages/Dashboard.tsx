import React from 'react';
import { SalesOverview } from '../components/dashboard/SalesOverview';
import { TransactionList } from '../components/dashboard/TransactionList';
import { QRGenerator } from '../components/payment/QRGenerator';

export const MerchantDashboard = () => {
  const handlePaymentGenerate = async (amount: string) => {
    try {
      // TODO: ここでPaymentServiceを使用してQRコードを生成
      console.log('Generating payment for amount:', amount);
    } catch (error) {
      console.error('Failed to handle payment generation:', error);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <SalesOverview />
        <QRGenerator onGenerate={handlePaymentGenerate} />
      </div>
      <TransactionList />
    </div>
  );
};