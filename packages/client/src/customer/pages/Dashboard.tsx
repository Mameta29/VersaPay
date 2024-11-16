import { QuickActions } from '../components/payment/QuickActions';
import { TransactionCard } from '../components/payment/TransactionCard';

export const CustomerDashboard = () => {
  const handleActionSelect = (action: 'history') => {
    if (action === 'history') {
      console.log("Navigate to Payment History");
      // 必要に応じて履歴画面への遷移ロジックを追加
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <QuickActions onActionSelect={handleActionSelect} />

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <div className="space-y-4">
          <TransactionCard
            type="payment"
            amount="500 USDC"
            date="2024.03.15"
            status="completed"
            merchant="Coffee Shop"
          />
          <TransactionCard
            type="refund"
            amount="200 USDC"
            date="2024.03.14"
            status="pending"
            merchant="Electronics Store"
          />
        </div>
      </div>
    </div>
  );
};
