import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MerchantState {
  walletAddress: string | null;
  isConnected: boolean;
  setWalletInfo: (walletAddress: string) => void;
  disconnect: () => void;
}

export const useMerchantStore = create<MerchantState>()(
  persist(
    (set) => ({
      walletAddress: null,
      isConnected: false,
      setWalletInfo: (walletAddress) => 
        set({ walletAddress, isConnected: true }),
      disconnect: () => 
        set({ walletAddress: null, isConnected: false }),
    }),
    {
      name: 'merchant-storage',
    }
  )
);