import React from 'react';
import { SalesOverview } from '../components/dashboard/SalesOverview';
import { TransactionList } from '../components/dashboard/TransactionList';
import { QRGenerator } from '../components/payment/QRGenerator';
import { useMerchantStore } from '@/store/merchant';

export const MerchantDashboard = () => {
  const { isConnected, walletAddress } = useMerchantStore();

  const handlePaymentGenerate = async (amount: string) => {
    try {
      console.log('Generating payment for amount:', amount);
    } catch (error) {
      console.error('Failed to handle payment generation:', error);
    }
  };

  if (!isConnected || !walletAddress) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-semibold mb-4">Connect Wallet to Continue</h2>
        <p className="text-gray-600">
          Please connect your wallet to access the merchant dashboard and generate payment QR codes.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <SalesOverview />
        <QRGenerator 
          onGenerate={handlePaymentGenerate}
          walletAddress={walletAddress}
        />
      </div>
      <TransactionList />
    </div>
  );
};