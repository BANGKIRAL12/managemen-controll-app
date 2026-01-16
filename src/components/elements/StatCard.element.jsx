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
        <MiniStatsCard bg={'#f431f7'} label={'subscriber'} value={statistik.progress.subGrowth}/>
        <MiniStatsCard bg={'#12e095'} label={'watch time'} value={statistik.progress.watchTimeDiff}/>
        <MiniStatsCard bg={'#25dbe8'} label={'views'} value={statistik.progress.viewsDiff}/>
        <MiniStatsCard bg={'#9b43e8'} label={'likes'} value={statistik.progress.likesDiff}/>
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

const MiniStatsCard = ({ bg, label, value }) => {
  return (
    <div style={{width: '45%', aspectRatio: '1/1', margin: 'auto', borderRadius: '20px', background: bg}}>
      <div style={{margin: '0 20px', fontFamily: 'monospace'}}>
        <h1 style={{margin: '10px 0px 0 0', fontSize: '40px'}}>{value}</h1>
        <p>{label}</p>
      </div>
    </div>
  )
}

window.StatCard = StatCard
window.DataCard = DataCard