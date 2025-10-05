const express = require('express');
const { Notification } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

//  Lấy tất cả thông báo của user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    return res.json(notes);
  } catch (err) {
    console.error('Get notifications error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

//  Đánh dấu đã đọc thông báo (chỉ 1 notification)
router.put('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Notification.findOne({
      where: { id, userId: req.user.id }
    });

    if (!note) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    note.isRead = true;
    await note.save();
    return res.json(note);
  } catch (err) {
    console.error('Mark notification read error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Đánh dấu tất cả thông báo đã đọc
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id } }
    );
    return res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all notifications read error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
