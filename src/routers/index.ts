import { Router } from 'express';
import * as coinController from '../controllers';

const router = Router();

router.get('/coins', coinController.getAllCoins);
router.get('/coins/:id', coinController.getCoinById);
router.post('/coins', coinController.createCoin);
router.put('/coins/:id', coinController.updateCoin);
router.delete('/coins/:id', coinController.deleteCoin);

export default router;
