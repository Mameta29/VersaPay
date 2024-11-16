import React, { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Store, Settings, Loader2 } from 'lucide-react';
import { useMerchantStore } from '@/store/merchant';

export const MerchantHeader = () => {
  const [connecting, setConnecting] = useState(false);
  const [showWalletInput, setShowWalletInput] = useState(false);
  const [walletInput, setWalletInput] = useState('');
  const { isConnected, walletAddress, setWalletInfo, disconnect } = useMerchantStore();

  const handleConnect = async () => {
    if (isConnected) {
      disconnect();
      return;
    }

    setShowWalletInput(true);
  };

  const handleWalletSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConnecting(true);
    
    try {
      // コントラクトアドレスの妥当性チェック
      if (!/^0x[a-fA-F0-9]{40}$/.test(walletInput)) {
        throw new Error('Invalid wallet address format');
      }
      
      // ここで直接コントラクトアドレスを設定
      // 注意: 実際の環境では適切な検証を追加してください
      setWalletInfo(walletInput);
      setShowWalletInput(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please check the address and try again.');
    } finally {
      setConnecting(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWalletInput(e.target.value);
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Store className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-600">VersaPay Merchant</h1>
        </div>
        <div className="flex items-center gap-4">
          {showWalletInput ? (
            <form onSubmit={handleWalletSubmit} className="flex gap-2">
              <input
                type="text"
                value={walletInput}
                onChange={handleInputChange}
                placeholder="Enter contract address"
                className="flex-1 p-2 border rounded w-64"
              />
              <Button type="submit" disabled={connecting}>
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowWalletInput(false)}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <>
              {isConnected && (
                <div className="text-sm text-gray-600">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </div>
              )}
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button 
                variant={isConnected ? "outline" : "default"}
                onClick={handleConnect}
              >
                {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};