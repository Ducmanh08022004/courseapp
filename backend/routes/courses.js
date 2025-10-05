const express = require('express');
const { Course, Video, Exam, Question } = require('../models');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

// ===================== COURSES ===================== //

// Lấy tất cả khóa học (chỉ published)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching courses', error: err.message });
  }
});

// Lấy chi tiết khóa học kèm video + exam
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, { 
      include: [
        { model: Video },
        { 
          model: Exam,
          include: [ Question ]
        }
      ]
    });
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching course', error: err.message });
  }
});

// Tạo mới khóa học (Admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating course', error: err.message });
  }
});

// Cập nhật khóa học (Admin)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    await course.update(req.body);
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating course', error: err.message });
  }
});

// Xóa khóa học (Admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    await course.destroy();
    res.json({ msg: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting course', error: err.message });
  }
});

module.exports = router;
