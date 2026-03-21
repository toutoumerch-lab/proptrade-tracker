import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        trades: true,
        _count: {
          select: { trades: true }
        }
      }
    });

    const enrichedAccounts = await Promise.all(accounts.map(async (acc: any) => {
      let totalPnl = 0;
      let dailyPnl = 0;
      const today = new Date().toISOString().split('T')[0];

      acc.trades.forEach((t: any) => {
        if (t.pnl) {
          totalPnl += t.pnl;
          if (t.closedAt && t.closedAt.toISOString().split('T')[0] === today) {
            dailyPnl += t.pnl;
          }
        }
      });

      const current_loss = dailyPnl < 0 ? Math.abs(dailyPnl) : 0;
      const current_drawdown = totalPnl < 0 ? Math.abs(totalPnl) : 0;
      
      const drawdown_usage = acc.totalDrawdownLimit > 0 ? (current_drawdown / acc.totalDrawdownLimit) : 0;
      const daily_loss_usage = acc.dailyLimit > 0 ? (current_loss / acc.dailyLimit) : 0;

      let status = 'ACTIVE';
      if (drawdown_usage >= 0.85 || daily_loss_usage >= 1.0) {
         status = 'BREACHED';
      } else if (drawdown_usage >= 0.60 || daily_loss_usage >= 0.60) {
         status = 'AT_RISK';
      }

      const { trades, ...accountData } = acc;

      const eod = new Date();
      eod.setHours(0,0,0,0);
      
      if (drawdown_usage >= 0.9) {
        const found = await prisma.alert.findFirst({ where: { userId, title: 'Critical Drawdown', createdAt: { gte: eod } } });
        if (!found) await prisma.alert.create({ data: { userId, type: 'CRITICAL', title: 'Critical Drawdown', message: `Account ${acc.firmName} has crossed 90% drawdown threshold.` }});
      } else if (drawdown_usage >= 0.7) {
        const found = await prisma.alert.findFirst({ where: { userId, title: 'Drawdown Warning', createdAt: { gte: eod } } });
        if (!found) await prisma.alert.create({ data: { userId, type: 'WARNING', title: 'Drawdown Warning', message: `Account ${acc.firmName} has crossed 70% drawdown threshold.` }});
      }

      return {
        ...accountData,
        currentDrawdown: current_drawdown,
        currentDailyLoss: current_loss,
        totalDrawdown: acc.totalDrawdownLimit,
        status
      };
    }));

    res.json(enrichedAccounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching accounts' });
  }
};

export const createAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { firmName, firmCode, phase, balance, dailyLimit, totalDrawdownLimit, target } = req.body;

    const newAccount = await prisma.account.create({
      data: {
        userId,
        firmName,
        firmCode,
        phase: phase || 'Funded',
        balance: Number(balance),
        dailyLimit: Number(dailyLimit),
        totalDrawdownLimit: Number(totalDrawdownLimit),
        target: target ? Number(target) : null,
      },
    });

    res.status(201).json(newAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating account' });
  }
};

export const getAccountStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    
    // Aggregate some stats - e.g. sum of balances
    const stats = await prisma.account.aggregate({
      where: { userId },
      _sum: {
        balance: true,
      },
      _count: {
        id: true,
      }
    });

    res.json({
      totalBalance: stats._sum.balance || 0,
      activeAccounts: stats._count.id || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching account stats' });
  }
};
