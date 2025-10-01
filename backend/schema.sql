-- Tạo database
DROP DATABASE IF EXISTS courseapp;
CREATE DATABASE courseapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE courseapp;

-- Bảng Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  passwordHash VARCHAR(255),
  role ENUM('student','admin') DEFAULT 'student',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Courses
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  price DECIMAL(10,2),
  published BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Lessons
CREATE TABLE lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  courseId INT,
  title VARCHAR(200),
  content TEXT,
  videoUrl VARCHAR(255),
  duration INT,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

-- Bảng Orders
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  courseId INT,
  amount DECIMAL(10,2),
  status ENUM('pending','paid','cancelled') DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (courseId) REFERENCES courses(id)
);

-- Bảng Progress
CREATE TABLE progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  courseId INT,
  lessonId INT,
  percent INT,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (courseId) REFERENCES courses(id),
  FOREIGN KEY (lessonId) REFERENCES lessons(id)
);

-- Bảng Notifications
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  title VARCHAR(200),
  body TEXT,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

