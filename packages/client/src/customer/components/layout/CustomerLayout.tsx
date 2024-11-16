import React, { useState } from 'react';
import { CustomerHeader } from './CustomerHeader';
import { CustomerDashboard } from '../../pages/Dashboard';
import { Button } from "@/components/ui/button";

interface CustomerLayoutProps {
  children?: React.ReactNode;
}

export const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  const [currentView, setCurrentView] = useState<'home' | 'pay' | 'history'>('home');

  const renderContent = () => {
    switch (currentView) {
      case 'pay':
        return (
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-4">Scan QR Code to Pay</h2>
            <div className="mb-4">
              <p>QRコードスキャナーがここに表示されます</p>
            </div>
            <Button onClick={() => setCurrentView('home')}>Back to Home</Button>
          </div>
        );
      case 'history':
        return (
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            <div className="space-y-4">
              {/* 履歴の詳細表示 */}
              <h3>履歴詳細</h3>
            </div>
            <Button onClick={() => setCurrentView('home')}>Back to Home</Button>
          </div>
        );
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-from-tl from-blue-100 to-violet-100">
      <CustomerHeader />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};