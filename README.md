# Open Anggaran

Aplikasi berbasis AI untuk menganalisis dan memvisualisasikan data pengadaan barang pemerintah dari SiRUP LKPP. Dirancang untuk membantu masyarakat memahami pola harga pengadaan secara objektif — bukan menuduh, tapi memberi insight.

## Fitur

- **Dashboard Pengadaan** — tampilkan data paket pengadaan barang dari SiRUP LKPP lengkap dengan pagination
- **Halaman Detail** — lihat informasi lengkap per paket pengadaan
- **Analisis AI** — deteksi anomali harga menggunakan AI, memberi label `normal`, `perlu_perhatian`, atau `anomali` berdasarkan perbandingan dengan paket sejenis

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **Template Engine** — EJS
- **Database** — PostgreSQL
- **AI** — Groq API (via fetch)
- **Styling** — Tailwind CSS (CDN)

## Struktur Folder
open-anggaran/
├── config/
│   └── database.js       # koneksi PostgreSQL
├── src/
│   ├── controllers/      # logic request & response
│   ├── models/           # query ke database
│   ├── routes/           # definisi route
│   └── services/         # import CSV & komunikasi AI
├── views/                # template EJS
│   └── partials/
├── public/               # file statis (CSS, JS)
├── data/                 # file Excel SiRUP
├── agent.js              # AI agent — analisis anomali harga
└── app.js                # entry point

## Cara Pakai

### 1. Clone & Install

```bash
git clone https://github.com/username/open-anggaran.git
cd open-anggaran
npm install
```

### 2. Setup Environment

Buat file `.env` berdasarkan `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=open_anggaran
GROQ_API_KEY=your_groq_api_key
```

### 3. Setup Database

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

CREATE TABLE analysis (
  id SERIAL PRIMARY KEY,
  pengadaan_id INTEGER REFERENCES pengadaan(id),
  insight TEXT,
  status VARCHAR(50),
  analyzed_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Import Data

Download file Excel dari [SiRUP LKPP](https://sirup.inaproc.id), filter Jenis Pengadaan = Barang, lalu jalankan:

```bash
node src/services/csvParser.js data/nama-file.xlsx
```

### 5. Jalankan Aplikasi

```bash
npm run dev
```

Buka di browser: `http://localhost:3000`

## Sumber Data

Data bersumber dari **SiRUP LKPP** (Sistem Informasi Rencana Umum Pengadaan) yang merupakan data publik yang disediakan oleh Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP).

## Disclaimer

Aplikasi ini bertujuan untuk transparansi dan edukasi publik. Hasil analisis AI **bukan** merupakan tuduhan pelanggaran hukum. Label `perlu_perhatian` atau `anomali` semata-mata menunjukkan pola yang berbeda dari data sejenis dan perlu dicermati lebih lanjut.

## Lisensi

MIT