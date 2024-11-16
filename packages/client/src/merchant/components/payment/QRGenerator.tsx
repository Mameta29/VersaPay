import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Copy, Check, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
    onGenerate?: (amount: string) => void;
    walletAddress: string;
  }

export const QRGenerator = ({ onGenerate, walletAddress }: QRGeneratorProps) => {
  const [amount, setAmount] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    link: string;
    qrData: string;
  } | null>(null);

  const generateQR = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsGenerating(true);
    try {
      // QRコードに含めるデータを生成
      const paymentInfo = {
        type: 'versapay_payment',
        amount,
        destinationAddress: walletAddress,
        network: 'MATIC-AMOY',
        timestamp: Date.now()
      };

      const qrData = JSON.stringify(paymentInfo);
      const paymentLink = `versapay://payment?data=${encodeURIComponent(qrData)}`;

      setPaymentData({
        link: paymentLink,
        qrData
      });
      
      onGenerate?.(amount);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (paymentData?.link) {
      await navigator.clipboard.writeText(paymentData.link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Generate Payment QR</h3>
        
        <div className="flex gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in USDC"
            className="flex-1 p-2 border rounded"
            min="0"
            step="0.01"
          />
          <Button 
            onClick={generateQR}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <QrCode className="h-4 w-4" />
            )}
            Generate QR
          </Button>
        </div>

        {paymentData && (
          <div className="mt-4 space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
              <QRCodeSVG
                value={paymentData.qrData}
                size={192}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={paymentData.link}
                readOnly
                className="flex-1 p-2 border rounded bg-gray-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};