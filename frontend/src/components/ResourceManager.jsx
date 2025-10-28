import React from 'react';
import styles from './styles/ResourceManager.module.css';
import { Link } from 'react-router-dom';

const ResourceManager = () => {
  return (
    <div className={styles.container}>
      <h2>Quản lí tài nguyên</h2>
      <div className={styles.resourceSection}>
        <Link to="/admin/courses" className={styles.actionButton}>Quản lí khóa học</Link>
      </div>
      <div className={styles.resourceSection}>
        <Link to="/admin/videos" className={styles.actionButton}>Quản lí video</Link>
      </div>
      <div className={styles.resourceSection}>
        <Link to="/admin/exams" className={styles.actionButton}>Quản lí exam</Link>
      </div>
    </div>
  );
};

export default ResourceManager;
