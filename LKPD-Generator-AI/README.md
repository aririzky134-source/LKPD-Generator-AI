LKPD Generator AI 📝⚡

Buat Lembar Kerja Peserta Didik (LKPD) Profesional untuk pembelajaran sekolah (sesuai Kurikulum Merdeka) dalam Hitungan Menit menggunakan kecerdasan buatan (AI).

Aplikasi web berarsitektur modern dengan tema gelap premium (SaaS Style) yang terintegrasi langsung dengan serverless backend Vercel dan Gemini API.

🚀 Fitur Utama

Otomatisasi Penuh: AI cerdas menyusun KOP, identitas, rangkuman materi, langkah aktivitas, instrumen evaluasi (Pilihan Ganda, Essay, Isian), dan kolom tanda tangan/nilai.

Dua Mode API:

Vercel API Mode: Menghubungkan secara aman ke backend serverless (menyembunyikan API key dari publik).

Direct Key Mode (Lokal): Memungkinkan pengguna memasukkan API Key Gemini mereka sendiri langsung di browser.

Ekspor Cepat: Unduh dalam format Microsoft Word (.docx) yang siap edit dan cetak mandiri.

Fitur Riwayat: Semua berkas yang digenerasikan otomatis disimpan di localStorage peramban Anda.

Responsif: Berjalan mulus di Desktop, Tablet, maupun Ponsel Pintar.

🛠️ Panduan Instalasi Lokal

Klon repositori ini ke komputer lokal Anda:

git clone [https://github.com/username/LKPD-Generator-AI.git](https://github.com/username/LKPD-Generator-AI.git)
cd LKPD-Generator-AI


Jalankan server lokal (misalnya menggunakan Live Server di VS Code atau Python HTTP Server):

python3 -m http.server 8000


Akses di browser pada tautan: http://localhost:8000

☁️ Langkah Deploy ke Vercel

Unggah ke GitHub: Buat repositori baru di GitHub dan unggah seluruh file ini.

Koneksikan ke Vercel:

Masuk ke dashboard Vercel.

Klik Add New > Project dan pilih repositori GitHub Anda.

Konfigurasi Environment Variable:

Di bagian pengaturan proyek Vercel, masuk ke menu Environment Variables.

Tambahkan variabel berikut:

Key: GEMINI_API_KEY

Value: Isi dengan kunci Gemini API Anda (Dapatkan gratis di Google AI Studio).

Deploy: Klik tombol Deploy dan aplikasi Anda akan online dalam sekejap!

📂 Struktur Berkas Proyek

LKPD-Generator-AI/
│
├── index.html       # Antarmuka Pengguna Utama (Satu Halaman Kompleks)
├── vercel.json      # Konfigurasi routing serverless Vercel
│
├── api/
│   └── generate.js  # Serverless Node.js Function untuk jembatan Gemini API
│
└── README.md        # Dokumentasi dan panduan lengkap ini


🔐 Kode Demo Akses Masuk

Gunakan kode lisensi akses demo berikut saat diminta masuk di halaman login:
AIGENLKPD21