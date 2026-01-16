const StatCard = ({ icon, label, value, theme, bg }) => {
  const isDark = theme === 'dark';
  return (
    <div style={{ backgroundColor: bg, padding: '20px', borderRadius: '16px', border: `1px solid ${isDark ? '#333' : '#bdbebf'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <div style={{  fontSize: '32px' }}>{icon}</div>
        <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: 'bold' }}>
          <i className="fa-solid fa-arrow-trend-up" style={{ marginRight: '4px' }}></i> +8%
        </div>
      </div>
      <div style={{ color: '#f0f0f0', fontSize: '13px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
    </div>
  );
};

const DataCard = ({ theme, dataVideo, statistik }) => {
  const isDark = theme === 'dark';
  const s = {
    container: {
      margin: '20px',
      width: '100%',
      height: '400px',
      border: 'solid 1px #bdbebf',
      borderRadius: '25px',
      backgroundColor: isDark ? '#242424' : '#f2f2f2',
    },
    containerMini: {
      margin: '20px',
      width: '100%',
      aspectRatio: '1/1',
      display: 'flex',
      flexWrap: 'wrap',
    },
    judul: {
      margin: '20px 10px 0 10px '
    },
    garis: {
      width: '90%',
      margin: '0 auto'
    },
    dataCount: {
      margin: '25px 0 0 25px',
      fontFamily: 'monospace',
      fontSize: '40px'
    },
    dataJudul: {
      margin: '0 25px 25px 25px'
    },
    video: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px',
      borderBottom: '1px solid #eee',
      cursor: 'pointer'
    },
    thumbnail: {
      width: '40px',
      height: '25px',
      objectFit: 'cover',
      borderRadius: '4px'
    },
    info: {
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      margin: 0,
      fontSize: '14px',
      lineHeight: '1.2'
    },
    views: {
      margin: 0,
      fontSize: '12px',
      color: '#666'
    }
  }
  return (
    <div>
      <div style={s.container}>
        <h1 style={s.judul}>Ringkasan</h1>
        <hr style={s.garis}></hr>
        <div>
          <h1 style={s.dataCount}>{statistik.global.totalViews}</h1>
          <p style={s.dataJudul}>Views • Last 48 hours</p>
        </div>
        <hr style={s.garis}></hr>
        <div>
          <i style={{margin: '50px 20px'}}>Top Content</i>
          <div style={{overflowY: 'auto', height: '200px', borderRadius: '20px' }} className="custom-scroll" >
            {dataVideo.map(v => (
              <div key={v.id} style={s.video}>
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  style={s.thumbnail}
                />

                <div style={s.info}>
                  <h6 style={s.title}>{v.title}</h6>
                  <p style={s.views}>{v.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.containerMini}>
        <MiniStatsCard bg={'#f431f7'} label={'subscriber'} value={statistik.progress.subGrowth} />
        <MiniStatsCard bg={'#12e095'} label={'watch time'} value={statistik.progress.watchTimeDiff}/>
        <MiniStatsCard bg={'#25dbe8'} label={'views'} value={statistik.progress.viewsDiff} trend={statistik.progress.isViewsUp ? "up" : "down"} change={statistik.progress.likesPercentage} faIcon={'fas fa-users'} />
        <MiniStatsCard bg={'#9b43e8'} label={'likes'} value={statistik.progress.likesDiff} trend={statistik.progress.isLikesUp ? "up" : "down"} change={statistik.progress.viewsPercentage} faIcon={'fas fa-users'} />
      </div>

      <style>{`
      .custom-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
      .custom-scroll::-webkit-scrollbar-track { background: transparent; }
      .custom-scroll::-webkit-scrollbar-thumb { background: ${isDark ? '#444' : '#ccc'}; border-radius: 10px; }
      * { box-sizing: border-box; }
      body { margin: 0; }
      input[type="radio"] { accent-color: #CC0000; scale: 1.2; }
      `}</style>

    </div>
  )
}

const MiniStatsCard = ({ label, value, change, trend, faIcon, bg }) => {
  // Objek gaya untuk kartu individual
  const cardStyle = {
    width: '45%',
    aspectRatio: '1 / 1',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '1.5rem',
    background: bg,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: 'transform 0.2s ease-in-out',
    cursor: 'pointer',
    margin: 'auto',
  };

  const overlayStyle = {
    position: 'absolute',
    top: '-3rem',
    right: '-3rem',
    width: '8rem',
    height: '8rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    filter: 'blur(32px)',
  };

  const contentStyle = {
    position: 'relative',
    height: '100%',
    width: '100%',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  };

  const iconWrapperStyle = {
    padding: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    backdropFilter: 'blur(8px)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const trendStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: trend === 'up' ? '#6ee7b7' : '#fda4af',
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div style={overlayStyle}></div>
      
      <div style={contentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={iconWrapperStyle}>
            {/* Font Awesome Icon */}
            <i className={faIcon} style={{ color: 'white', fontSize: '1.1rem' }}></i>
          </div>
          <div style={trendStyle}>
            <i className={trend === 'up' ? 'fas fa-arrow-trend-up' : 'fas fa-arrow-trend-down'} style={{ fontSize: '0.8rem' }}></i>
            {change}
          </div>
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '0.75rem', 
            fontWeight: '500', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            margin: '0 0 0.125rem 0'
          }}>
            {label}
          </p>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '900', 
            color: 'white', 
            margin: 0,
            lineHeight: 1 
          }}>
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
};

window.StatCard = StatCard
window.DataCard = DataCard