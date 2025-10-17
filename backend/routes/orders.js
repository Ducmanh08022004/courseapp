const express = require('express');
const { Order, Course, Payment } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// ... (route POST / và GET / không đổi)

//  TẠO ĐƠN HÀNG MỚI
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

    return res.status(201).json(order); // Trả về order thôi là đủ
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


// 📌 LẤY TẤT CẢ ĐƠN HÀNG CỦA USER
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


// ROUTE MỚI: KIỂM TRA ĐƠN HÀNG THEO KHÓA HỌC
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const order = await Order.findOne({
      where: {
        userId: req.user.id,
        courseId: courseId
      }
    });

    if (!order) {
      // Rất quan trọng: Trả về 404 nếu không tìm thấy
      return res.status(404).json({ msg: 'Order not found for this course' });
    }

    return res.json(order);
  } catch (err) {
    console.error('Get order by course error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


// ... (route GET /:id không đổi)
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
