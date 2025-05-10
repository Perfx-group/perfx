
import { Router } from 'express';
import {
  createOrder,
  modifyOrder,
  cancelOrder,
  getOrderBook,
} from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.put('/:id', modifyOrder);
router.delete('/:id', cancelOrder);
router.get('/book', getOrderBook);

export default router;
