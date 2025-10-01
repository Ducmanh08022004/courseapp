require('dotenv').config();
console.log("🔍 Sequelize init with:", process.env.DB_USER, process.env.DB_PASS);

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// User
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  passwordHash: DataTypes.STRING,
  role: { type: DataTypes.ENUM('student','admin'), defaultValue: 'student' }
});

// Course
const Course = sequelize.define('Course', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL,
  published: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Lesson
const Lesson = sequelize.define('Lesson', {
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  videoUrl: DataTypes.STRING,
  duration: DataTypes.INTEGER
});

// Order
const Order = sequelize.define('Order', {
  amount: DataTypes.DECIMAL,
  status: { type: DataTypes.ENUM('pending','paid','cancelled'), defaultValue: 'pending' }
});

// Progress
const Progress = sequelize.define('Progress', {
  percent: DataTypes.INTEGER
});

// Notification
const Notification = sequelize.define('Notification', {
  title: DataTypes.STRING,
  body: DataTypes.TEXT,
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
});
// Video
const Video = sequelize.define('Video', {
  title: DataTypes.STRING,
  url: DataTypes.STRING,
  duration: DataTypes.INTEGER
});

// Quan hệ
Course.hasMany(Lesson, { foreignKey: 'courseId' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(Course, { foreignKey: 'courseId' });

User.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(User, { foreignKey: 'userId' });

Course.hasMany(Progress, { foreignKey: 'courseId' });
Progress.belongsTo(Course, { foreignKey: 'courseId' });

Lesson.hasMany(Progress, { foreignKey: 'lessonId' });
Progress.belongsTo(Lesson, { foreignKey: 'lessonId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

Video.belongsTo(Course, { foreignKey: 'courseId' });
Course.hasMany(Video, { foreignKey: 'courseId' });

module.exports = { sequelize, User, Course, Lesson, Order, Progress, Notification, Video };
