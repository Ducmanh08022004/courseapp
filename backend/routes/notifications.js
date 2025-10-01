const express = require('express');
const { Notification } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();
// Lấy tất cả thông báo của user //
router.get('/', auth, async (req,res)=>{
  const notes = await Notification.findAll({ where:{userId:req.user.id} });
  res.json(notes);
});
// Đánh dấu đã đọc thông báo //
router.post('/mark-read', auth, async (req,res)=>{
  const {id} = req.body;
  const note = await Notification.findOne({ where:{id, userId:req.user.id} });    
  if(!note) return res.status(404).json({msg:'No notification'});
  note.isRead = true;
  await note.save();
  res.json(note);
});
module.exports = router;
