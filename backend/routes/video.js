const express = require('express');
const { Video, Course } = require('../models');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Cấu hình multer để lưu video vào thư mục "uploads"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// Thêm video //
router.post('/', auth, isAdmin ,upload.single('file'), async (req, res) => {
    try {
        const { title, duration, courseId } = req.body;

        // Kiểm tra course có tồn tại không
        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        // Đường dẫn video sau khi upload
        const filePath = req.file.path;

        // Lưu vào database
        const video = await Video.create({ 
            title, 
            url: filePath, 
            duration, 
            courseId 
        });

        res.status(201).json(video);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Lấy tất cả video //
router.get('/', auth, async (req, res) => {
    const videos = await Video.findAll();   
    res.json(videos);
});

// Lấy video theo khóa học //
router.get('/course/:courseId', auth, async (req, res) => {
    const { courseId } = req.params;    
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const videos = await Video.findAll({ where: { courseId } });
    res.json(videos);
});

module.exports = router;
