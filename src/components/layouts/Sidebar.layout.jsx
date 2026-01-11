const { useState, useEffect } = React;

const Sidebar = ({ theme, activeTab, setActiveTab }) => {
  const styles = {
    sidebar: {
      position: 'fixed',
      top: '65px',
      left: 0,
      bottom: 0,
      width: '200px',
      minWidth: '200px',
      maxWidth: '200px',
      backgroundColor: theme.sidebarBg,
      borderRight: `1px solid ${theme.border}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem',
      zIndex: 900,
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
    },
    menuLabel: {
      fontWeight: '600', fontSize: '0.75rem', color: theme.text, 
      opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem'
    },
    placeholder: {
      padding: '1.5rem', border: `2px dashed ${theme.border}`, borderRadius: '16px',
      textAlign: 'center', color: theme.text, opacity: 0.5, fontSize: '0.9rem', marginTop: '1rem'
    },
    settingsBtn: {
      width: '100%', padding: '0.85rem', borderRadius: '12px', backgroundColor: theme.settingsBlue,
      color: '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '10px', fontWeight: '600', transition: 'all 0.2s ease',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
    }
  };

  const AssistantIcon = (
    <svg 
      viewBox="0 0 120 120" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Bintang besar - disempurnakan bagian kaki dan sudut tumpul */}
      <path
        d="M40 80
           L32 92
           L36 76
           L22 62
           L40 62
           L50 42
           L60 62
           L78 62
           L64 76
           L68 92
           Z"
        strokeLinejoin="round"
        strokeWidth="6"
        stroke="currentColor"
      />

      {/* Bintang kecil atas - sudut tumpul */}
      <path
        d="M65 25
           L62 32
           L55 35
           L62 38
           L65 45
           L68 38
           L75 35
           L68 32
           Z"
        strokeLinejoin="round"
        strokeWidth="4"
        stroke="currentColor"
      />

      {/* Bintang kecil kanan - sudut tumpul */}
      <path
        d="M85 40
           L82 46
           L76 49
           L82 52
           L85 58
           L88 52
           L94 49
           L88 46
           Z"
        strokeLinejoin="round"
        strokeWidth="4"
        stroke="currentColor"
      />
    </svg>
  );

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.menuLabel}>Panel Kontrol</div>
        <MenuButton 
          label="Assistant" theme={theme} isCustomIcon={true} customSvg={AssistantIcon} 
          active={activeTab === 'assistans'} onClick={() => setActiveTab('assistans')}
        />
        <MenuButton 
          label="Youtube" theme={theme} isCustomIcon={false} icon={'fa-brands fa-youtube'} 
          active={activeTab === 'youtube'} onClick={() => setActiveTab('youtube')}
        />
        <div style={styles.placeholder}>
          <i className="fa-solid fa-plus-circle" style={{ marginBottom: '10px', display: 'block', fontSize: '1.5rem' }}></i>
          <span>Menu Kustom</span>
        </div>
      </div>


      <button 
        style={styles.settingsBtn}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = theme.settingsBlue;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <i className="fa-solid fa-gear"></i>
        <span>Settings</span>
      </button>
    </aside>
  );
};

window.Sidebar = Sidebar;