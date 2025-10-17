const express = require('express');
const { Payment, Order, Course } = require('../models'); 
const { auth } = require('../middleware/auth');

const router = express.Router();

// Tạo payment cho order
router.post('/', auth, async (req, res) => {
  try {
    const { orderId, method } = req.body;

    // include cả model Course để lấy được giá
    const order = await Order.findByPk(orderId, {
        include: [{ model: Course }]
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ msg: 'Order already paid' });
    }

    // Kiểm tra xem có lấy được thông tin Course không
    if (!order.Course || order.Course.price == null) {
        return res.status(500).json({ msg: 'Could not find course price for this order' });
    }

    // SỬA ĐỔI 2: Tạo payment với các thuộc tính đúng
    const payment = await Payment.create({
      orderId,
      paymentMethod: method,  // vd: momo, paypal
      amount: order.Course.price, 
      status: 'success'       // Giả định thành công
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