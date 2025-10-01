const express = require('express');
const { Order, Course } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();
//  Tạo đơn hàng mới //
router.post('/', auth, async (req,res)=>{
  const {courseId} = req.body;
  const course = await Course.findByPk(courseId);
  if(!course) return res.status(404).json({msg:'No course'});
  const order = await Order.create({ userId:req.user.id, courseId, amount:course.price, status:'paid' });
  res.json(order);
});

module.exports = router;
