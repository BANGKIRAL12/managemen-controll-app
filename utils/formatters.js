function formatDurationISOtoMMSS(isoDuration) {
  // Regex untuk mencocokkan komponen waktu:
  // P = period, T = time, (\d+H)? = optional hours, (\d+M)? = optional minutes, (\d+S)? = optional seconds
  const regex = /P(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);

  if (!matches) {
    return "00:00"; // Kembali nilai default jika format tidak valid
  }

  // Ekstrak nilai jam, menit, dan detik (jika ada)
  // Gunakan parseInt untuk mengubah string angka menjadi integer
  const hours = parseInt(matches[1]) || 0;
  const minutes = parseInt(matches[2]) || 0;
  const seconds = parseInt(matches[3]) || 0;

  // Total menit (jika jam ada, tambahkan ke menit)
  const totalMinutes = hours * 60 + minutes;

  // Fungsi helper untuk menambahkan '0' di depan angka tunggal (padding)
  const pad = (num) => num.toString().padStart(2, '0');

  // Format output menjadi MM:SS
  return `${pad(totalMinutes)}:${pad(seconds)}`;
}

module.exports = { formatDurationISOtoMMSS }
