import React, { useState } from 'react';

const VideoModal = ({ open, onClose, onSave, initial = null }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [file, setFile] = useState(null);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, file, original: initial });
  };

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999}}>
      <div style={{width:520, maxWidth:'95%', background:'#fff', borderRadius:8, padding:18}}>
        <h3 style={{marginTop:0}}>{initial ? 'Sửa video / Thay thế' : 'Thêm video mới'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:10}}>
            <label style={{display:'block', marginBottom:6}}>Tiêu đề</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:8, borderRadius:6, border:'1px solid #ddd'}} required />
          </div>
          <div style={{marginBottom:12}}>
            <label style={{display:'block', marginBottom:6}}>File video {initial ? '(để trống nếu chỉ muốn đổi metadata - not supported server-side)' : ''}</label>
            <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} />
          </div>
          <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
            <button type="button" onClick={onClose} style={{padding:'8px 12px'}}>Hủy</button>
            <button type="submit" style={{padding:'8px 12px', background:'#e4007f', color:'#fff', border:'none', borderRadius:6}}>{initial ? 'Lưu / Thay thế' : 'Tải lên'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoModal;
