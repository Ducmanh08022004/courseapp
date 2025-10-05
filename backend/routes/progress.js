const express = require('express');
const { Progress, Course } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Cập nhật hoặc tạo tiến độ học tập cho course
router.post('/', auth, async (req, res) => {
  try {
    const { courseId, percentage } = req.body;

    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({ msg: 'Percentage must be between 0 and 100' });
    }

    const [p] = await Progress.upsert({ 
      userId: req.user.id, 
      courseId, 
      percentage 
    });

    res.json(p);
  } catch (err) {
    res.status(500).json({ msg: 'Error saving progress', error: err.message });
  }
});

// Lấy tiến độ học tập theo course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const progress = await Progress.findOne({ 
      where: { userId: req.user.id, courseId },
      include: { model: Course, attributes: ['title'] }
    });

    if (!progress) return res.json({ percentage: 0, courseId, title: null });

    res.json({
      courseId: progress.courseId,
      title: progress.Course.title,
      percentage: progress.percentage
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching progress', error: err.message });
  }
});

// Lấy toàn bộ tiến độ học tập của user (tất cả khóa học)
router.get('/my-courses', auth, async (req, res) => {
  try {
    const progresses = await Progress.findAll({
      where: { userId: req.user.id },
      include: { model: Course, attributes: ['title'] }
    });

    const result = progresses.map(p => ({
      courseId: p.courseId,
      title: p.Course ? p.Course.title : null,
      percentage: p.percentage
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching user progress', error: err.message });
  }
});

module.exports = router;
