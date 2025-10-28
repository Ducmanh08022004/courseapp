import React, { useEffect, useState } from 'react';
import styles from './styles/CourseManagement.module.css';
import VideoModal from './VideoModal';

const VideoManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/courses');
      const data = await res.json();
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourse(data[0]);
        fetchVideos(data[0].courseId);
      }
    } catch(err){ console.error('fetchCourses', err); }
  };

  const fetchVideos = async (course) => {
    const courseId = course?.courseId || course;
    if (!courseId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      let res;
      let data;
      if (role === 'admin') {
        // Admin: fetch all videos and filter client-side by courseId
        res = await fetch('http://localhost:5000/api/videos', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) {
          const errText = await parseError(res);
          throw new Error(errText || 'Failed to load videos');
        }
        data = await res.json();
        // filter by courseId
        data = data.filter(v => v.courseId === courseId);
        setVideos(data);
      } else {
        // Regular user: only allowed to fetch videos for purchased course
        res = await fetch(`http://localhost:5000/api/videos/course/${courseId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) {
          const errText = await parseError(res);
          throw new Error(errText || 'Failed to load videos');
        }
        data = await res.json();
        setVideos(data);
      }
    } catch(err){ console.error('fetchVideos', err); alert(err.message || 'Error loading videos'); }
    finally{ setLoading(false); }
  };

  // helper to safely parse error responses (JSON or text/html)
  const parseError = async (res) => {
    try {
      const json = await res.json();
      return json.error || json.message || JSON.stringify(json);
    } catch (e) {
      try { return await res.text(); } catch (e2) { return null; }
    }
  };

  const handleCourseChange = (e) => {
    const id = parseInt(e.target.value, 10);
    const course = courses.find(c=>c.courseId === id);
    setSelectedCourse(course);
    fetchVideos(id);
  };

  const handleAdd = () => { setSelectedVideo(null); setIsModalOpen(true); };
  const handleEdit = (video) => { setSelectedVideo(video); setIsModalOpen(true); };

  const handleDelete = async (videoId) => {
    if (!confirm('Xóa video này?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errText = await parseError(res);
        throw new Error(errText || 'Delete failed');
      }
      await fetchVideos(selectedCourse.courseId);
    } catch(err){ console.error('delete', err); alert(err.message || 'Delete failed'); }
  };

  const handleModalSave = async ({ title, file, original }) => {
    // if original exists and user uploaded a new file -> create new then delete original
    // if original exists and no file -> backend doesn't support metadata-only update: inform user
    try {
      const token = localStorage.getItem('token');
      if (!selectedCourse) throw new Error('Chưa chọn khóa học');

      if (!file) {
        if (original) {
          // No file uploaded while editing: keep original title and URL (no backend change)
          setIsModalOpen(false);
          return;
        } else {
          alert('Vui lòng chọn file video khi thêm mới.');
          return;
        }
      }

      // Upload new video
      const form = new FormData();
      form.append('file', file);
  form.append('title', title);
      form.append('courseId', selectedCourse.courseId);

      const res = await fetch('http://localhost:5000/api/videos', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
      });

      if (!res.ok) {
        const errText = await parseError(res);
        throw new Error(errText || 'Upload failed');
      }

      // if replacing an original video, delete it
      if (original) {
        try {
          await fetch(`http://localhost:5000/api/videos/${original.videoId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        } catch (delErr) {
          console.warn('Failed to delete original video after upload', delErr);
        }
      }

      setIsModalOpen(false);
      await fetchVideos(selectedCourse.courseId);
    } catch(err){ console.error('save video', err); alert(err.message || 'Lỗi khi lưu video'); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{alignItems:'center', gap:12}}>
        <h2>Quản lí video</h2>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <select value={selectedCourse?.courseId || ''} onChange={handleCourseChange} style={{padding:8, borderRadius:6}}>
            {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.title}</option>)}
          </select>
          <button className={styles.addButton} onClick={handleAdd}>Thêm video</button>
        </div>
      </div>

      <table className={styles.courseTable}>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Đường dẫn / File</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan={4}>Đang tải...</td></tr>}
          {!loading && videos.length === 0 && <tr><td colSpan={4}>Chưa có video cho khóa học này.</td></tr>}
          {videos.map(v => (
            <tr key={v.videoId}>
              <td>{v.title}</td>
              <td style={{maxWidth:300, overflow:'hidden', textOverflow:'ellipsis'}}>{v.url}</td>
              <td>
                <button className={styles.actionButton} onClick={()=>handleEdit(v)}>Sửa / Thay thế</button>
                <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={()=>handleDelete(v.videoId)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <VideoModal open={isModalOpen} onClose={()=>setIsModalOpen(false)} onSave={handleModalSave} initial={selectedVideo} />
    </div>
  );
};

export default VideoManagement;
