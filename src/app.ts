import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'
import { subscribeToCoin } from './services/binanceService';
import coinRoutes from './routers';

export const app = express();
const port = process.env.PORT || 3000;
export const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', coinRoutes);
async function getActiveConnections() {
    const activeConnections = await prisma.$queryRaw`
      SELECT client_addr
      FROM pg_stat_activity
    `;

    return activeConnections;
}

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Connected to the database');
       
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        await listeningCoins();
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
}

startServer();

async function listeningCoins(){
    const coins = await prisma.coin.findMany();
    for (const item of coins){
        subscribeToCoin(item.name)
    }
}

process.on('SIGINT', async () => {
    console.log('Shutting down server');
    await prisma.$disconnect();
    process.exit();
});

