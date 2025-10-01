const express = require('express');
const { Course, Lesson } = require('../models');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Lấy tất cả khóa học  //
router.get('/', async (req,res)=>{
  const courses = await Course.findAll({ where:{published:true} });
  res.json(courses);
});
// Lấy chi tiết khóa học  //
router.get('/:id', async (req,res)=>{
  const course = await Course.findByPk(req.params.id,{ include:Lesson });
  if(!course) return res.status(404).json({msg:'Not found'});
  res.json(course);
});
// Tạo mới khóa học  (Admin) //
router.post('/', auth, isAdmin, async (req,res)=>{
  const course = await Course.create(req.body);
  res.json(course);
});
// Cập nhật khóa học  (Admin) //
router.put('/:id', auth, isAdmin, async (req,res)=>{
  const course = await Course.findByPk(req.params.id);    
  if(!course) return res.status(404).json({msg:'Not found'});
  await course.update(req.body);
  res.json(course);
});
// Xoá khóa học  (Admin) //
router.delete('/:id', auth, isAdmin, async (req,res)=>{
  const course = await Course.findByPk(req.params.id);    
  if(!course) return res.status(404).json({msg:'Not found'});
  await course.destroy();
  res.json({msg:'Deleted'});
});
module.exports = router;
