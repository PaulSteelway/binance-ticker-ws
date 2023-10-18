import { Prisma, PrismaClient } from '@prisma/client';
import { subscribeToCoin } from '../services/binanceService';

const createHook = (prisma: PrismaClient) => {
    return async (params: Prisma.CoinCreateArgs) => {
        try {
            if (!params.data.name) throw new Error("Couldn't find name")
            subscribeToCoin(params.data.name)
            console.log('Coin record created:', params.data);
        } catch (e) {
            console.error("Error:", e)
        }
    };
};

const deleteHook = (prisma: PrismaClient) => {
    return async (params: Prisma.CoinDeleteArgs) => {
        try {
            if (!params.where.name) throw new Error("Couldn't find name")
            subscribeToCoin(params.where.name)
            console.log('Coin record deleted:', params.where);
        } catch (e) {
            console.error("Error:", e)
        }
    };
};

export const CoinHooks = (prisma: PrismaClient) => ({
    createHook: createHook(prisma),
    deleteHook: deleteHook(prisma),
});

