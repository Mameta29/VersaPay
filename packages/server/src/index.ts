import express from 'express';
import type { Express, Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CircleService } from './services/circle/circle.service';

dotenv.config();

const app: Express = express();

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// インターフェース定義
interface CreateUserRequest extends Request {
  body: { userId: string }
}

interface WalletStatusRequest extends Request {
  headers: {
    authorization?: string;
  }
}

// ルートハンドラー
const createUser: RequestHandler = async (req: CreateUserRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    const circleService = CircleService.getInstance();
    const result = await circleService.createUserWallet(userId);
    res.json(result);
  } catch (error) {
    console.error('Failed to create user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const getWalletStatus: RequestHandler = async (req: WalletStatusRequest, res: Response): Promise<void> => {
  try {
    const userToken = req.headers.authorization?.replace('Bearer ', '');
    if (!userToken) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const circleService = CircleService.getInstance();
    const status = await circleService.updateWalletInfo(userToken);
    res.json(status);
  } catch (error) {
    console.error('Failed to get wallet status:', error);
    res.status(500).json({ error: 'Failed to get wallet status' });
  }
};

// ルートの設定
app.post('/api/users', createUser);
app.get('/api/wallet/status', getWalletStatus);

// サーバーの起動
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;