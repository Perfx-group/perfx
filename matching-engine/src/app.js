
import express from 'express';
import ordersRouter from './routes/orders.js';

const app = express();
app.use(express.json());

app.use('/orders', ordersRouter);

app.use('/orderbook', ordersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: err.message });
});

export default app;
