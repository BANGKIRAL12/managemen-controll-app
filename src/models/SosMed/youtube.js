const fs = require('fs');
const { google } = require('googleapis');
const { Readable } = require('stream');

const formatters = require('../../../utils/formatters')
const oauth2Client = require('../../../src/config/config').oauth2Client

const analytics = google.youtubeAnalytics({
  version: 'v2',
  auth: oauth2Client
});
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

const getChannelDashboardStats = async (
  startDate = formatters.formatDateToYYYYMMDD().pastDate, 
  endDate = formatters.formatDateToYYYYMMDD().today
) => {
  try {

    // Hitung tanggal untuk periode sebelumnya (untuk mencari progres/perbandingan)
    const tglStart = new Date(startDate);
    const tglPrevStart = new Date(tglStart);
    tglPrevStart.setDate(tglStart.getDate() - 28);
    const startDateSebelumnya = tglPrevStart.toISOString().split('T')[0];
    const endDateSebelumnya = new Date(tglStart.getTime() - 86400000).toISOString().split('T')[0];

    // 1. LANGKAH AWAL (Hanya 1x panggil untuk info Channel & Playlist Upload)
    const channelRes = await youtube.channels.list({
      part: 'snippet,statistics,contentDetails',
      mine: true
    });
    
    const channelData = channelRes.data.items[0];
    const masterStats = channelData.statistics;
    const uploadsPlaylistId = channelData.contentDetails.relatedPlaylists.uploads;

    // 2. AMBIL DAFTAR VIDEO (Hanya 1x panggil untuk 50 video terbaru)
    const playlistRes = await youtube.playlistItems.list({
      part: 'snippet,contentDetails',
      playlistId: uploadsPlaylistId,
      maxResults: 50 
    });

    const items = playlistRes.data.items;
    const videoIds = items.map(v => v.contentDetails.videoId).join(',');

    // 3. JALANKAN PROSES PARALEL (Mengambil Detail Video, Analytics, dan Komentar sekaligus)
    // Ini menghemat waktu eksekusi karena semua request berjalan bersamaan
    const [detailRes, analyticsRes, analyticsPrevRes, analyticsYearRes, commentsData] = await Promise.all([
      // Detail Video (Views, Duration, Likes)
      youtube.videos.list({ part: 'statistics,contentDetails', id: videoIds }),
      
      // Analytics Rentang Waktu
      analytics.reports.query({
        ids: 'channel==MINE',
        startDate: startDate,
        endDate: endDate,
        metrics: 'views,subscribersGained,subscribersLost,likes,estimatedMinutesWatched',
      }),
      
      // Analytics Tahunan
      analytics.reports.query({
        ids: 'channel==MINE',
        startDate: formatters.formatDateToYYYYMMDD(new Date(), 365).pastDate,
        endDate: endDate,
        metrics: 'views,subscribersGained,subscribersLost,likes,estimatedMinutesWatched',
      }),

      analytics.reports.query({
        ids: 'channel==MINE',
        startDate: startDateSebelumnya,
        endDate: endDateSebelumnya,
        metrics: 'views,likes',
      }),

      // Ambil Komentar (Looping internal tetap terjadi tapi dijalankan secara paralel)
      Promise.all(items.map(v => getKomentarPerVideo(v.contentDetails.videoId, v.snippet.title)))
    ]);

    // --- PENGOLAHAN DATA ---

    // A. Olah Video List
    const videoList = items.map((item, index) => {
      const detail = detailRes.data.items[index];
      return {
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        views: detail.statistics.viewCount,
        likes: detail.statistics.likeCount,
        date: item.snippet.publishedAt,
        duration: formatters.formatDurationISOtoMMSS(detail.contentDetails.duration),
        thumbnail: item.snippet.thumbnails.high.url
      };
    });

    // B. Hitung Total Like dari 50 video terbaru
    const totalLikes50Videos = detailRes.data.items.reduce((acc, curr) => acc + parseInt(curr.statistics.likeCount || 0), 0);

    // C. Olah Komentar (Meratakan array of arrays menjadi satu array saja)
    const allComments = commentsData.flat();

    // D. Olah Analytics
    const statsNow = analyticsRes.data.rows ? analyticsRes.data.rows[0] : [0, 0, 0, 0, 0];
    const statsPrev = analyticsPrevRes.data.rows ? analyticsPrevRes.data.rows[0] : [0, 0];
    const statsYear = analyticsYearRes.data.rows ? analyticsYearRes.data.rows[0] : [0, 0, 0, 0, 0];

    // Hitung persentase kenaikan/penurunan
    // Hitung Progres Like
    const diffLikes = statsNow[3] - statsPrev[1];
    const likesPerc = statsPrev[1] === 0 ? 100 : ((diffLikes / statsPrev[1]) * 100).toFixed(1);

    // Hitung Progres View
    const diffViews = statsNow[0] - statsPrev[0];
    const viewsPerc = statsPrev[0] === 0 ? 100 : ((diffViews / statsPrev[0]) * 100).toFixed(1);

    return {
      videos: videoList,
      comments: allComments,
      stats: {
        global: {
          subscriber: masterStats.subscriberCount,
          totalViews: masterStats.viewCount,
          totalLikes: totalLikes50Videos,
        },
        range: {
          views: statsNow[0],
          subGained: statsNow[1],
          subLost: statsNow[2],
          netSubs: statsNow[1] - statsNow[2],
          likes: statsNow[3],
          watchTimeHours: (statsNow[4] / 60).toFixed(2)
        },
        progress: {
          subGrowth: (statsNow[1] - statsNow[2]),
          // viewDiff: (masterStats.viewCount - statsNow[0]),
          // Progres Like
          likesDiff: diffLikes,
          likesPercentage: likesPerc,
          isLikesUp: diffLikes >= 0,
          
          // Progres Views
          viewsDiff: diffViews,
          viewsPercentage: viewsPerc,
          isViewsUp: diffViews >= 0,
          watchTimeDiff: formatters.penguranganJam((statsNow[4] / 60).toFixed(2), (statsYear[4] / 60).toFixed(2))
        }
      }
    };
  } catch (error) {
    console.error("Error in getSuperDashboardData:", error);
    throw error;
  }
};

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

