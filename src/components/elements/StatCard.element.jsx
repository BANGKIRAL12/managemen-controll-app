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

const DataCard = ({ theme }) => {
  const isDark = theme === 'dark';
  const s = {
    container: {
      margin: '20px',
      width: '100%',
      height: '400px',
      border: 'solid 1px #bdbebf',
      borderRadius: '25px',
      backgroundColor: {backgroundColor: isDark ? '#242424' : '#f2f2f2'},
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

  }
  return (
    <div>
      <div style={s.container}>
        <h1 style={s.judul}>Ringkasan</h1>
        <hr style={s.garis}></hr>
        <div>
          <h1 style={s.dataCount}>224</h1>
          <p style={s.dataJudul}>Views • Last 48 hours</p>
        </div>
        <hr style={s.garis}></hr>
        <div>
          <i style={{margin: '50px 20px'}}>Top Content</i>
        </div>
      </div>

      <div style={s.containerMini}>
        <div style={{width: '45%', aspectRatio: '1/1', backgroundColor: 'red', margin: 'auto', borderRadius: '20px', background: '#f431f7'}}></div>
        <div style={{width: '45%', aspectRatio: '1/1', backgroundColor: 'red', margin: 'auto', borderRadius: '20px', background: '#12e095'}}></div>
        <div style={{width: '45%', aspectRatio: '1/1', backgroundColor: 'red', margin: 'auto', borderRadius: '20px', background: '#25dbe8'}}></div>
        <div style={{width: '45%', aspectRatio: '1/1', backgroundColor: 'red', margin: 'auto', borderRadius: '20px', background: '#9b43e8'}}></div>
      </div>
    </div>
  )
}

window.StatCard = StatCard
window.DataCard = DataCard