import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, RefreshCw, TrendingUp } from 'lucide-react';

export const SalesOverview = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Store Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium mb-2">Today's Sales</h3>
                <p className="text-2xl font-bold text-blue-600">2,500 USDC</p>
                <p className="text-sm text-gray-500">15 transactions</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+15.3% from yesterday</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium mb-2">Pending Refunds</h3>
                <p className="text-2xl font-bold text-orange-600">3</p>
                <p className="text-sm text-gray-500">200 USDC total</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <RefreshCw className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600">
              <span>2 new requests today</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};