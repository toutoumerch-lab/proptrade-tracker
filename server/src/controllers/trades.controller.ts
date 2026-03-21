import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getTrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { accountId } = req.query;

    const whereClause: any = {
      account: { userId }
    };
    if (accountId) {
      whereClause.accountId = String(accountId);
    }

    const trades = await prisma.trade.findMany({
      where: whereClause,
      orderBy: { openedAt: 'desc' },
      include: {
        account: {
          select: { firmName: true, firmCode: true, firmColor: true }
        }
      }
    });

    res.json(trades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching trades' });
  }
};

export const createTrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      accountId, instrument, direction, outcome, strategyTag, session,
      entryPrice, exitPrice, lots, pnl, closedAt
    } = req.body;

    // Verify account belongs to user
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account || account.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to add trade to this account' });
      return;
    }

    const trade = await prisma.trade.create({
      data: {
        accountId,
        instrument,
        direction,
        outcome,
        strategyTag,
        session,
        entryPrice: Number(entryPrice),
        exitPrice: exitPrice ? Number(exitPrice) : null,
        lots: Number(lots),
        pnl: pnl ? Number(pnl) : null,
        closedAt: closedAt ? new Date(String(closedAt)) : null,
      }
    });

    res.status(201).json(trade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating trade' });
  }
};

export const bulkCreateTrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { trades } = req.body;

    if (!Array.isArray(trades) || trades.length === 0) {
      res.status(400).json({ message: 'No trades provided' });
      return;
    }

    const accountIds = [...new Set(trades.map((t: any) => t.accountId))];
    const accounts = await prisma.account.findMany({ where: { id: { in: accountIds as string[] } } });
    
    for (const id of accountIds) {
      const acc = accounts.find((a: any) => a.id === id);
      if (!acc || acc.userId !== userId) {
        res.status(403).json({ message: 'Not authorized for account ' + id });
        return;
      }
    }

    const mappedTrades = trades.map((t: any) => ({
      accountId: t.accountId,
      instrument: String(t.instrument || 'Unknown'),
      direction: String(t.direction || 'LONG'),
      outcome: String(t.outcome || 'OPEN'),
      strategyTag: t.strategyTag ? String(t.strategyTag) : null,
      session: t.session ? String(t.session) : null,
      entryPrice: Number(t.entryPrice) || 0,
      exitPrice: t.exitPrice ? Number(t.exitPrice) : null,
      lots: Number(t.lots) || 1,
      pnl: t.pnl ? Number(t.pnl) : null,
      closedAt: t.closedAt ? new Date(String(t.closedAt)) : null,
    }));

    const result = await prisma.trade.createMany({
      data: mappedTrades
    });

    res.status(201).json({ message: 'Trades imported', count: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error importing trades' });
  }
};

export const getTradeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const trade = await prisma.trade.findUnique({
      where: { id },
      include: { account: true }
    });

    if (!trade || trade.account.userId !== userId) {
      res.status(404).json({ message: 'Trade not found' });
      return;
    }

    res.json(trade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching trade' });
  }
};
