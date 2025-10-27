const express = require('express');
const { Order, Course, Payment } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// TẠO ĐƠN HÀNG MỚI
// TẠO ĐƠN HÀNG MỚI
router.post('/', auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    // Kiểm tra khóa học tồn tại
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Kiểm tra user đã có order cho khóa học này chưa (pending hoặc paid)
    const existingOrder = await Order.findOne({
      where: {
        userId: req.user.userId,
        courseId: courseId,
        status: ['pending', 'paid'] // kiểm tra cả pending lẫn paid
      }
    });

    if (existingOrder) {
      if (existingOrder.status === 'paid') {
        return res.status(400).json({ msg: 'Bạn đã mua khóa học này rồi' });
      } else if (existingOrder.status === 'pending') {
        return res.status(400).json({ msg: 'Bạn đã có đơn hàng đang chờ thanh toán cho khóa học này' });
      }
    }

    // Tạo order mới
    const order = await Order.create({
      userId: req.user.userId,
      courseId,
      status: 'pending'
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


// LẤY TẤT CẢ ĐƠN HÀNG CỦA USER
router.get('/', auth, async (req, res) => {
    try {
      const orders = await Order.findAll({
        where: { userId: req.user.userId },
        include: [{ model: Course }, { model: Payment }]
      });
      return res.json(orders);
    } catch (err) {
      console.error('Get all orders error:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
});

// LẤY CÁC KHÓA HỌC ĐÃ MUA
router.get('/my-courses', auth, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: {
                userId: req.user.userId,
                status: 'paid'
            },
            include: [{
                model: Course,
                attributes: ['courseId', 'title', 'imageUrl']
            }]
        });
        return res.json(orders);
    } catch (err) {
        console.error('Get my paid courses error:', err);
        return res.status(500).json({ msg: 'Server error' });
    }
});

// ROUTE KIỂM TRA ĐƠN HÀNG THEO KHÓA HỌC
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const order = await Order.findOne({
      where: {
        userId: req.user.userId,
        courseId: courseId
      }
    });
    if (!order) {
      return res.status(404).json({ msg: 'Order not found for this course' });
    }
    return res.json(order);
  } catch (err) {
    console.error('Get order by course error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});



// LẤY CHI TIẾT 1 ĐƠN HÀNG
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { orderId: req.params.id, userId: req.user.userId },
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

