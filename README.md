# Open Anggaran

Aplikasi web berbasis AI untuk membantu publik memahami dan menganalisis pola data pengadaan barang pemerintah Indonesia secara lebih mudah dan transparan. Data bersumber dari **SiRUP LKPP** (Sistem Informasi Rencana Umum Pengadaan).

> ⚠️ Aplikasi ini tidak menuduh atau menyimpulkan adanya pelanggaran hukum. Analisis AI bersifat indikatif dan tidak menggantikan audit resmi oleh lembaga berwenang.

## ✨ Fitur

- **Dashboard Pengadaan**: Tampilkan daftar paket pengadaan barang pemerintah dengan pagination
- **Detail Paket**: Informasi lengkap per paket pengadaan
- **Analisis AI**: Penilaian kewajaran nilai pagu menggunakan Groq API (Llama 3.3 70B)
- **Label Status**: Klasifikasi hasil analisis — Normal, Perlu Perhatian, atau Anomali
- **Responsif**: Dapat diakses dari desktop maupun perangkat mobile

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Template Engine**: EJS
- **AI**: Groq API (Llama 3.3 70B)
- **Styling**: Tailwind CSS

## 📋 Prasyarat

- Node.js v18+
- PostgreSQL
- Groq API Key (gratis di [console.groq.com](https://console.groq.com))

## 🛠️ Instalasi

### 1. Clone repository

```bash
git clone https://github.com/pratama-ops/open-anggaran.git
cd open-anggaran
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variable

Salin `.env.example` menjadi `.env` lalu sesuaikan isinya:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=open_anggaran
GROQ_API_KEY=your_groq_api_key
```

### 4. Buat database

Buat database di PostgreSQL:

```sql
CREATE DATABASE open_anggaran;
```

Lalu buat tabel:

```sql
CREATE TABLE pengadaan (
  id SERIAL PRIMARY KEY,
  sirup_id BIGINT UNIQUE,
  nama_paket TEXT,
  pagu_rp BIGINT,
  jenis_pengadaan VARCHAR(100),
  produk_dalam_negeri VARCHAR(100),
  usaha_kecil_koperasi VARCHAR(100),
  metode VARCHAR(100),
  pemilihan VARCHAR(50),
  klpd VARCHAR(255),
  satuan_kerja VARCHAR(255),
  lokasi VARCHAR(255),
  imported_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE analisis (
  id SERIAL PRIMARY KEY,
  pengadaan_id INTEGER REFERENCES pengadaan(id),
  status VARCHAR(50),
  insight TEXT,
  analyzed_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Import data SiRUP

Download file Excel dari [sirup.lkpp.go.id](https://sirup.lkpp.go.id), pilih filter **Jenis Pengadaan: Barang**, lalu taruh di folder `data/` dan jalankan:

```bash
node src/services/csvParser.js data/nama-file.xlsx
```

### 6. Jalankan aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000` di browser.

## 📁 Struktur Direktori
open-anggaran/
├── config/
│   └── db.js              # Koneksi PostgreSQL
│
├── src/
│   ├── controllers/
│   │   ├── dashboardController.js
│   │   ├── pengadaanController.js
│   │   └── agentController.js
│   │
│   ├── models/
│   │   ├── pengadaan.js
│   │   └── analisis.js
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   └── services/
│       └── csvParser.js   # Import data Excel SiRUP ke database
│
├── views/
│   ├── dashboard.ejs
│   └── detail.ejs
│
├── public/
│
├── data/                  # Taruh file Excel SiRUP di sini
│
├── agent.js               # Logic analisis AI
├── app.js                 # Entry point
└── .env

## ⚠️ Keterbatasan

- Analisis AI menggunakan pengetahuan umum LLM — belum terintegrasi dengan data harga E-Katalog LKPP secara real-time
- Akurasi analisis bergantung pada kelengkapan nama paket di data SiRUP
- Data perlu diupdate manual dengan download ulang dari SiRUP

## 🗺️ Roadmap

- [ ] Integrasi harga E-Katalog LKPP sebagai data pembanding
- [ ] Analisis batch untuk seluruh dataset sekaligus
- [ ] Grafik distribusi nilai pagu per kategori