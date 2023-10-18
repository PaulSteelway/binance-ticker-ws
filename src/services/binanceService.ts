import WebSocket from 'ws';
import { getKey, setKey } from './redisService';

const subscriptions: Record<string, WebSocket> = {};

export function subscribeToCoin(coinSymbol: string) {
  if (!subscriptions[coinSymbol]) {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${coinSymbol.toLowerCase()}@trade`);
    ws.on('message', async (data: string) => {
      const tradeData = JSON.parse(data);
      const symbol = await getKey(coinSymbol);
      console.log('symbol', symbol);
      if (!symbol || symbol != tradeData.p){
        console.log(`Price of ${coinSymbol}: ${tradeData.p}`,symbol);
        await setKey(coinSymbol,tradeData.p)
      }
      });
    subscriptions[coinSymbol] = ws;
  }
}

export function unsubscribeFromCoin(coinSymbol: string) {
  if (subscriptions[coinSymbol]) {
    subscriptions[coinSymbol].close();
    delete subscriptions[coinSymbol];
  }
}
