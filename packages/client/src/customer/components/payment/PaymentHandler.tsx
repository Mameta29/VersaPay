import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface PaymentDetails {
  type: string;
  amount: string;
  destinationAddress: string;
  network: string;
  timestamp: number;
}

interface PaymentHandlerProps {
  onClose: () => void;
}

export const PaymentHandler: React.FC<PaymentHandlerProps> = ({ onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (scanning) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        false
      );

      scanner.render(handleQRCodeScan, handleQRCodeError);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanning]);

  const handleQRCodeScan = async (decodedText: string) => {
    try {
      // QRコードのURLからデータ部分を抽出
      const url = new URL(decodedText);
      const encodedData = url.searchParams.get('data');
      if (!encodedData) throw new Error('Invalid QR code format');

      // データをデコードしてJSONとしてパース
      const paymentInfo = JSON.parse(decodeURIComponent(encodedData));
      
      if (paymentInfo.type === 'versapay_payment') {
        setScanning(false);
        setPaymentDetails(paymentInfo);
      } else {
        setError('Invalid QR code format');
      }
    } catch (error) {
      console.error('QR code scan error:', error);
      setError('Could not read QR code');
    }
  };

  const handleQRCodeError = (error: any) => {
    console.warn(error);
  };

  const renderContent = () => {
    if (scanning) {
      return (
        <div className="space-y-4">
          <div id="qr-reader" className="w-full max-w-sm mx-auto" />
          <div className="text-center">
            <Button variant="outline" onClick={() => setScanning(false)}>
              Cancel Scan
            </Button>
          </div>
        </div>
      );
    }

    if (paymentDetails) {
      const displayAddress = paymentDetails.destinationAddress
        ? `${paymentDetails.destinationAddress.slice(0, 6)}...${paymentDetails.destinationAddress.slice(-4)}`
        : 'Invalid Address';

      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Confirm Payment</h3>
          
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">{paymentDetails.amount} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To:</span>
              <span className="font-medium">{displayAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-medium">{paymentDetails.network}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayment} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Scan QR Code to Pay</h3>
        <p className="text-gray-600">Position the QR code within the frame to scan</p>
        <Button onClick={() => setScanning(true)}>
          Start Scanning
        </Button>
      </div>
    );
  };


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
};