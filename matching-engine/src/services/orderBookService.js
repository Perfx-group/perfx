import { OrderBook } from 'nodejs-order-book';

class OrderBookService {
  constructor() {
    
    this.ob = new OrderBook({ experimentalConditionalOrders: true });
  }

  createOrder(opts) {
    return this.ob.createOrder(opts);
  }

  limit(opts) {
    return this.ob.limit(opts);
  }

  market(opts) {
    return this.ob.market(opts);
  }

  stopLimit(opts) {
    return this.ob.stopLimit(opts);
  }

  stopMarket(opts) {
    return this.ob.stopMarket(opts);
  }

  oco(opts) {
    return this.ob.oco(opts);
  }

  modify(id, update) {
    return this.ob.modify(id, update);
  }

  cancel(id) {
    return this.ob.cancel(id);
  }

  // for debugging / clients:
  getBook() {
    return {
      bids: this.ob.bids.getLevels(),
      asks: this.ob.asks.getLevels(),
      stops: this.ob.stops
    };
  }
}

export default new OrderBookService();
