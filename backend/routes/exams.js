const express = require('express');
const { Exam, Course, Question } = require('../models');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Lấy tất cả exam của 1 course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const exams = await Exam.findAll({
      where: { courseId },
      include: [{ model: Question, attributes: ['questionId', 'content'] }]
    });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching exams', error: err.message });
  }
});

// Tạo exam mới cho course (Admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { courseId, title } = req.body;
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    const exam = await Exam.create({ courseId, title });
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating exam', error: err.message });
  }
});

// Xoá exam (Admin)
router.delete('/:examId', auth, isAdmin, async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findByPk(examId);
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });

    await exam.destroy();
    res.json({ msg: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting exam', error: err.message });
  }
});

module.exports = router;
