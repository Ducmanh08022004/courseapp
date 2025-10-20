const express = require('express');
const { Course, Video, Exam, Question } = require('../models');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ===================== MULTER CONFIG ===================== //
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'themes/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Chỉ cho phép file ảnh (.png, .jpg, .jpeg, .webp)'));
    }
    cb(null, true);
  }
});

// ===================== COURSES ===================== //

// Lấy tất cả khóa học
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi khi lấy danh sách khóa học', error: err.message });
  }
});

// Tìm khóa học theo tiêu đề
router.get('/title/:title', async (req, res) => {
  try {
    const course = await Course.findOne({ where: { title: req.params.title } });
    if (!course) return res.status(404).json({ msg: 'Không tìm thấy khóa học' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi khi tìm khóa học', error: err.message });
  }
});

// Lấy chi tiết khóa học kèm video + exam + question
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Video },
        {
          model: Exam,
          include: [Question]
        }
      ]
    });
    if (!course) return res.status(404).json({ msg: 'Không tìm thấy khóa học' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi khi lấy chi tiết khóa học', error: err.message });
  }
});

// ===================== ADMIN ROUTES ===================== //

// Tạo mới khóa học (Admin + upload ảnh)
router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const imageUrl = req.file ? `/themes/${req.file.filename}` : null;

    const course = await Course.create({
      title,
      description,
      price,
      imageUrl
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi khi tạo khóa học', error: err.message });
  }
});

// Cập nhật khóa học (Admin)
router.put('/:id', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Không tìm thấy khóa học' });

    const { title, description, price } = req.body;
    let imageUrl = course.imageUrl;

    // Nếu upload ảnh mới → xóa ảnh cũ
    if (req.file) {
      if (imageUrl && fs.existsSync(`.${imageUrl}`)) fs.unlinkSync(`.${imageUrl}`);
      imageUrl = `/themes/${req.file.filename}`;
    }

    await course.update({ title, description, price, imageUrl });
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi khi cập nhật khóa học', error: err.message });
  }
});

// Xóa khóa học (Admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Không tìm thấy khóa học' });

    // Xóa ảnh theme nếu có
    if (course.imageUrl && fs.existsSync(`.${course.imageUrl}`)) {
      fs.unlinkSync(`.${course.imageUrl}`);
    }

    await course.destroy();
    res.status(204).json({ msg: 'Đã xóa khóa học' });
  } catch (err) {
    res.status(500).json({ msg: 'Lỗi khi xóa khóa học', error: err.message });
  }
});

module.exports = router;
