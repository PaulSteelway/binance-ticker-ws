import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CoinHooks } from '../models';
import { prisma } from '../app';
const coinHooks = CoinHooks(prisma);

export const getAllCoins = async (req: Request, res: Response) => {
  try {
    const coins = await prisma.coin.findMany();
    res.json(coins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
};

export const getCoinById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const coin = await prisma.coin.findUnique({
      where: { id: parseInt(id) },
    });
    if (!coin) {
      res.status(404).json({ error: 'Coin not found' });
    } else {
      res.json(coin);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coin' });
  }
};

export const createCoin = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
  } else {
    try {
      const newCoin = await prisma.coin.create({
        data: { name },
      });
      await coinHooks.createHook({ data: newCoin });
      res.json(newCoin);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create coin' });
    }
  }
};

export const updateCoin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const updatedCoin = await prisma.coin.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price,
      },
    });
    res.json(updatedCoin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coin' });
  }
};

export const deleteCoin = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.coin.delete({
      where: { id: parseInt(id) },
    });
    await coinHooks.deleteHook({ where: { id: parseInt(id) } });
    res.json({ message: 'Coin deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coin' });
  }
};
