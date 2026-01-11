const { useState, useEffect } = React;

const AssistantView = ({ theme, buttonModelSelect, sendToAI, chatData }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    margin: 'auto',
    gap: '24px'
  };

  const inputWrapperStyle = {
    width: '100%',
    maxWidth: '800px',
    padding: '12px',
    backgroundColor: theme.inputBg,
    borderRadius: '24px',
    border: `1px solid ${theme.border}`,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle = {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    color: theme.text,
    padding: '12px 16px',
    fontSize: '1.1rem',
    outline: 'none',
  };

  const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '16px',
    backgroundColor: theme.sidebarBg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  };

  const buttonsRowStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  };
  

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>Apa yang boleh saya bantu?</h2>
      <div style={{ 
        width: '100%', // Gunakan 100% dari parent (yang dibatasi oleh AssistantView)
        maxWidth: '800px', // Batas maksimal agar tidak terlalu lebar di layar besar
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px', 
        overflowY: 'auto',
        boxSizing: 'border-box' // Penting agar padding tidak menambah lebar total
      }}>
        {chatData && chatData.map((item, index) => (
          <div key={index} style={{
            alignSelf: item.type === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: item.type === 'user' ? theme.accent : theme.sidebarBg,
            color: item.type === 'user' ? '#fff' : theme.text, // Perbaikan: Sesuaikan warna teks AI agar terbaca
            padding: '10px 15px',
            borderRadius: '10px',
            maxWidth: '70%',
            // TAMBAHKAN DUA BARIS INI:
            wordBreak: 'break-word', 
            whiteSpace: 'pre-wrap', 
            display: 'inline-block'
          }}>
            {/* Pastikan server mengirim text/string, atau akses properti objectnya */}
            {typeof item.message === 'object' ? JSON.stringify(item.message) : item.message}
          </div>
        ))}
      </div>
      <AIModelInput inputWrapperStyle={inputWrapperStyle} inputStyle={inputStyle} theme={theme} sendToAI={sendToAI} />
      <AIModelButton buttonsRowStyle={buttonsRowStyle} actionButtonStyle={actionButtonStyle} theme={theme} buttonModelSelect={buttonModelSelect} />
    </div>
  );
};

window.AssistantView = AssistantView