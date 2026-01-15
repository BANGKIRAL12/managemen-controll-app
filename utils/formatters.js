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

function formatDateToYYYYMMDD(tanggal = new Date(), rentang = 28) {
  const formattedToday = tanggal.toISOString().split('T')[0];
  
  const pastDate = new Date();
  // Kurangi 28 hari dari tanggal saat ini menggunakan setDate()
  pastDate.setDate(tanggal.getDate() - rentang);
  const formattedPastDate = pastDate.toISOString().split('T')[0];

  return {
    today: formattedToday,
    pastDate: formattedPastDate
  }
}

function penguranganJam(jam1, jam2) {
  const [jam1H, jam1M] = jam1.split('.').map(Number);
  const [jam2H, jam2M] = jam2.split('.').map(Number);

  const totalMenit1 = jam1H * 60 + jam1M;
  const totalMenit2 = jam2H * 60 + jam2M;

  const selisihMenit = totalMenit1 - totalMenit2;

  const absSelisihMenit = Math.abs(selisihMenit)

  const jam = Math.floor(selisihMenit / 60);
  const menit = absSelisihMenit % 60;

  return `${jam}.${menit.toString().padStart(2, '0')}`;
}

module.exports = { 
  formatDurationISOtoMMSS,
  formatDateToYYYYMMDD,
  penguranganJam 
}
