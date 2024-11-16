export interface CreateWalletResponse {
  challengeId: string;
  userToken: string;
  encryptionKey: string;
}

export interface WalletStatus {
  address: string;
  walletId: string;
  status: string;
}

  export interface PaymentResponse {
    paymentId: string;
    challengeId: string;
    status: PaymentStatus;
  }
  
  export type PaymentStatus = 'pending' | 'completed' | 'failed';
  
  export interface CircleTransaction {
    id: string;
    state: 'PENDING' | 'COMPLETE' | 'FAILED' | 'EXPIRED';
    amount: string;
    tokenId: string;
    sourceAddress: string;
    destinationAddress: string;
    createDate: string;
    updateDate: string;
  }
  
  export interface TransactionResponse {
    data: CircleTransaction;
  }