const getTop5Videos = async (
  startDate = formatters.formatDateToYYYYMMDD().pastDate, 
  endDate = formatters.formatDateToYYYYMMDD().today
) => {
  try {
    // 1. Ambil ID video terpopuler dari Analytics API
    const analyticsRes = await analytics.reports.query({
      ids: 'channel==MINE',
      startDate: startDate,
      endDate: endDate,
      metrics: 'views',
      dimensions: 'video',
      sort: '-views',
      maxResults: 5
    });

    if (!analyticsRes.data.rows || analyticsRes.data.rows.length === 0) {
      return [];
    }

    // Ambil semua videoId hasil analytics
    const videoIds = analyticsRes.data.rows.map(row => row[0]).join(',');

    // 2. Ambil Judul dan Thumbnail dari Data API v3 menggunakan ID tersebut
    const dataApiRes = await youtube.videos.list({
      part: 'snippet,statistics',
      id: videoIds
    });

    // 3. Gabungkan data Analytics (views) dengan Data API (judul & thumbnail)
    return dataApiRes.data.items.map((item) => {
      // Cari data view yang cocok dari hasil analytics tadi
      const analyticsData = analyticsRes.data.rows.find(row => row[0] === item.id);
      
      return {
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url, // atau .medium.url
        views: analyticsData ? analyticsData[1] : item.statistics.viewCount
      };
    });
  } catch (error) {
    console.error("Error Top 5 Lengkap:", error);
    throw error;
  }
};

// uploadKeYoutube('./SosMed/AA001a_1@_wanawisata-kedungombo--komang-lirik--[event= lt 1 @11-nov-2025] #12-13-2025_19.20.mp4')

module.exports = {
  upload,
  getTop5Videos,
  getChannelDashboardStats,
}