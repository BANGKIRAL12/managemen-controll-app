const { useState, useEffect, useRef } = React;

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
    resize: 'none',
    fieldSizing: 'content', /* Otomatis meninggi saat enter */
    maxHeight: '100px',
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

  const renderMarkdown = (text) => {
    const rawHtml = window.marked.parse(text, {
      breaks: true, // Ubah ke false jika ingin jarak enter lebih rapat
      gfm: true
    });
    return { __html: rawHtml };
  };
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (window.hljs) {
      // Mencari semua tag <pre><code> dan mewarnainya
      document.querySelectorAll('pre code').forEach((el) => {
        window.hljs.highlightElement(el);
      });
    }
  }, [chatData]);

  // Tambahkan elemen kosong ini di paling bawah daftar chat:
  // <div ref={chatEndRef} />

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
            maxWidth: item.type === 'user' ? '70%' : '90%',
            // TAMBAHKAN DUA BARIS INI:
            wordBreak: 'break-word', 
            display: 'inline-block'

          }}>
            {item.type === 'user' ? (
              item.message 
            ) : (
              // Gunakan dangerouslySetInnerHTML di sini untuk AI
              <div 
                className="markdown-content"
                dangerouslySetInnerHTML={ renderMarkdown(item.message) } 
              />
            )}
          </div>
        ))}
      </div>
      <AIModelInput inputWrapperStyle={inputWrapperStyle} inputStyle={inputStyle} theme={theme} sendToAI={sendToAI} />
      <AIModelButton buttonsRowStyle={buttonsRowStyle} actionButtonStyle={actionButtonStyle} theme={theme} buttonModelSelect={buttonModelSelect} />
      <style>{`
          /* Container untuk seluruh Markdown */
          .markdown-content {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
          }
          
          /* Styling Blok Kode */
          .markdown-content pre {
            margin: 15px 0;
            padding: 0; /* Padding diatur di dalam code tag oleh hljs */
            border-radius: 8px;
            overflow: hidden; /* Agar sudut tumpul terlihat */
            background-color: #282c34; /* Warna background default Atom One Dark */
          }
          
          .markdown-content pre code {
            display: block;
            padding: 16px;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 14px;
            overflow-x: auto;
            line-height: 1.5;
          }
          
          /* Scrollbar halus untuk kode yang panjang */
          .markdown-content pre code::-webkit-scrollbar {
            height: 8px;
          }
          .markdown-content pre code::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 10px;
          }

          /* Menghilangkan margin default browser pada tag hasil markdown */
          .markdown-content p {
            margin: 0 0 8px 0; /* Jarak bawah antar paragraf hanya 8px */
          }

          .markdown-content p:last-child {
            margin-bottom: 0;
          }

          /* Memastikan pre/code tidak punya margin luar yang besar */
          .markdown-content pre {
            margin: 10px 0;
          }

          /* Jika kamu ingin tulisan 'javascript' muncul lagi sebagai label (Opsional) */
          .markdown-content pre::before {
            content: attr(data-language); /* Butuh tambahan logic JS untuk ini */
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            color: #888;
            margin-bottom: 5px;
          }
      `}</style>
    </div>
  );
};

window.AssistantView = AssistantView