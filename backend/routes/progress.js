const express = require('express');
const { Course, CourseProgress, Order } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Lấy tiến độ học tập theo course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    // 1. Tìm cache CourseProgress
    const cp = await CourseProgress.findOne({ where: { userId, courseId } });

    if (cp) {
      return res.json({
        courseId,
        videoPercent: cp.videoPercent,
        examPercent: cp.examPercent,
        totalPercent: cp.totalPercent
      });
    }

    // 2. Nếu chưa có cache → tính realtime
    const { updateCourseProgress } = require('../utils/progressHelper');
    const stats = await updateCourseProgress(userId, courseId);

    return res.json({
      courseId,
      videoPercent: stats.videoPercent,
      examPercent: stats.examPercent,
      totalPercent: stats.totalPercent
    });

  } catch (err) {
    res.status(500).json({ msg: 'Error fetching course progress', error: err.message });
  }
});

// Lấy tiến độ tất cả khóa học user đã mua
router.get('/my-courses', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Lấy danh sách khóa học user đã mua
    const purchasedCourses = await Order.findAll({
      where: { userId, status: 'paid' },
      include: { model: Course, attributes: ['courseId', 'title'] }
    });

    if (!purchasedCourses || purchasedCourses.length === 0) {
      return res.json({ msg: "No purchased courses", courses: [] });
    }

    const courseIds = purchasedCourses.map(o => o.courseId);

    // 2. Lấy progress cache
    const progressList = await CourseProgress.findAll({
      where: { userId, courseId: courseIds }
    });

    // 3. Build response
    const response = purchasedCourses.map(order => {
      const cp = progressList.find(p => p.courseId === order.courseId);
      return {
        courseId: order.courseId,
        title: order.Course?.title || null,
        videoPercent: cp?.videoPercent ?? 0,
        examPercent: cp?.examPercent ?? 0,
        totalPercent: cp?.totalPercent ?? 0
      };
    });

    res.json(response);

  } catch (err) {
    res.status(500).json({ msg: 'Error fetching user courses progress', error: err.message });
  }
});

module.exports = router;
