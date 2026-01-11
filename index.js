const express = require('express');
const multer = require('multer');
const http = require('http')
const { Server } = require('socket.io');
const { google } = require('googleapis');
const { Readable } = require('stream');
const app = express();
const server = http.createServer(app)

const io = new Server(server);

require('dotenv').config()

app.set("view engine", "ejs")
app.set("views", "views")

app.use(express.static('public'))
app.use("/src", express.static('src'))
app.use("/library", express.static('library'))

const yt = require('./src/models/SosMed/youtube')
const gpt = require('./src/models/AI/GPT.js')
const gemini = require('./src/models/AI/Gemini.js')

const oauth2Client = require('./src/config/config').oauth2Client

const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // Batas ukuran file misalnya 50MB
    }
});

// 1. Route untuk mulai Login
app.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ]
  });
  res.redirect(url);
});

// 2. Route Callback (Otomatis dipanggil setelah Anda klik "Allow")
app.get('/ytcallback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // INILAH YANG ANDA CARI
    console.log('--- REFRESH TOKEN ANDA ---');
    console.log(tokens.refresh_token);
    console.log('---------------------------');
    
    res.send('Berhasil! Silakan cek terminal/console Anda untuk melihat Refresh Token.');
  } catch (error) {
    res.status(500).send('Error saat menukar kode: ' + error.message);
  }
});

app.post('/upload', upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), async (req, res) => {
  try {
      // Mengambil data teks dari req.body
      const { title, description, tags, categoryId, status, date } = req.body;

      if (!req.files.videoFile || !req.files.imageFile) {
        return res.status(400).json({ error: "File tidak lengkap" });
      }
      
      // Mengambil data file dari req.files
      const videoFile = req.files['videoFile'][0];
      const thumbFile = req.files['imageFile'][0];

      // Parsing tags kembali menjadi array (karena tadi dikirim sebagai string JSON)
      const tagsArray = tags ? JSON.parse(tags) : [];

      const videoStream = new Readable();
      videoStream.push(videoFile.buffer);
      videoStream.push(null);

      const dataPayload = {
        videoStream: videoStream,
        thumbBuffer: thumbFile.buffer,
        thumbMime: thumbFile.mimetype,
        title,
        description,
        tags: tags ? JSON.parse(tags) : [],
        categoryId: categoryId, // Sesuaikan dengan urutan argumen
        status,
        date
      };

      const videoId = await yt.upload(dataPayload);

      res.status(200).json({ message: 'Upload Berhasil!', videoId });

  } catch (error) {
      console.error('Upload Error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan di server.' });
  }
});
app.get('/datas', async (req, res) => {
  try {
    const data1 = await yt.getChannelStats();
    const data2 = await yt.getFullVideoList();
    const data3 = await yt.getChannelComments();
    res.json({ data1: data1, data2: data2, data3: data3 }); // kirim object, bukan hanya subscriber
  } catch (err) {
    console.error("Error /datas:", err.message);
    res.status(500).json({
      error: "Gagal mengambil data channel"
    });
  }
});


io.on('connection', (socket) => {
  socket.on("AiPrompt", async (data) => {
    if (data.model === 'GPT') {
      // Kirim socket ke fungsi agar bisa streaming
      await gpt.getGPTResponse(data.prompt, socket); 
    } 
    if (data.model === "Gemini") {
      await gemini.getGeminiResponse(data.prompt, socket);
    }
  })
})

server.listen(1234, () => {
  console.log('Server jalan di http://localhost:1234');
});