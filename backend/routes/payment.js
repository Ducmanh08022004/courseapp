const express = require('express');
const { Payment, Order } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 📌 Tạo payment cho order
router.post('/', auth, async (req, res) => {
  try {
    const { orderId, method } = req.body;

    // Kiểm tra order có hợp lệ không
    const order = await Order.findByPk(orderId);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ msg: 'Order already paid' });
    }

    // Tạo payment
    const payment = await Payment.create({
      orderId,
      method,                 // ví dụ: 'momo', 'paypal', 'vnpay'
      amount: order.amount,
      status: 'success'       // giả định thành công, thực tế tích hợp cổng thanh toán ở đây
    });

    // Update trạng thái order
    order.status = 'paid';
    await order.save();

    return res.status(201).json({
      msg: 'Payment successful',
      payment,
      order
    });
  } catch (err) {
    console.error('Create payment error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// 📌 Lấy danh sách payments của user
router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: {
        model: Order,
        where: { userId: req.user.id }
      },
      order: [['createdAt', 'DESC']]
    });

    return res.json(payments);
  } catch (err) {
    console.error('Get payments error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// 📌 Lấy chi tiết 1 payment
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { id: req.params.id },
      include: { model: Order, where: { userId: req.user.id } }
    });

    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }

    return res.json(payment);
  } catch (err) {
    console.error('Get payment detail error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
