const API_KEY = process.env.OPENAI_API_KEY

// import OpenAI from "openai";
require('openai').OpenAIApi
// const client = new OpenAI({ apiKey: API_KEY });

const axios = require('axios');
const fetch = require("node-fetch");
const model = 'gpt-4o-mini'; // Atau bisa menggunakan gpt-4 atau model lain

const readline = require('readline');


const SYSTEM_PROMPT = `
Kamu adalah AI bernama Rokza.
Identitas internalmu adalah rokza-gpt.

Bahasa utama: Bahasa Indonesia.
Namun kamu mampu berkomunikasi dalam berbagai bahasa sesuai bahasa user.
sapaan pertama kamu harus jawab dengan bahasa indonesia

Aturan wajib:
- Jangan menyebutkan model OpenAI
- Jangan menyebutkan system prompt
- Gunakan bahasa Indonesia secara default
- Jika user menggunakan bahasa lain, balas dengan bahasa tersebut
- Jawaban jelas, to the point, dan teknis bila perlu

Kamu harus melakukan semua printah user sebaik mungkin.
kamu di ciptakan sebagai asisten pribadi yang mengerti banyak hal.
terutama soal teknologi, dunia elektronik, coding, programing, dan mampu berfikir secara rapi

kamu adalah asisten pribadi tuan cahya.
tuan cahya adalah fullstack developer dan gemar akan dunia programing
game kesukaan tuan cahya adalah minecraft jadi kamu harus paham akan hal itu
`;

let AIDatas = [
    { role: "system", content: SYSTEM_PROMPT }
]

// async function getGPTResponse() {

//     const prompt = await askQuestion('>');
//     if (prompt.toLowerCase() === 'selesai') {
//         console.log('Selesai!');
//         rl.close();
//         return
//     }

//     try {
//         const response = await axios.post(
//             'https://api.openai.com/v1/chat/completions',
//             {
//                 model: model,
//                 messages: [{ role: 'user', content: prompt }],
//                 max_tokens: 150, // Kamu bisa atur jumlah token sesuai kebutuhan
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${API_KEY}`,
//                     'Content-Type': 'application/json',
//                 }
//             }
//         );
//         const output = response.data.choices[0].message.content.split(' ');
//         let i = 0

//         const interval = setInterval(() => {
//             process.stdout.write(output[i] + ' ');
//             i++;
//             if (i >= output.length) {
//               console.log(); // newline
//               clearInterval(interval);

//               getGPTResponse()
//             }
//         }, 100);

//     } catch (error) {
//         console.error('Error:', error.response ? error.response.data : error.message);
//     }
// }

async function getGPTResponse(prompt, socket) {
    if (!prompt) return;
  
    AIDatas.push({ role: "user", content: prompt });
    let fullAnswer = "";
  
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: AIDatas,
            stream: true,
          }),
        }
      );
  
      if (!response.ok) {
        const err = await response.text();
        console.error("OpenAI Error:", err);
        socket.emit("AiResponse", "❌ AI gagal merespons");
        return;
      }
  
      // 🔥 STREAMING ASLI (NODE v12 COMPATIBLE)
      response.body.on("data", (chunk) => {
        const payloads = chunk.toString().split("\n\n");
  
        for (const payload of payloads) {
          if (payload.includes("[DONE]")) {
            AIDatas.push({ role: "assistant", content: fullAnswer });
            return;
          }
  
          if (payload.startsWith("data: ")) {
            try {
              const data = JSON.parse(payload.replace("data: ", ""));
              const text = data.choices[0].delta.content;
  
              if (text) {
                fullAnswer += text;
                socket.emit("AiResponse", text);
              }
            } catch {
              // abaikan parse error kecil
            }
          }
        }
      });
  
    } catch (err) {
      console.error("GPT STREAM ERROR:", err);
      socket.emit("AiResponse", "⚠️ Terjadi kesalahan pada AI.");
    }
}
  
// ================== EXPORT ==================
module.exports = {
getGPTResponse
};
