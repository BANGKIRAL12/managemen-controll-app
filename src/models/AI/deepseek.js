const axios = require("axios");

const API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-4393486779d84f959b6bfc520a9290d5';

async function chatDeepSeek() {
  try {
    const res = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Kamu adalah asisten AI." },
          { role: "user", content: "Jelaskan apa itu REST API" }
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + API_KEY
        }
      }
    );

    console.log(res.data.choices[0].message.content);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

chatDeepSeek();
