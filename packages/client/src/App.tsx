import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CustomerLayout } from "./customer/components/layout/CustomerLayout";
import { MerchantLayout } from "./merchant/components/layout/MerchantLayout";

const App = () => {
  const [userType, setUserType] = useState<'customer' | 'merchant'>('customer');

  return (
    <div>
      <div className="fixed top-0 right-0 p-4 z-50">
        <Button onClick={() => setUserType(userType === 'customer' ? 'merchant' : 'customer')}>
          Switch to {userType === 'customer' ? 'Merchant' : 'Customer'} View
        </Button>
      </div>
      {userType === 'customer' ? <CustomerLayout /> : <MerchantLayout />}
    </div>
  );
};

export default App;