const express = require('express');
const router = express.Router();
const { User } = require('../models'); // import model Sequelize

// 1. Lấy danh sách tất cả users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Lấy 1 user theo ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//  4. Cập nhật thông tin user
router.put('/:id', async (req, res) => {
  try {
    const { username, fullname, email, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ username, fullname, email, role });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. Xóa user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
