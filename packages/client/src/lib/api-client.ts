// packages/client/src/lib/api-client.ts

export interface WalletResponse {
  challengeId: string;
  userToken: string;
  encryptionKey: string;
  address?: string;
  walletId?: string;
}

export interface PaymentResponse {
  paymentId: string;
  challengeId: string;
  status: 'pending' | 'completed' | 'failed';
}

export const apiClient = {
  createUser: async (userId: string): Promise<WalletResponse> => {
    const response = await fetch('http://localhost:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  initializeWallet: async (userToken: string): Promise<any> => {
    const response = await fetch('http://localhost:8000/api/user/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({ userToken }),
    });
    if (!response.ok) throw new Error('Failed to initialize wallet');
    return response.json();
  },

  listWallets: async (userToken: string) => {
    const response = await fetch('http://localhost:8000/api/wallet/status', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to get wallets');
    return response.json();
  },

  createPayment: async (params: {
    amount: string;
    walletId: string;
    destinationAddress: string;
    userToken: string;
  }): Promise<PaymentResponse> => {
    const response = await fetch('http://localhost:8000/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${params.userToken}`,
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error('Failed to create payment');
    return response.json();
  },

  getPaymentStatus: async (paymentId: string): Promise<'pending' | 'completed' | 'failed'> => {
    const response = await fetch(`http://localhost:8000/api/payment/${paymentId}/status`);
    if (!response.ok) throw new Error('Failed to get payment status');
    const { status } = await response.json();
    return status;
  },
};