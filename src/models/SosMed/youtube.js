const fs = require('fs');
const { google } = require('googleapis');
const { Readable } = require('stream');

const formatters = require('../../../utils/formatters')
const oauth2Client = require('../../../src/config/config').oauth2Client

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client
});

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

const upload = async (data) => {

  const res = await youtube.videos.insert({
    part: 'snippet,status', // Menentukan bagian mana yang ingin diatur
    requestBody: {
      snippet: {
        title: data.title,
        description: data.description,
        tags: data.tags,
        categoryId: data.categoryId, // 27 adalah Education, 22 adalah People & Blogs
        defaultLanguage: 'id',
        defaultAudioLanguage: 'id'
      },
      status: {
        privacyStatus: data.status,
        selfDeclaredMadeForKids: false,
        publishAt: data.publishDate || null // Opsional: jika ingin dijadwalkan (privasi harus 'private')
      }
    },
    media: {
      body: data.videoStream,
    }
  });

  console.log('Video ID:', res.data.id);
  
  // Jika ingin upload THUMBNAIL setelah video sukses:
  await uploadThumbnail(res.data.id, data.thumbBuffer, data.thumbMime);
}

async function uploadThumbnail(videoId, buffer, mimeType) {

  await youtube.thumbnails.set({
    videoId: videoId,
    media: {
      mimeType: mimeType,
      body: bufferToStream(buffer)
    }
  });
  console.log('Thumbnail berhasil dipasang!');
}

const getChannelStats = async () => {
  const res = await youtube.channels.list({
    part: 'statistics',
    mine: true // Mengambil data channel milik akun yang login
  });

  const stats = res.data.items[0].statistics;
  // console.log('Subscriber:', stats.subscriberCount);
  // console.log('Total View:', stats.viewCount);
  // console.log('Total Video:', stats.videoCount);

  return {
    subscriber: stats.subscriberCount,
    views: stats.viewCount
  }
}

const getFullVideoList = async () => {

  // 1. Dapatkan ID playlist "Uploads"
  const channelRes = await youtube.channels.list({ part: 'contentDetails', mine: true });
  const uploadsId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

  // 2. Ambil daftar dasar video
  const playlistRes = await youtube.playlistItems.list({
    part: 'snippet,contentDetails',
    playlistId: uploadsId,
    maxResults: 50
  });

  const videoIds = playlistRes.data.items.map(v => v.contentDetails.videoId).join(',');

  // 3. Ambil Detail (Penayangan & Durasi)
  const detailRes = await youtube.videos.list({
    part: 'statistics,contentDetails',
    id: videoIds
  });

  // Gabungkan Data
  return playlistRes.data.items.map((item, index) => {
    const detail = detailRes.data.items[index];
    return {
      id: item.contentDetails.videoId,
      title: item.snippet.title,
      views: detail.statistics.viewCount,
      date: item.snippet.publishedAt,
      duration: formatters.formatDurationISOtoMMSS(detail.contentDetails.duration), // Format ISO 8601 (misal: PT5M20S)
      thumbnail: item.snippet.thumbnails.high.url
    };
  });
}

const getKomentarPerVideo = async (videoId, judulVideo) => {
  try {
    const res = await youtube.commentThreads.list({
      part: 'snippet',
      videoId: videoId,
      maxResults: 100 // Mengambil hingga 100 komentar per video
    });

    if (!res.data.items) return [];

    return res.data.items.map(item => {
      const snippet = item.snippet.topLevelComment.snippet;
      return {
        videoTitle: judulVideo,
        user: snippet.authorDisplayName,
        text: snippet.textDisplay,
        time: snippet.publishedAt,
        id: item.snippet.topLevelComment.id
      };
    });
  } catch (error) {
    console.error(`Gagal mengambil komentar untuk video ${videoId}:`, error.message);
    return [];
  }
};

// Fungsi Utama: Mengambil SEMUA komentar di Channel
const getChannelComments = async () => {
  try {
    // 1. Dapatkan playlist "uploads" untuk melihat semua video
    const channelRes = await youtube.channels.list({
      part: 'contentDetails',
      mine: true
    });
    const uploadsPlaylistId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. Ambil daftar video (limit 50 video terbaru)
    const playlistRes = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: 50 
    });

    const daftarVideo = playlistRes.data.items;
    let semuaKomentar = [];

    // 3. Loop setiap video untuk ambil komentarnya
    for (const video of daftarVideo) {
      const videoId = video.snippet.resourceId.videoId;
      const judulVideo = video.snippet.title;
      
      const komentarVideo = await getKomentarPerVideo(videoId, judulVideo);
      semuaKomentar = semuaKomentar.concat(komentarVideo);
    }

    return semuaKomentar;
  } catch (error) {
    console.error("Error ambilSemuaKomentarChannel:", error);
    throw error;
  }
};

// uploadKeYoutube('./SosMed/AA001a_1@_wanawisata-kedungombo--komang-lirik--[event= lt 1 @11-nov-2025] #12-13-2025_19.20.mp4')

module.exports = {
  upload,
  getChannelStats,
  getFullVideoList,
  getChannelComments
}