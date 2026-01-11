const { useState, useEffect } = React;

const Navbar = ({ darkMode, toggleDarkMode, theme }) => {
  const styles = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '65px',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.navBg,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${theme.border}`,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      boxShadow: darkMode ? '0 4px 6px -1px rgba(0,0,0,0.2)' : '0 1px 3px 0 rgba(0,0,0,0.05)'
    },
    logoSection: { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },
    logoIcon: { 
      width: '38px', height: '38px', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', borderRadius: '10px', backgroundColor: theme.accent, color: '#ffffff' 
    },
    toggleBtn: { 
      width: '40px', height: '40px', borderRadius: '12px', border: `1px solid ${theme.border}`, 
      backgroundColor: darkMode ? '#334155' : '#f1f5f9', color: darkMode ? '#fbbf24' : '#475569', 
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      transition: 'all 0.2s ease', outline: 'none'
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logoSection}>
        <div style={styles.logoIcon}>
          <i className="fa-solid fa-terminal"></i>
        </div>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Controls App - cahya</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={toggleDarkMode} 
          style={styles.toggleBtn}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <i className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"} style={{fontSize: '18px'}}></i>
        </button>
      </div>
    </nav>
  );
};


window.Navbar = Navbar;