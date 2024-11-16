import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export const SalesOverview = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold">Store Dashboard</h2>
    <div className="grid grid-cols-2 gap-4">
      <Card className="hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">Today's Sales</h3>
          <p className="text-2xl font-bold text-blue-600">2,500 USDC</p>
          <p className="text-sm text-gray-500">15 transactions</p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">Pending Refunds</h3>
          <p className="text-2xl font-bold text-orange-600">3</p>
          <p className="text-sm text-gray-500">200 USDC total</p>
        </CardContent>
      </Card>
    </div>
  </div>
);