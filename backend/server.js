const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();

// ================== MIDDLEWARE ================== //
app.use(cors());
app.use(express.json());

// ================== ROUTES ================== //
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payment'));  
app.use('/api/progress', require('./routes/progress'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/videos', require('./routes/video'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/exam-users', require('./routes/userExam'));
app.use('/api/users', require('./routes/user'));  
// ================== STATIC FILES ================== //
// Thư mục chứa video upload
app.use('/uploads', express.static('uploads'));

// ================== START SERVER ================== //
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
