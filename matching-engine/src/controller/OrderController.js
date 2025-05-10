import orderBookService from '../services/orderBookService.js';

export async function createOrder(req, res, next) {
  try {
    const result = orderBookService.createOrder(req.body);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
}

export async function modifyOrder(req, res, next) {
  try {
    const { id } = req.params;
    const result = orderBookService.modify(id, req.body);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = orderBookService.cancel(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

export async function getOrderBook(req, res, next) {
  try {
    res.json({ success: true, book: orderBookService.getBook() });
  } catch (err) {
    next(err);
  }
}
