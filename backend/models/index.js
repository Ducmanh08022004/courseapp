require('dotenv').config();

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// ======================= MODELS ======================= //

// User
const User = sequelize.define('User', {
  userId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  fullname: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  role: { type: DataTypes.ENUM('student', 'admin'), defaultValue: 'student' }
});

// Course
const Course = sequelize.define('Course', {
  courseId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL(10, 2),
  imageUrl: DataTypes.STRING,
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// Video
const Video = sequelize.define('Video', {
  videoId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: DataTypes.STRING,
  url: DataTypes.STRING,
  duration: DataTypes.STRING
});

// Order
const Order = sequelize.define('Order', {
  orderId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  courseId: { type: DataTypes.INTEGER, allowNull: false },
  dateOfPurchase: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  expirationDate: { type: DataTypes.DATE },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
    defaultValue: 'pending'
  }
});

// Payment
const Payment = sequelize.define('Payment', {
  paymentId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false }, // vd: momo, paypal
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'success', 'failed'), defaultValue: 'pending' }
});

// Notification
const Notification = sequelize.define('Notification', {
  notificationId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  message: DataTypes.TEXT,
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Progress
const Progress = sequelize.define('Progress', {
  progressId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  percentage: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    validate: { min: 0, max: 100 }
  }

});

// Exam
const Exam = sequelize.define('Exam', {
  examId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false }
});

// UserExam
const UserExam = sequelize.define('UserExam', {
  userExamId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  examId: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.INTEGER, allowNull: false },
  totalQuestions: { type: DataTypes.INTEGER, allowNull: false },
  percent: { type: DataTypes.DOUBLE, allowNull: false }
});


// Question
const Question = sequelize.define('Question', {
  questionId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  content: { type: DataTypes.STRING, allowNull: false },
  answer: { type: DataTypes.JSON, allowNull: false },  // List<String>
  correctAnswer: { type: DataTypes.STRING, allowNull: false }
});

// ======================= RELATIONSHIPS ======================= //

// User – Order
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// User – Notification
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// User – Progress
User.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(User, { foreignKey: 'userId' });

// Course – Order
Course.hasMany(Order, { foreignKey: 'courseId' });
Order.belongsTo(Course, { foreignKey: 'courseId' });

// Course – Progress
Course.hasMany(Progress, { foreignKey: 'courseId' });
Progress.belongsTo(Course, { foreignKey: 'courseId' });

// Course – Video
Course.hasMany(Video, { foreignKey: 'courseId' });
Video.belongsTo(Course, { foreignKey: 'courseId' });

// Course – Exam
Course.hasMany(Exam, { foreignKey: 'courseId' });
Exam.belongsTo(Course, { foreignKey: 'courseId' });

// Exam – Question
Exam.hasMany(Question, { foreignKey: 'examId' });
Question.belongsTo(Exam, { foreignKey: 'examId' });

// Order – Payment (1:N để lưu nhiều lần thanh toán)
Order.hasMany(Payment, { foreignKey: 'orderId' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

// User – Exam (qua UserExam)
User.hasMany(UserExam, { foreignKey: 'userId' });
UserExam.belongsTo(User, { foreignKey: 'userId' });

Exam.hasMany(UserExam, { foreignKey: 'examId' });
UserExam.belongsTo(Exam, { foreignKey: 'examId' });


// ======================= EXPORT ======================= //
module.exports = {
  sequelize,
  User, Course, Video, Order, Payment, Notification, Progress, Exam, Question, UserExam
};
