export interface PaymentLinkParams {
    amount: string;
    merchantId: string;
    currency?: string;
    description?: string;
  }
  
  export interface PaymentLink {
    id: string;
    url: string;
    qrCode: string;
    amount: string;
    status: 'active' | 'expired' | 'completed';
    expiresAt: string;
  }
  
  export class PaymentService {
    private static instance: PaymentService;
    
    private constructor() {}
  
    public static getInstance(): PaymentService {
      if (!PaymentService.instance) {
        PaymentService.instance = new PaymentService();
      }
      return PaymentService.instance;
    }
  
    async generatePaymentLink(params: PaymentLinkParams): Promise<PaymentLink> {
      try {
        // TODO: Circle APIを使用して実際のペイメントリンクを生成
        // 現在はモックデータを返す
        return {
          id: `pmt_${Math.random().toString(36).substr(2, 9)}`,
          url: `versapay://payment?amount=${params.amount}&merchant=${params.merchantId}`,
          qrCode: 'data:image/png;base64,...', // QRコードのBase64エンコードデータ
          amount: params.amount,
          status: 'active',
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分後
        };
      } catch (error) {
        console.error('Failed to generate payment link:', error);
        throw new Error('Failed to generate payment link');
      }
    }
  
    async getPaymentStatus(paymentId: string): Promise<'pending' | 'completed' | 'failed'> {
      try {
        // TODO: Circle APIを使用して実際の支払い状態を取得
        return 'pending';
      } catch (error) {
        console.error('Failed to get payment status:', error);
        throw new Error('Failed to get payment status');
      }
    }
  }