const AIModelInput = ({ inputWrapperStyle, inputStyle, theme, sendToAI }) => {
  const handleKeyDown = (e) => {
    // Cek jika tombol yang ditekan adalah 'Enter'
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Jika Shift + Enter, biarkan default behavior (atau tambahkan newline manual)
        // e.preventDefault() tidak digunakan di sini agar newline tetap bisa dimasukkan
        console.log("Shift+Enter ditekan - Newline");
      } else {
        // Jika hanya Enter, jalankan fungsi submit
        e.preventDefault(); // Mencegah newline/submit form bawaan
        sendToAI(document.getElementById("inputPromt").value); document.getElementById('inputPromt').value = ''
      }
    }
  };

  return (
    <div style={inputWrapperStyle}>
      <textarea 
        id="inputPromt"
        type="text" 
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tanya sesuatu..." 
        style={inputStyle} 
      ></textarea>
      <button style={{ 
        backgroundColor: theme.accent, 
        color: 'white', 
        border: 'none', 
        borderRadius: '14px', 
        width: '40px', 
        height: '40px', 
        cursor: 'pointer' 
      }} onClick={() => { sendToAI(document.getElementById("inputPromt").value); document.getElementById('inputPromt').value = '' }}>
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  )
}

window.AIModelInput = AIModelInput