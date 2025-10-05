const express = require('express');
const { Order, Course, Payment } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 📌 Tạo đơn hàng mới
router.post('/', auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Tạo order ở trạng thái pending
    const order = await Order.create({
      userId: req.user.id,
      courseId,
      amount: course.price,
      status: 'pending'
    });

    // Tạo record Payment tương ứng (chưa thanh toán)
    const payment = await Payment.create({
      orderId: order.id,
      amount: course.price,
      method: 'unpaid', // ví dụ: unpaid, paypal, stripe, momo, vnpay...
      status: 'pending'
    });

    return res.status(201).json({
      msg: 'Order created',
      order,
      payment
    });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// 📌 Lấy tất cả đơn hàng của user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: Course }, { model: Payment }]
    });
    return res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// 📌 Lấy chi tiết 1 đơn hàng
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Course }, { model: Payment }]
    });

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    return res.json(order);
  } catch (err) {
    console.error('Get order detail error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
