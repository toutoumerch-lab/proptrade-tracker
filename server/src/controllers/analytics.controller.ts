import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAnalyticsSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const accounts = await prisma.account.findMany({
      where: { userId },
      include: { trades: true }
    });

    let totalEquity = 0;
    let totalPnl = 0;
    let totalRisk = 0;
    let activeAccounts = 0;
    
    accounts.forEach(acc => {
      totalEquity += acc.balance;
      totalRisk += acc.totalDrawdownLimit;
      let accountTotalPnl = 0;
      acc.trades.forEach(trade => {
        if (trade.pnl) {
          totalPnl += trade.pnl;
          accountTotalPnl += trade.pnl;
        }
      });
      
      const current_drawdown = accountTotalPnl < 0 ? Math.abs(accountTotalPnl) : 0;
      const drawdown_usage = acc.totalDrawdownLimit > 0 ? (current_drawdown / acc.totalDrawdownLimit) : 0;
      const status = drawdown_usage >= 0.85 ? 'BREACHED' : (drawdown_usage >= 0.60 ? 'AT_RISK' : 'ACTIVE');

      if (status === 'ACTIVE') activeAccounts++;
    });

    res.json({
      totalEquity,
      totalPnl,
      dailyPnl: totalPnl, // Appromixation for demo purposes
      totalRisk,
      activeAccounts,
      equityChange: 0,
      dailyPnlPositions: 0,
      totalRiskPct: totalEquity > 0 ? ((totalRisk / totalEquity) * 100).toFixed(2) : '0.00',
      globalHealthScore: 85 // placeholder logic
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching analytics summary' });
  }
};

export const getEquityCurve = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const accounts = await prisma.account.findMany({ where: { userId }});
    const startingBalance = accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);

    const trades = await prisma.trade.findMany({
      where: { account: { userId } },
      orderBy: { closedAt: 'asc' },
    });

    let currentEquity = startingBalance;
    const curve = trades.filter(t => t.closedAt).map(trade => {
      currentEquity += (trade.pnl || 0);
      return {
        date: trade.closedAt!.toISOString().split('T')[0],
        equity: currentEquity,
      };
    });

    if (curve.length > 0 && accounts.length > 0) {
      const firstDate = new Date(curve[0].date);
      if (firstDate) {
        firstDate.setDate(firstDate.getDate() - 1);
        curve.unshift({
          date: firstDate.toISOString().split('T')[0],
          equity: startingBalance
        });
      }
    }

    res.json(curve);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching equity curve' });
  }
};
