import { initiateUserControlledWalletsClient } from '@circle-fin/user-controlled-wallets';
import type { 
  CreateWalletResponse, 
  PaymentResponse, 
  PaymentStatus, 
  TransactionResponse 
} from './types';

interface WalletStatus {
  address: string;
  walletId: string;
  status: string;
}

interface CreatePaymentParams {
  amount: string;
  walletId: string;
  destinationAddress: string;
  userToken: string;
}

export class CircleService {
  private static instance: CircleService;
  private readonly circleClient: any;

  private constructor() {
    const apiKey = process.env.CIRCLE_API_KEY;
    if (!apiKey) {
      throw new Error('CIRCLE_API_KEY environment variable is not set');
    }

    this.circleClient = initiateUserControlledWalletsClient({ apiKey });
  }

  public static getInstance(): CircleService {
    if (!CircleService.instance) {
      CircleService.instance = new CircleService();
    }
    return CircleService.instance;
  }

  async createUserWallet(userId: string): Promise<CreateWalletResponse> {
    try {
      // 1. ユーザー作成
      await this.circleClient.createUser({
        userId,
        accountType: 'SCA'  // ドキュメントによると、EOAまたはSCAが使用可能
      });

      // 2. セッショントークン（userToken）取得
      // const { data: { userToken, encryptionKey } } = await this.circleClient.createUserToken({
      //   userId
      // });
      const res = await this.circleClient.createUserToken({
          userId
        });
      console.log(res);
      const userToken = res.data.userToken;
      const encryptionKey = res.data.encryptionKey;

      // 3. ウォレット初期化とPIN設定用のチャレンジ作成
      const { data: { challengeId } } = await this.circleClient.createUserPinWithWallets({
        userToken,
        blockchains: ['MATIC-AMOY']  // テストネット用のPolygon
      });

      console.log('User initialization data:', {
        challengeId,
        userToken,
        encryptionKeyLength: encryptionKey?.length
      });

      // 4. 必要な情報を返す
      return {
        challengeId,
        userToken,
        encryptionKey
      };
    } catch (error) {
      console.error('Failed to create wallet:', error);
      throw error;
    }
  }

  async updateWalletInfo(userToken: string): Promise<WalletStatus> {
    try {
      const { data: { wallets } } = await this.circleClient.listWallets({
        userToken
      });

      // 最初のウォレットの情報を返す
      const wallet = wallets[0];
      if (!wallet) {
        throw new Error('No wallet found');
      }

      return {
        address: wallet.address,
        walletId: wallet.id,
        status: wallet.status
      };
    } catch (error) {
      console.error('Failed to update wallet info:', error);
      throw error;
    }
  }

  /**
   * ウォレット一覧を取得する
   * @param params.userToken ユーザートークン
   */
  async listWallets(params: { userToken: string }) {
    return this.circleClient.listWallets(params);
  }

  /**
   * ウォレットのステータスを取得する
   * @param userToken ユーザートークン
   */
  async getWalletStatus(userToken: string): Promise<WalletStatus> {
    try {
      const { data: { wallets } } = await this.circleClient.listWallets({
        userToken
      });
      
      const wallet = wallets[0];
      return {
        address: wallet.address,
        walletId: wallet.id,
        status: wallet.status
      };
    } catch (error) {
      console.error('Failed to get wallet status:', error);
      throw error;
    }
  }

  /**
   * 支払いを作成する
   * @param params 支払いパラメータ
   */
  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    try {
      const { data } = await this.circleClient.createTransaction({
        userToken: params.userToken,
        amounts: [params.amount],
        destinationAddress: params.destinationAddress,
        tokenId: process.env.USDC_TOKEN_ID,
        walletId: params.walletId,
        fee: {
          type: 'level',
          config: {
            feeLevel: 'MEDIUM'
          }
        }
      });

      return {
        paymentId: data.id,
        challengeId: data.challengeId,
        status: 'pending'
      };
    } catch (error) {
      console.error('Failed to create payment:', error);
      throw error;
    }
  }

  /**
   * 支払いのステータスを取得する
   * @param paymentId 支払いID
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const { data } = await this.circleClient.getTransaction({ 
        id: paymentId 
      }) as TransactionResponse;
      
      switch (data.state) {
        case 'COMPLETE':
          return 'completed';
        case 'FAILED':
        case 'EXPIRED':
          return 'failed';
        default:
          return 'pending';
      }
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  }
}