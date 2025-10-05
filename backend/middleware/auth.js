const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Middleware xác thực token
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Lưu thông tin user vào request để controller/service dùng
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
}

// Middleware kiểm tra role admin
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden: Admin only' });
  }
  next();
}

module.exports = { auth, isAdmin };
