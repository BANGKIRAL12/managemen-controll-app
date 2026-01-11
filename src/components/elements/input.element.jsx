const AIModelInput = ({ inputWrapperStyle, inputStyle, theme, sendToAI }) => {
  return (
    <div style={inputWrapperStyle}>
      <input 
        id="inputPromt"
        type="text" 
        placeholder="Tanya sesuatu..." 
        style={inputStyle} 
      />
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