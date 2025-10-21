const express = require('express');
const { Exam, Question, UserExam, Course } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// User nộp bài thi
router.post('/submit', auth, async (req, res) => {
  try {
    const { examId, answers } = req.body; 
    // answers: [{ questionId: 1, userAnswer: "A" }, ...]

    const exam = await Exam.findByPk(examId, {
      include: [{ model: Question }]
    });
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });

    let score = 0;
    exam.Questions.forEach(q => {
      const userAns = answers.find(a => a.questionId === q.questionId);
      if (userAns && userAns.userAnswer === q.correctAnswer) {
        score++;
      }
    });

    const totalQuestions = exam.Questions.length;
    const percent = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    // Lưu kết quả vào UserExam
    const result = await UserExam.create({
      userId: req.user.id,
      examId,
      score,
      totalQuestions,
      percent
    });

    res.json({
      msg: 'Exam submitted successfully',
      score,
      totalQuestions,
      percent,
      result
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error submitting exam', error: err.message });
  }
});

// Xem kết quả thi của user
router.get('/', auth, async (req, res) => {
  try {
    const results = await UserExam.findAll({
      where: { userId: req.user.id },
      include: [{ model: Exam, attributes: ['title'],
        include: [{ model: Course, attributes: ['courseId', 'title'] }] 
       }]
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching user exam results', error: err.message });
  }
});

module.exports = router;
