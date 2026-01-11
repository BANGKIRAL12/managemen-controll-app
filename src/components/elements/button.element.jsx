const MenuButton = ({ icon, label, theme, isCustomIcon = false, customSvg = null, active = false, onClick }) => {
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    backgroundColor: active ? theme.accent : 'transparent',
    color: active ? '#ffffff' : theme.text,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    marginBottom: '0.5rem',
    width: '100%',
    textAlign: 'left'
  };

  return (
    <button 
      style={buttonStyle}
      onMouseOver={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = theme.border;
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseOut={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
      onClick={onClick}
    >
      <div style={{ 
        width: '24px', 
        height: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0 
      }}>
        {isCustomIcon ? customSvg : <i className={`fa-solid ${icon}`}></i>}
      </div>
      <span>{label}</span>
    </button>
  );
};

const AIModelButton = ({ buttonsRowStyle, actionButtonStyle, theme, buttonModelSelect }) => {
  return (
    <div style={buttonsRowStyle}>
      {[
        { icon: 'fa-image', label: 'Gemini' },
        { icon: 'fa-code', label: 'GPT' },
        { icon: 'fa-lightbulb', label: 'deepseek' },
        { icon: 'fa-language', label: 'Grok' }
      ].map((btn, idx) => (
        <button 
          key={idx} 
          style={actionButtonStyle}
          onClick={() => buttonModelSelect(btn.label)}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.border}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.sidebarBg}
        >
          <i className={`fa-solid ${btn.icon}`} style={{ color: theme.accent }}></i>
          {btn.label}
        </button>
      ))}
    </div>
  )
}

window.MenuButton = MenuButton
window.AIModelButton = AIModelButton