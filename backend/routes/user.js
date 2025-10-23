const express = require('express');
const router = express.Router();
const { User } = require('../models'); 
const {auth} = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// LẤY THÔNG TIN CỦA USER ĐANG ĐĂNG NHẬP

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
           attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error("Get profile error:", err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

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


//  3. Cập nhật thông tin user
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.userId !== parseInt(req.params.id)) {
        return res.status(403).json({ message: "Bạn chỉ cập nhật thông tin của chính mình." });
    }
    const { fullname, password, email } = req.body;
    
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Tạo một đối tượng để chứa dữ liệu cần cập nhật
    const updateData = {
        fullname: fullname,
        email: email
    };

    // Chỉ mã hóa và cập nhật mật khẩu NẾU người dùng cung cấp mật khẩu mới
    if (password && password.length > 0) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        updateData.password = hash;
    }

  
    await user.update(updateData);

   
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json(userResponse);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Xóa user
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
