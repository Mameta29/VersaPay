import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from 'lucide-react';

export const CustomerHeader = () => (
  <header className="border-b">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Wallet className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-600">VersaPay</h1>
      </div>
      <Button variant="outline" className="flex items-center gap-2">
        Connect Wallet
      </Button>
    </div>
  </header>
);