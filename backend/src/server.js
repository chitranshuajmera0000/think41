const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.user.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.get('/customers/summary', async (req, res) => {

  try {
    // Get all users

    const customers = await prisma.user.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    // Get order counts grouped by user_id
    const orderCounts = await prisma.order.groupBy({
      by: ['user_id'],
      _count: { user_id: true },
    });
        // Map user_id to order count
    const orderCountMap = {};
    orderCounts.forEach((o) => {
      orderCountMap[o.user_id] = o._count.user_id;
    });

    // Combine user info with order count
    const summaries = customers.map((c) => ({
      ...c,
      orderCount: orderCountMap[c.id] || 0,
    }));

    res.json(summaries);
  } catch (error) {
    console.error("Summary endpoint error:", error); // Add this line
    res.status(500).json({ error: 'Failed to fetch customer summaries' });
  }
});


app.get('/customers/:id', async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    const orderCount = await prisma.order.count({
      where: { user_id: userId },
    });

    res.json({
      ...user,
      orderCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

app.get('/customers/:id/orders', async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orders = await prisma.order.findMany({
      where: { user_id: userId },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch orders',
    });
  }
});

app.get('/orders/:order_id', async (req, res) => {
  const orderId = Number(req.params.order_id);
  try {
    const order = await prisma.order.findUnique({
      where: { order_id: orderId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});