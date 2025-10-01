const express = require('express');
const { Progress } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req,res)=>{
  const {courseId, lessonId, percent} = req.body;
  const [p] = await Progress.upsert({ userId:req.user.id, courseId, lessonId, percent });
  res.json(p);
});
router.get('/course/:courseId', auth, async (req,res)=>{
  const {courseId} = req.params;
  const progress = await Progress.findAll({ where: { userId: req.user.id, courseId } });
  res.json(progress);
});
module.exports = router;
