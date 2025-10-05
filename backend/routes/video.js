const express = require('express');
const { Video, Course, Order } = require('../models');
const { auth, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// ================= MULTER CONFIG ================= //
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // thư mục lưu file upload
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// ================= API ================= //

// Upload video (admin)
router.post('/', auth, isAdmin, upload.single('file'), async (req, res) => {
    try {
        const { title, duration, courseId } = req.body;

        // kiểm tra khóa học
        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        if (!req.file) return res.status(400).json({ error: 'No video file uploaded' });

        const filePath = req.file.path; // ví dụ: uploads/1696527234000.mp4

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

// Lấy tất cả video (admin)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const videos = await Video.findAll();   
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy video theo khóa học (chỉ user đã mua mới xem được list)
router.get('/course/:courseId', auth, async (req, res) => {
    try {
        const { courseId } = req.params;    

        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const order = await Order.findOne({ 
            where: { userId: req.user.id, courseId, status: 'paid' }
        });
        if (!order) return res.status(403).json({ error: 'You do not have access to this course' });

        const videos = await Video.findAll({ where: { courseId } });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Stream video (user phải mua mới được xem)
router.get('/stream/:videoId', auth, async (req, res) => {
    try {
        const video = await Video.findByPk(req.params.videoId, { include: Course });
        if (!video) return res.status(404).json({ error: 'Video not found' });

        // kiểm tra user có quyền truy cập khóa học này không
        const order = await Order.findOne({ 
            where: { userId: req.user.id, courseId: video.Course.courseId, status: 'paid' }
        });
        if (!order) return res.status(403).json({ error: 'You do not have access to this video' });

        const videoPath = path.join(__dirname, '..', video.url);
        const videoStat = fs.statSync(videoPath);
        const fileSize = videoStat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
