// packages/client/src/customer/components/layout/CustomerHeader.tsx
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from 'lucide-react';
import { apiClient, WalletResponse } from "@/lib/api-client";
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';

export const CustomerHeader = () => {
  const [walletInfo, setWalletInfo] = useState<WalletResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sdk, setSdk] = useState<W3SSdk | null>(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        console.log('Initializing Circle SDK...');
        const newSdk = new W3SSdk({
          appSettings: {
            appId: import.meta.env.VITE_CIRCLE_APP_ID
          },
        });
        
        setSdk(newSdk);
        setIsInitialized(true);
        console.log('Circle SDK initialized successfully');

        const storedWalletInfo = localStorage.getItem('walletInfo');
        if (storedWalletInfo) {
          const parsedWalletInfo = JSON.parse(storedWalletInfo);
          setWalletInfo(parsedWalletInfo);
          
          newSdk.setAuthentication({
            userToken: parsedWalletInfo.userToken,
            encryptionKey: parsedWalletInfo.encryptionKey,
          });
        }
      } catch (error) {
        console.error("Failed to initialize Circle SDK:", error);
      }
    };

    initializeSDK();
  }, []);

  const handleCreateWallet = async () => {
    try {
      const userId = `customer_${Math.random().toString(36).slice(2)}`;
      setIsLoading(true);
  
      const walletInfo = await apiClient.createUser(userId);
      setWalletInfo(walletInfo);
      localStorage.setItem('walletInfo', JSON.stringify(walletInfo));
      console.log('Wallet created:', walletInfo);
  
      if (!sdk) throw new Error('SDK not initialized');
  
      sdk.setAuthentication({
        userToken: walletInfo.userToken,
        encryptionKey: walletInfo.encryptionKey,
      });
  
      // PIN設定の処理
      await new Promise<void>((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 30; // 最大試行回数
        const checkInterval = 2000; // チェック間隔（ミリ秒）
  
        const handlePinSetup = async (error: any, result: any) => {
          if (error) {
            console.error("PIN setup error:", error);
            reject(error);
            return;
          }
  
          console.log('PIN set result:', result);
          console.log('PIN set status:', result.status);
  
          switch (result.status) {
            case 'IN_PROGRESS':
              // ステータスをポーリング
              attempts++;
              if (attempts >= maxAttempts) {
                reject(new Error('PIN setup timeout'));
                return;
              }
              console.log(`Polling attempt ${attempts}/${maxAttempts}`);
              setTimeout(() => {
                sdk?.execute(walletInfo.challengeId, handlePinSetup);
              }, checkInterval);
              break;
            
            case 'COMPLETE':
              try {
                console.log('PIN setup completed');
                const status = await apiClient.listWallets(walletInfo.userToken);
                const updatedWalletInfo = {
                  ...walletInfo,
                  ...status
                };
                console.log('Wallet status:', updatedWalletInfo);
                setWalletInfo(updatedWalletInfo);
                localStorage.setItem('walletInfo', JSON.stringify(updatedWalletInfo));
                resolve();
              } catch (error) {
                reject(error);
              }
              break;
  
            case 'FAILED':
              console.error('PIN setup failed');
              reject(new Error('PIN setup failed'));
              break;
  
            default:
              console.log(`Unhandled PIN setup status: ${result.status}`);
              // 未知のステータスの場合もポーリングを継続
              attempts++;
              if (attempts >= maxAttempts) {
                reject(new Error('PIN setup timeout'));
                return;
              }
              setTimeout(() => {
                sdk?.execute(walletInfo.challengeId, handlePinSetup);
              }, checkInterval);
              break;
          }
        };
  
        // 初回実行
        sdk.execute(walletInfo.challengeId, handlePinSetup);
      });
  
    } catch (error) {
      console.error("Failed to create wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // フォーマット関数は変更なし
  const formatAddress = (address?: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // レンダリング部分は変更なし
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Wallet className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-600">VersaPay</h1>
        </div>
        <div>
          <Button 
            variant="outline" 
            onClick={handleCreateWallet}
            disabled={isLoading || !isInitialized}
          >
            {isLoading ? "Creating..." : 
             walletInfo?.address ? `Wallet: ${formatAddress(walletInfo.address)}` : 
             "Create Wallet"}
          </Button>
          {!isInitialized && (
            <p className="text-sm text-red-500 mt-1">SDK not initialized</p>
          )}
        </div>
      </div>
    </header>
  );
};