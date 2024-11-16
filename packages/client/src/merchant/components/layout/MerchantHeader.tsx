import React from 'react';
import { Button } from "@/components/ui/button";
import { Store, Settings } from 'lucide-react';

export const MerchantHeader = () => (
  <header className="border-b">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Store className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-600">VersaPay Merchant</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button variant="outline">Connect Wallet</Button>
      </div>
    </div>
  </header>
);