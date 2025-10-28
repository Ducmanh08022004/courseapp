import React, { useState, useEffect } from 'react';
import styles from './styles/CourseModal.module.css';

const CourseModal = ({ course, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (course) {
      setTitle(course.title || '');
      setDescription(course.description || '');
      setPrice(course.price || '');
    }
  }, [course]);

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    const url = course ? `http://localhost:5000/api/courses/${course.courseId}` : 'http://localhost:5000/api/courses';
    const method = course ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          // FormData sets the Content-Type header automatically, so we don't set it here.
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      if (response.ok) {
        onSave();
      } else {
        const errorData = await response.json();
        console.error('Error saving course:', errorData.msg);
        alert(`Error: ${errorData.msg}`);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('An error occurred while saving the course.');
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>{course ? 'Sửa khóa học' : 'Thêm khóa học'}</h2>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Tên khóa học</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price">Giá</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Ảnh bìa</label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>Lưu</button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
