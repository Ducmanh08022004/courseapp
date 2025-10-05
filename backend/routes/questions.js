const express = require('express');
const { Question, Exam } = require('../models');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Lấy tất cả câu hỏi của exam
router.get('/exam/:examId', auth, async (req, res) => {
  try {
    const { examId } = req.params;
    const questions = await Question.findAll({ where: { examId } });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching questions', error: err.message });
  }
});

// Tạo câu hỏi cho exam (Admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { examId, content, answer, correctAnswer } = req.body;
    const exam = await Exam.findByPk(examId);
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });

    const question = await Question.create({ examId, content, answer, correctAnswer });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating question', error: err.message });
  }
});

// Xoá câu hỏi (Admin)
router.delete('/:questionId', auth, isAdmin, async (req, res) => {
  try {
    const { questionId } = req.params;
    const q = await Question.findByPk(questionId);
    if (!q) return res.status(404).json({ msg: 'Question not found' });

    await q.destroy();
    res.json({ msg: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting question', error: err.message });
  }
});

module.exports = router;
