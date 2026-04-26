require('dotenv').config();
const XLSX = require('xlsx');
const pool = require('../../config/db');

async function importExcel(filePath) {
    //baca file excelnya dan konversi sheet pertama jadi array of object
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, range: 2 });

    let sukses = 0;
    let skip = 0;

    for (const row of rows) {
        if (!row['ID'] || !row['Paket'] || !row['Pagu (Rp)']) { skip++; continue; }

        try {
            //insert query ke postgres
            await pool.query(
                `INSERT INTO pengadaan
          (sirup_id, nama_paket, pagu_rp, jenis_pengadaan, produk_dalam_negeri, usaha_kecil_koperasi, metode, pemilihan, klpd, satuan_kerja, lokasi)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (sirup_id) DO NOTHING`,
                [
                    row['ID'], row['Paket'], row['Pagu (Rp)'],
                    row['Jenis Pengadaan'], row['Produk Dalam Negeri'],
                    row['Usaha Kecil/Koperasi'], row['Metode'], row['Pemilihan'],
                    row['K/L/PD'], row['Satuan Kerja'], row['Lokasi'],
                ]
            );
            sukses++;
        } catch (err) {
            console.error(`❌ Gagal insert ID ${row['ID']}:`, err.message);
        }
    }

    //tampilkan hasil import dan selesaikan query
    console.log(`✅ Import selesai: ${sukses} berhasil, ${skip} dilewati`);
    await pool.end();
}

// ambil path file dari argument terminal, lalu jalankan fungsi utama
    const filePath = process.argv[2];
    if (!filePath) {
        console.error('Usage: node src/service/csvParser.js <path/to/file.xlsx>');
        process.exit(1);
    }

importExcel(filePath);