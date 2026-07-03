/**
 * LKPD Generator AI Backend
 * Endpoint: /api/generate
 * Technology: Vercel Serverless Function & Gemini API
 */

import { GoogleGenAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Only allow POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST instead.' });
    }

    const { 
        jenjang, kelas, mapel, materi, tujuan, model, kesulitan,
        jumlahSoal, bahasa, instruksi, formats, p3List 
    } = req.body;

    // Validate requirements
    if (!mapel || !materi || !tujuan) {
        return res.status(400).json({ error: 'Parameter Wajib Tidak Lengkap (Mata Pelajaran, Materi, atau Tujuan Pembelajaran kosong)!' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Server Konfigurasi Error: GEMINI_API_KEY tidak dikonfigurasi di environment variable Vercel.' });
    }

    try {
        // Construct detailed prompt
        const prompt = `Anda adalah dosen kurikulum modern & asisten pengajar profesional Indonesia. Tugas Anda adalah merancang dokumen Lembar Kerja Peserta Didik (LKPD) yang memiliki format tampilan profesional setara dengan dokumen instansi formal Microsoft Word.
            
Dokumen LKPD harus disesuaikan dengan parameter berikut:
- Jenjang: ${jenjang}
- Kelas: ${kelas}
- Mata Pelajaran: ${mapel}
- Materi Pokok & Topik: ${materi}
- Tujuan Pembelajaran: ${tujuan}
- Model Pembelajaran: ${model}
- Tingkat Kesulitan: ${kesulitan}
- Estimasi Jumlah Soal: ${jumlahSoal} soal
- Format Bahasa: ${bahasa}
- Profil Pelajar Pancasila: ${p3List ? p3List.join(', ') : 'Mandiri, Bernalar Kritis'}
- Format Soal Latihan yang Diinginkan: ${formats ? formats.join(', ') : 'Pilihan Ganda dan Essay'}
- Instruksi Tambahan Khusus: ${instruksi || 'None'}

LKPD yang dihasilkan HARUS memiliki format HTML yang terstruktur, rapi, bersih, dan indah, tanpa tag script, tanpa CSS eksternal (hanya gunakan inline styling dasar jika mutlak diperlukan), dan siap dimasukkan ke dalam elemen visual perwakilan kertas putih A4 di browser.

Struktur LKPD yang harus Anda hasilkan dalam format HTML di dalam parameter 'lkpd_html' adalah:
1. HEADER / KOP RESMI: Berisi tulisan "LEMBAR KERJA PESERTA DIDIK (LKPD)", Nama Sekolah/Instansi (kosongkan titik-titik), Nama Mata Pelajaran, Jenjang/Kelas, Tema/Materi Pokok.
2. IDENTITAS SISWA BOX: Kolom Nama Siswa, Nomor Absen, Hari/Tanggal, Kelompok (buat berupa garis titik-titik rapi agar mudah diisi secara manual dengan pulpen).
3. MATERI PENGANTAR: Berikan ringkasan materi/teori singkat sekitar 2-3 paragraf padat, jelas, mendalam, dan relevan dengan materi ${materi}.
4. TUJUAN & AKTIVITAS UTAMA: Langkah kerja berbasis model pembelajaran ${model} yang melibatkan aktivitas eksplorasi siswa.
5. SOAL LATIHAN / EVALUASI: Berisi ${jumlahSoal} butir soal pilihan yang menantang dan sesuai dengan jenis soal pilihan (${formats ? formats.join(', ') : 'Campuran'}).
6. KOLOM REFLEKSI & PENILAIAN GURU: Kolom komentar guru, tanda tangan orang tua, tanda tangan guru, dan skor/nilai siswa.

PENTING: Seluruh tulisan dilarang menggunakan format markdown. Hasil akhir 'lkpd_html' harus murni berupa tag HTML lengkap terstruktur yang ramah dibaca dan diimplementasi. Pastikan juga bahwa Anda mengembalikan schema JSON yang valid.`;

        // Fetching directly from gemini API via fetch with exponential backoff strategy
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        
        let apiResponse;
        let retries = 5;
        let delay = 1000;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        lkpd_html: { type: "STRING" },
                        metadata: {
                            type: "OBJECT",
                            properties: {
                                title: { type: "STRING" },
                                target_grade: { type: "STRING" },
                                model: { type: "STRING" }
                            },
                            required: ["title"]
                        }
                    },
                    required: ["lkpd_html"]
                }
            }
        };

        for (let i = 0; i < retries; i++) {
            try {
                apiResponse = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (apiResponse.ok) break;
            } catch (e) {
                if (i === retries - 1) throw e;
            }
            
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }

        if (!apiResponse || !apiResponse.ok) {
            return res.status(502).json({ error: "Gagal terhubung ke Gemini API setelah beberapa percobaan kembali." });
        }

        const jsonResult = await apiResponse.json();
        const generatedText = jsonResult.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            return res.status(500).json({ error: 'Respons yang dikembalikan oleh AI kosong.' });
        }

        const finalParsed = JSON.parse(generatedText);
        return res.status(200).json(finalParsed);

    } catch (error) {
        return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
}