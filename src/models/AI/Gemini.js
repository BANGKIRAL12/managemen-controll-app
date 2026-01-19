require("dotenv").config();
const println = require('../../../utils/println')
const axios = require("axios");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

/**
 * SYSTEM PROMPT – AI PRIBADI
 */
const SYSTEM_PROMPT = `
Kamu adalah AI bernama Rokza.
Identitas internalmu adalah rokza-genai.

Bahasa utama: Bahasa Indonesia.
Jawaban harus jelas, teknis, dan to the point.

Kamu adalah asisten pribadi milik Cahya,
seorang fullstack web developer.
`;

/**
 * MEMORY AI (PRIBADI)
 */
let chatHistory = [
  {
    role: "user",
    parts: [{ text: SYSTEM_PROMPT }]
  }
];

/**
 * STREAM RESPONSE GEMINI → SOCKET.IO
 */
async function getGeminiResponse(prompt, socket) {
  if (!prompt) return;
  println.info('get', "gemini; mengambil response dari assistant")

  chatHistory.push({
    role: "user",
    parts: [{ text: prompt }]
  });

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${API_KEY}`;

  try {
    const response = await axios({
      method: "post",
      url,
      data: {
        contents: chatHistory
      },
      responseType: "stream"
    });

    let buffer = "";
    let fullAnswer = "";

    response.data.on("data", chunk => {
      buffer += chunk.toString();

      // Gemini stream mengirim ARRAY JSON bertahap
      try {
        const json = JSON.parse(buffer);
        buffer = "";

        json.forEach(event => {
          const text =
            event.candidates[0].content.parts[0].text;

          if (text) {
            fullAnswer += text;
            socket.emit("AiResponse", text);
          }
        });
      } catch {
        // JSON belum lengkap → lanjut buffer
      }
    });

    response.data.on("end", () => {
      chatHistory.push({
        role: "model",
        parts: [{ text: fullAnswer }]
      });
    });

    response.data.on("error", err => {
      println.error('post', "gemini; Error saat melakukan stream:", err.message)
      socket.emit("AiResponse", "❌ Gemini gagal merespons.");
    });
    
  } catch (err) {
    println.error('post', "gemini; Fatal Error:", err.message)
    socket.emit("AiResponse", "⚠️ Terjadi kesalahan pada Gemini AI.");
  }
}

module.exports = {
  getGeminiResponse
};
