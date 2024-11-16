import React, { useState } from 'react';
import { MerchantHeader } from './MerchantHeader';
import { MerchantDashboard } from '@/merchant/pages/Dashboard';
import { Button } from "@/components/ui/button";

interface MerchantLayoutProps {
  children?: React.ReactNode;
}

export const MerchantLayout = ({ children }: MerchantLayoutProps) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'sales' | 'refunds'>('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'sales':
        return (
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-4">Sales History</h2>
            <Button onClick={() => setCurrentView('dashboard')}>Back to Dashboard</Button>
          </div>
        );
      case 'refunds':
        return (
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-4">Refund Requests</h2>
            <Button onClick={() => setCurrentView('dashboard')}>Back to Dashboard</Button>
          </div>
        );
      default:
        return <MerchantDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-from-tl from-gray-100 to-blue-100">
      <MerchantHeader />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};