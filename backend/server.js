const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

console.log("DB config:", process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS);

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/videos', require('./routes/video'));

//  Thư mục tĩnh để lưu video upload
app.use('/uploads', express.static('uploads'));
sequelize.sync().then(()=>{
  app.listen(5000, ()=> console.log('Server running on http://localhost:5000'));
});
