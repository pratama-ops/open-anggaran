require('dotenv').config();
const { pool } = require("../config/db");

async function analyze(id) {
    //ambil data paket yg akan dianalisis
    const paketResult = await pool.query(`SELECT * FROM pengadaan WHERE id = $1`, [id]);

    const paket = paketResult.rows[0];
    if (!paket) throw new Error('Paket tidak ditemukan!!');

    //hitung rata rata
    const rataRataResult = await pool.query(
        `SELECT AVG(pagu_rp) as rata FROM pengadaan WHERE jenis_pengadaan = $1`,
        [paket.jenis_pengadaan]
    );

    const rataRata = parseInt(rataRataResult.rows[0].rata); //ambil hasil dari db dan konversi jadi integer
    const rasio = (parseInt(paket.pagu_rp) / rataRata).toFixed(2); //hitung berapa kali lipat pagu paket dibanding ratarata

    //ambil data paket untuk dibandingkan
    //     const paketBanding = await pool.query(
    //   `SELECT nama_paket, pagu_rp, metode, lokasi 
    //    FROM pengadaan 
    //    WHERE nama_paket ILIKE $1 AND id != $2
    //    LIMIT 10`,
    //   [`%${paket.nama_paket.split(' ').slice(0, 3).join('%')}%`, id]
    // );
    //     const bandingResult = paketBanding.rows;

    //     const rataRata = bandingResult.reduce((sum, p) => sum + parseInt(p.pagu_rp), 0 / bandingResult.length);

    //susun prompt
    const prompt = `
Kamu adalah analis pengadaan barang pemerintah Indonesia yang netral dan objektif.
Tugasmu adalah menilai kewajaran nilai pagu sebuah paket pengadaan berdasarkan konteks nama paket dan pengetahuanmu tentang harga pasar Indonesia.

PENTING:
- Jangan menuduh atau menyimpulkan adanya pelanggaran
- Gunakan bahasa yang netral
- Fokus pada kewajaran harga, bukan asumsi niat

Data paket yang dianalisis:
- Nama: ${paket.nama_paket}
- Nilai Pagu: Rp ${parseInt(paket.pagu_rp).toLocaleString('id-ID')}
- Metode: ${paket.metode}
- K/L/PD: ${paket.klpd}
- Lokasi: ${paket.lokasi}

Gunakan pemahamanmu tentang:
1. Jenis barang/jasa yang dimaksud dari nama paket
2. Harga wajar barang/jasa tersebut di pasar Indonesia
3. Konteks pengadaan pemerintah (pemeliharaan vs pengadaan baru, skala kecil vs besar, dll)

Konteks data pembanding dari database SiRUP:
- Rata-rata pagu pengadaan sejenis: Rp ${rataRata.toLocaleString('id-ID')}
- Rasio pagu paket ini vs rata-rata: ${rasio}x

Kriteria status yang HARUS diikuti:
- normal: rasio antara 0.5x - 1.5x dari rata-rata
- perlu_perhatian: rasio antara 1.5x - 3x dari rata-rata
- anomali: rasio di atas 3x atau di bawah 0.2x dari rata-rata

Gunakan kriteria di atas sebagai acuan utama, bukan intuisi.

Berikan analisis dalam format JSON berikut (langsung JSON, tanpa backtick):
{
  "status": "normal" | "perlu_perhatian" | "anomali",
  "insight": "penjelasan 2-3 kalimat dalam bahasa Indonesia yang netral, jelaskan kenapa nilainya wajar atau tidak wajar berdasarkan konteks barangnya"
}

Kriteria status:
- normal: nilai pagu wajar sesuai konteks barang dan harga pasar
- perlu_perhatian: nilai pagu di luar ekspektasi umum tapi bisa ada penjelasannya
- anomali: nilai pagu sangat tidak wajar untuk konteks barang yang dimaksud
`;

    //kirim ke groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
        }),
    });

    const data = await response.json();
    const text = data.choices[0].message.content;
    const parse = JSON.parse(text);

    //simpan hasil analisis ke tabel
    await pool.query(
        `INSERT INTO analisis (pengadaan_id, status, insight)
   VALUES ($1, $2, $3)
   ON CONFLICT (pengadaan_id) DO UPDATE 
   SET status = $2, insight = $3, analyzed_at = NOW()`,
        [id, parse.status, parse.insight]
    );

    return parse;

}

module.exports = { analyze };