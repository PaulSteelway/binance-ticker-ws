import Redlock from 'redlock';
import Redis, { RedisKey, RedisValue } from 'ioredis';
import { prisma } from '../app';

const redisClient = new Redis({
    host: process.env["REDIS_HOST"],
    port: 6379,
});

const redlock = new Redlock([redisClient], {
    driftFactor: 0.01,
    retryCount: 100,
    retryDelay: 200,
    retryJitter: 200,
});

export const setKey = async (key: RedisKey, value: RedisValue) => {
    const lock = await redlock.acquire([`locks:${key}`], 1000);
    try {
        await redisClient.set(key, value);
        await prisma.coin.update({
            where: { name: key.toString() },
            data: {
              name:key.toString(),
              price: value.toString(),
            },
          });
      
    } catch (e) {
        console.log(e)
    } finally {
        if (lock) await lock.release();
    }
};

export const getKey = async (key: RedisKey) => {
    return await redisClient.get(key);
};

export const deleteKey = async (key: RedisKey) => {
    const lock = await redlock.acquire([`${key}`], 500);
    try {
        await redisClient.del(key);
    } catch (e) {
        console.log(e)
    } finally {
        await lock.release();
    }
};