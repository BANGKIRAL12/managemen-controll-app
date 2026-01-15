const { useState, useEffect } = React;

// Menambahkan link Font Awesome ke head secara dinamis
const FontAwesomeLink = () => (
  <link 
    rel="stylesheet" 
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
  />
);

const YoutubeView = ({ 
  theme = 'light'
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [initialComments, setInitialComments] = useState([
    { id: 'c1', user: 'Budi Santoso', text: 'Sangat membantu, terima kasih bang!', videoTitle: 'Tutorial React Dasar', time: '2 jam yang lalu' },
    { id: 'c2', user: 'Ani Wijaya', text: 'Kapan upload part 2-nya kak?', videoTitle: 'Belajar Desain UI', time: '5 jam yang lalu' },
    { id: 'c3', user: 'Dimas Pro', text: 'Penjelasannya sangat detail dan mudah dipahami.', videoTitle: 'Tips Fullstack', time: '1 hari yang lalu' },
    { id: 'c4', user: 'Siti Aminah', text: 'Izin bertanya, kalau pake database lain bisa?', videoTitle: 'Node.js API', time: '3 hari yang lalu' },
    { id: 'c5', user: 'Rian Desta', text: 'Wah mantap bener bang ilmunya!', videoTitle: 'React Dasar', time: '4 hari yang lalu' },
    { id: 'c6', user: 'Dewi Lestari', text: 'Semangat terus kontennya!', videoTitle: 'Desain UI Modern', time: '5 hari yang lalu' },
  ])
  const [stats, setStats] = useState({ 
    subscriber: 0,
    watchTime: 0 
  });
  const [videos, setVideos] = useState([
    { id: '1', title: 'Tutorial React Dasar untuk Pemula', views: '1.2K', date: '01 Okt 2023', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80' },
    { id: '2', title: 'Belajar Desain UI Modern dengan CSS', views: '850', date: '05 Okt 2023', duration: '08:20', thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&q=80' },
    { id: '3', title: 'Panduan Firebase Authentication Lengkap', views: '2.5K', date: '12 Okt 2023', duration: '15:10', thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80' },
    { id: '4', title: 'Tips Menjadi Fullstack Developer', views: '5.1K', date: '15 Okt 2023', duration: '22:05', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80' },
    { id: '5', title: 'Membangun API dengan Node.js', views: '3.2K', date: '20 Okt 2023', duration: '18:30', thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&q=80' },
  ]);
  const [topVideo, setTopVideo] = useState([

  ])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/datas")
      .then(res => {
        if (!res.ok) throw new Error("Gagal mengambil data");
        return res.json();
      })
      .then(data => {
        setStats(data[0].count);
        setVideos(data[1])
        setInitialComments(data[2])
        setTopVideo(data[3])
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // State untuk form upload baru
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tagsRaw: '',
    tags: [],
    videoFile: null,
    thumbnailFile: null,
    categoryId: 0,
    status: 'public',
    publishDate: ''
  });

  const isDark = theme === 'dark';

  const colors = {
    bg:       isDark ? '#0F0F0F' : '#F9F9F9',
    textMain: isDark ? '#FFFFFF' : '#0F0F0F',
    textSub:  isDark ? '#AAAAAA' : '#606060',
    border:   isDark ? '#2D2D2D' : '#E5E5E5',
    cardBg:   isDark ? '#1E1E1E' : '#FFFFFF',
    inputBg:  isDark ? '#121212' : '#FFFFFF',
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const array = value.split(' ').filter(tag => tag.trim() !== '');
    setFormData({ ...formData, tagsRaw: value, tags: array });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const dataForm = new FormData();

    dataForm.append("title", formData.title);
    dataForm.append("description", formData.description);
    dataForm.append("tags", JSON.stringify(formData.tags));
    dataForm.append("videoFile", formData.videoFile);
    dataForm.append("imageFile", formData.thumbnailFile);
    dataForm.append("categoryId", formData.categoryId);
    dataForm.append("status", formData.status);
    dataForm.append("Date", formData.publishDate);

    try {
      const res = await axios.post(
        "/upload",
        dataForm
      );

      console.log(res.data);
    } catch (err) {
      console.error(err.response.data || err.message);
    }
  }

  const s = {
    wrapper: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.bg,
      color: colors.textMain,
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      // boxSizing: 'border-box',
    },
    header: {
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${colors.border}`,
      flexShrink: 0
    },
    scrollContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '15px',
    },
    horizontalScroll: {
      display: 'flex',
      gap: '24px',
      overflowX: 'auto',
      paddingBottom: '16px',
      scrollbarWidth: 'thin',
    },
    videoCard: {
      flex: '0 0 280px',
      backgroundColor: colors.cardBg,
      borderRadius: '16px',
      padding: '12px',
      border: `1px solid ${colors.border}`,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    thumbWrapper: {
      position: 'relative', 
      width: '100%', 
      aspectRatio: '16/9',
      borderRadius: '12px',
      overflow: 'hidden'
    },
    durationBadge: {
      position: 'absolute',
      bottom: '8px',
      right: '8px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      fontSize: '11px',
      padding: '2px 6px',
      borderRadius: '4px',
      fontWeight: '500'
    },
    actionOverlay: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      display: 'flex',
      gap: '6px'
    },
    actionBtn: (type) => ({
      backgroundColor: type === 'delete' ? 'rgba(220, 38, 38, 0.9)' : 'rgba(0, 0, 0, 0.6)',
      border: 'none',
      color: 'white',
      width: '28px',
      height: '28px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }),
    // KUNCI: Bagian komentar agar tetap scroll
    commentContainer: {
      backgroundColor: colors.cardBg,
      borderRadius: '16px',
      border: `1px solid ${colors.border}`,
      height: '350px', // Fixed Height agar scroll aktif
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    commentScrollArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 20px',
    },
    btnUpload: {
      backgroundColor: '#CC0000',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(8px)',
      padding: '20px'
    },
    modalContent: {
      backgroundColor: colors.cardBg,
      color: colors.textMain,
      width: '100%',
      maxWidth: '800px',
      maxHeight: '90vh',
      borderRadius: '24px',
      padding: '40px',
      position: 'relative',
      overflowY: 'auto',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '20px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: colors.textSub
    },
    input: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.inputBg,
      color: colors.textMain,
      fontSize: '14px',
      outline: 'none'
    },
    textarea: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.inputBg,
      color: colors.textMain,
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical',
      outline: 'none'
    },
    tagBadge: {
      backgroundColor: '#CC0000',
      color: 'white',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500'
    }
  };

  return (
    <div style={s.wrapper}>
      <FontAwesomeLink />
      
      <header style={s.header}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Studio Konten</h2>
          <p style={{ margin: 0, color: colors.textSub, fontSize: '13px' }}>Manajemen Video Pro</p>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.textSub, fontSize: '14px' }}></i>
            <input 
              placeholder="Cari konten..." 
              style={{ padding: '10px 15px 10px 40px', borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.textMain, width: '300px', fontSize: '14px' }}
            />
          </div>
          <button style={s.btnUpload} onClick={() => setIsUploadModalOpen(true)}>
            <i className="fa-solid fa-plus"></i> Upload
          </button>
        </div>
      </header>

      <div style={s.scrollContainer}>
        
        {/* STATISTIK */}
        <div>
          <div style={s.sectionTitle}>Ringkasan Performa</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <StatCard theme={theme} bg={'#EF4444'} icon={<i className="fa-solid fa-user-plus" style={{ color: '#ffffff' }}></i>} label="Subscriber" value={stats.subscriber} />
            <StatCard theme={theme} bg={'#3B82F6'} icon={<i className="fa-solid fa-thumbs-up" style={{ color: '#ffffff' }}></i>} label="Total Suka" value={stats.likes || 0} />
            <StatCard theme={theme} bg={'#10B981'} icon={<i className="fa-solid fa-hourglass-half" style={{ color: '#ffffff' }}></i>} label="Jumlah Tonton" value={stats.watchTime} />
          </div>
        </div>

        <div id="datastistik" style={{display: 'flex', justifyContent: 'space-between',}}>
          <div style={{width: '75%'}}>
            {/* VIDEOS */}
            <div>
              <div style={s.sectionTitle}>Koleksi Video</div>
              <div style={s.horizontalScroll} className="custom-scroll">
                {videos.map(video => (
                  <div key={video.id} style={s.videoCard}>
                    <div style={s.thumbWrapper}>
                      <img src={video.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="thumb" />
                      <div style={s.durationBadge}>{video.duration}</div>
                      <div style={s.actionOverlay}>
                        <button style={s.actionBtn('edit')}><i className="fa-solid fa-pencil" style={{fontSize: '12px'}}></i></button>
                        <button onClick={() => setVideos(videos.filter(v => v.id !== video.id))} style={s.actionBtn('delete')}><i className="fa-solid fa-trash-can" style={{fontSize: '12px'}}></i></button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', lineHeight: '1.4', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {video.title}
                      </div>
                      <div style={{ fontSize: '12px', color: colors.textSub }}>
                        {video.views} penayangan • {video.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KOMENTAR - TETAP SCROLL */}
            <div style={{ paddingBottom: '40px' }}>
              <div style={s.sectionTitle}>Komentar Terbaru</div>
              <div style={s.commentContainer}>
                <div style={s.commentScrollArea} className="custom-scroll">
                  {initialComments.map(c => (
                    <div key={c.id} style={{ padding: '20px 0', borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: isDark ? '#333' : '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>{c.user ? c.user[1] : '?'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '600' }}>{c.user}</span>
                          <span style={{ color: colors.textSub, marginLeft: '10px', fontSize: '12px' }}>{c.time}</span>
                        </div>
                        <p style={{ margin: '0 0 6px 0', fontSize: '13px', lineHeight: '1.5', color: isDark ? '#EEE' : '#333' }}>{c.text}</p>
                        <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: '500' }}><i className="fa-solid fa-link" style={{marginRight: '4px'}}></i> {c.videoTitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{width: '25%', display: 'flex', justifyContent: 'center'}}>
            <DataCard theme={theme} dataVideo={topVideo} />
          </div>
        </div>
        
      </div>

      {/* MODAL UPLOAD */}
      {isUploadModalOpen && (
        <div style={s.modalOverlay}>
          <div style={s.modalContent} className="custom-scroll">
            <button onClick={() => setIsUploadModalOpen(false)} style={{ position: 'absolute', right: '25px', top: '25px', background: 'none', border: 'none', color: colors.textSub, cursor: 'pointer' }}><i className="fa-solid fa-xmark fa-xl"></i></button>
            <h2 style={{ margin: '0 0 30px 0' }}>Detail Video Baru</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <div style={s.inputGroup}>
                  <label style={s.label}>File Video</label>
                  <input type="file" accept="video/*" onChange={(e) => setFormData({...formData, videoFile: e.target.files[0]})} style={s.input} />
                </div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Judul Video</label>
                  <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Masukkan judul..." style={s.input} />
                </div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Deskripsi</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Deskripsi..." style={s.textarea}></textarea>
                </div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Tags (Spasi)</label>
                  <input value={formData.tagsRaw} onChange={handleTagsChange} placeholder="tag1 tag2" style={s.input} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                    {formData.tags.map((tag, idx) => (
                      <span key={idx} style={s.tagBadge}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Thumbnail</label>
                  <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, thumbnailFile: e.target.files[0]})} style={s.input} />
                </div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Initial Views</label>
                  <input type="number" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} style={s.input} />
                </div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Tanggal Publikasi</label>
                  <input type="date" value={formData.publishDate} onChange={(e) => setFormData({...formData, publishDate: e.target.value})} style={s.input} />
                </div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Privasi</label>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="privacy" value="public" checked={formData.status === 'public'} onChange={(e) => setFormData({...formData, status: e.target.value})} /> Publik
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="privacy" value="private" checked={formData.status === 'private'} onChange={(e) => setFormData({...formData, status: e.target.value})} /> Privat
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
              <button onClick={handleUpload} style={{ ...s.btnUpload, padding: '16px 40px', fontSize: '16px', flex: 1, justifyContent: 'center' }}>
                Publikasikan Sekarang
              </button>
              <button onClick={() => setIsUploadModalOpen(false)} style={{ backgroundColor: colors.border, color: colors.textMain, border: 'none', borderRadius: '12px', padding: '16px 30px', cursor: 'pointer', fontWeight: '600' }}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Scrollbar */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: ${isDark ? '#444' : '#ccc'}; border-radius: 10px; }
        * { box-sizing: border-box; }
        body { margin: 0; }
        input[type="radio"] { accent-color: #CC0000; scale: 1.2; }
      `}</style>
    </div>
  );
};

window.YoutubeView = YoutubeView