const root = document.getElementById("root");

async function loadElement(url) {
  const res = await fetch(url + "?v=" + Date.now());
  const source = await res.text();

  const { code } = Babel.transform(source, {
    presets: ["react"]
  });

  // EKSEKUSI LANGSUNG
  // console.log(code);
  new Function(code)();
}


await loadElement("../src/components/layouts/Sidebar.layout.jsx")
await loadElement("../src/components/layouts/Navbar.layout.jsx")

await loadElement("../src/components/elements/button.element.jsx")
await loadElement("../src/components/elements/input.element.jsx")
await loadElement("../src/components/elements/StatCard.element.jsx")

await loadElement("../src/pages/assistans.pages.jsx")
await loadElement("../src/pages/youtube.pages.jsx")


const getTheme = (darkMode) => ({
  bg: darkMode ? '#0f172a' : '#f8fafc',
  navBg: darkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  sidebarBg: darkMode ? '#1e293b' : '#ffffff',
  text: darkMode ? '#f8fafc' : '#0f172a',
  border: darkMode ? '#334155' : '#e2e8f0',
  accent: '#4f46e5',
  settingsBlue: '#3b82f6',
});

const socket = io({
  transports: ['websocket', 'polling'],
  secure: true
})

let modelsMode;

const { useState, useEffect, useRef } = React;
// const { BrowserRouter, Routes, Route, useNavigate } = ReactRouterDOM;

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  // 1. STATE UNTUK MENYIMPAN RESPONS AI
  // Kita gunakan array agar bisa menampung chat history, bukan cuma 1 pesan
  const [chatHistory, setChatHistory] = useState([]); 
  const [modelsMode, setModelsMode] = useState('GPT'); // Pindahkan ke state

  const theme = getTheme(darkMode);

  // Load Font Awesome
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    // Listener untuk streaming dari AI
    socket.on('AiResponse', (chunk) => {
      setChatHistory(prev => {
        const newHistory = [...prev];
        const lastMessage = newHistory[newHistory.length - 1];

        // Jika pesan terakhir adalah dari AI, sambungkan teksnya
        if (lastMessage && lastMessage.type === 'ai') {
          lastMessage.message += chunk;
          return [...newHistory];
        } else {
          // Jika belum ada pesan AI, buat baris baru
          return [...newHistory, { type: 'ai', message: chunk }];
        }
      });
    });

    return () => socket.off('AiResponse');
  }, []);

  const handleSendToAI = (message) => {
    // Tambahkan pesan user ke layar
    setChatHistory(prev => [...prev, { type: 'user', message: message }]);
    
    // Kirim ke server
    socket.emit("AiPrompt", { prompt: message, model: modelsMode });
  }

  const buttonModelSelect = (model) => {
    setModelsMode(model);
    alert('Model selected: ' + model);
  }

  const containerStyle = {
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: theme.bg,
    color: theme.text,
    transition: 'all 0.3s ease',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  return (
    <div style={containerStyle}>
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} theme={theme} />
      <Sidebar theme={theme} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ 
        marginLeft: '200px', 
        marginTop: '65px', 
        height: 'calc(100vh - 65px)', 
        width: 'calc(100vw - 200px)',
        padding: '0',
        display: 'flex',
        alignItems: 'center', // Memposisikan konten di tengah secara vertikal
        justifyContent: 'center', // Memposisikan konten di tengah secara horizontal
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          // maxWidth: 'calc(100vw - 200px)',   // 🔥 INI KUNCINYA
          // margin: '0 auto'
        }}>
          {activeTab === 'assistans' ? 
          <AssistantView theme={theme} buttonModelSelect={buttonModelSelect} sendToAI={handleSendToAI} chatData={chatHistory} />
          : activeTab === 'youtube' ?
          <YoutubeView theme={darkMode ? 'dark' : 'light'} />
          : 'hy'
          }
        </div>
      </main>
    </div>
  );
};

ReactDOM.render(<App />, root);
