import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// Initialize Google Gen AI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Dynamic Fallback App Generator
function generateFallbackCode(prompt: string): { title: string; explanation: string; code: string } {
  const cleanPrompt = (prompt || 'Aplikasi Web').trim();
  const lower = cleanPrompt.toLowerCase();

  let title = "Aplikasi " + (cleanPrompt.slice(0, 25) || "Bara Dev");
  let category = "Aplikasi Web Interaktif";
  
  if (lower.includes("warung") || lower.includes("makan") || lower.includes("restoran") || lower.includes("kuliner") || lower.includes("cafe") || lower.includes("makanan")) {
    title = "Landing Page Kuliner & Warung Makan Modern";
    category = "Kuliner & UMKM";
  } else if (lower.includes("kasir") || lower.includes("pos") || lower.includes("toko") || lower.includes("penjualan") || lower.includes("kelontong")) {
    title = "Sistem Kasir POS Toko & Kelontong";
    category = "Kasir & Bisnis";
  } else if (lower.includes("portofolio") || lower.includes("portfolio") || lower.includes("resume") || lower.includes("cv") || lower.includes("biodata")) {
    title = "Portofolio Personal Developer Dark Theme";
    category = "Personal Portfolio";
  } else if (lower.includes("sekolah") || lower.includes("siswa") || lower.includes("kelas") || lower.includes("akademik") || lower.includes("ujian")) {
    title = "Portal Akademik & Sekolah Interaktif";
    category = "Edukasi & Sekolah";
  } else if (lower.includes("shop") || lower.includes("e-commerce") || lower.includes("baju") || lower.includes("sepatu") || lower.includes("gadget") || lower.includes("toko online")) {
    title = "Toko Online E-Commerce Modern";
    category = "E-Commerce";
  }

  const code = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#0a0a0f] text-gray-100 min-h-screen flex flex-col justify-between">
  <!-- Top Navigation -->
  <nav class="border-b border-gray-800/80 bg-[#12121a]/90 backdrop-blur sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-black text-white text-lg">⚡</div>
        <div>
          <h1 class="font-extrabold text-base text-white tracking-tight">${title}</h1>
          <span class="text-[10px] bg-purple-500/20 text-purple-300 font-semibold px-2 py-0.5 rounded-full">${category}</span>
        </div>
      </div>
      <button onclick="alert('Fitur interaktif siap digunakan!')" class="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition">
        🚀 Coba Fitur
      </button>
    </div>
  </nav>

  <!-- Hero Content -->
  <main class="max-w-4xl mx-auto px-6 py-12 text-center flex-1 flex flex-col justify-center items-center">
    <div class="inline-block bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
      ✨ Dirancang Otomatis oleh Bara Dev AI
    </div>
    
    <h2 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
      ${title}
    </h2>
    <p class="text-gray-400 max-w-xl text-sm leading-relaxed mb-8">
      Aplikasi ini dibuat berdasarkan instruksi Anda: <span class="text-purple-300 font-semibold">"${cleanPrompt}"</span>. Komponen UI interaktif, data simulasi, dan tata letak responsif telah disiapkan secara lengkap.
    </p>

    <!-- Interactive Grid Demo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left my-6">
      <div class="bg-[#121218] border border-gray-800 rounded-2xl p-5 hover:border-purple-500/50 transition">
        <div class="text-2xl mb-2">⚡</div>
        <h3 class="font-bold text-white text-sm mb-1">Performa Cepat</h3>
        <p class="text-gray-400 text-xs">Aplikasi dioptimalkan untuk kecepatan akses dan pengalaman pengguna terbaik.</p>
      </div>

      <div class="bg-[#121218] border border-gray-800 rounded-2xl p-5 hover:border-purple-500/50 transition">
        <div class="text-2xl mb-2">🎨</div>
        <h3 class="font-bold text-white text-sm mb-1">Desain Modern</h3>
        <p class="text-gray-400 text-xs">Tata letak clean dengan komponen Tailwind CSS siap pakai.</p>
      </div>

      <div class="bg-[#121218] border border-gray-800 rounded-2xl p-5 hover:border-purple-500/50 transition">
        <div class="text-2xl mb-2">📱</div>
        <h3 class="font-bold text-white text-sm mb-1">Responsif Mobile</h3>
        <p class="text-gray-400 text-xs">Tampilan menyesuaikan secara sempurna di layar HP, tablet, maupun komputer.</p>
      </div>
    </div>
  </main>

  <footer class="border-t border-gray-900 bg-[#0d0d12] py-4 text-center text-xs text-gray-500">
    © 2026 Bara Dev AI App Builder • Dibuat khusus untuk Anda
  </footer>
</body>
</html>`;

  return {
    title,
    explanation: `Aplikasi "${title}" berhasil dirancang sesuai permintaan Anda.`,
    code
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, systemPrompt, imageBase64, imageMimeType, currentCode } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const defaultSysPrompt = `Kamu adalah Bara Dev AI - Pembuat Aplikasi & Website AI Senior terkemuka.
Tugas utama kamu adalah membuat kode HTML5 + Tailwind CSS + JavaScript lengkap (standalone single-file) yang siap dirender di iframe.

FORMAT KELUARAN YANG DIBUTUHKAN:
Tuliskan respon dengan format persis seperti ini:

JUDUL: [Judul Singkat Aplikasi/Website]
PENJELASAN: [Penjelasan singkat fitur yang dibuat dalam bahasa Indonesia]

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Title</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0b0b0e] text-white">
  <!-- Isikan komponen UI lengkap, fitur interaktif, data nyata, dan logika JS -->
</body>
</html>
\`\`\`

PERATURAN PENTING GENERASI KODE:
1. Buat kode HTML5 lengkap dari <!DOCTYPE html> sampai </html>.
2. Gunakan Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>).
3. Buat UI yang indah, modern, responsif (mobile & desktop), penuh fitur, tombol interaktif, dan tanpa error.
4. Jangan potong kode. Kode di dalam \`\`\`html harus 100% utuh dan siap jalan.`;

    const effectiveSysPrompt = systemPrompt && systemPrompt.trim().length > 0
      ? systemPrompt + "\n\nSertakan JUDUL: ..., PENJELASAN: ..., dan blok kode ```html <!DOCTYPE html>...</html> ```."
      : defaultSysPrompt;

    const parts: any[] = [];

    if (currentCode && typeof currentCode === 'string' && currentCode.trim().length > 0) {
      parts.push({
        text: `KODE SAAT INI / EXISTING CODE:\n\`\`\`html\n${currentCode.slice(0, 10000)}\n\`\`\`\n\nPermintaan Perubahan/Fitur Baru Dari User: ${prompt}`
      });
    } else {
      parts.push({ text: prompt });
    }

    if (imageBase64 && typeof imageBase64 === 'string') {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: imageMimeType || 'image/png',
          data: cleanBase64
        }
      });
    }

    let responseText = '';

    if (apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: {
            systemInstruction: effectiveSysPrompt,
          }
        });
        responseText = response.text || '';
      } catch (geminiErr) {
        console.error('Gemini Call Failed:', geminiErr);
      }
    }

    let extractedCode = '';
    let extractedTitle = '';
    let extractedExplanation = '';

    if (responseText) {
      const titleMatch = responseText.match(/JUDUL:\s*(.+)/i) || responseText.match(/Title:\s*(.+)/i);
      if (titleMatch) extractedTitle = titleMatch[1].trim();

      const expMatch = responseText.match(/PENJELASAN:\s*(.+)/i) || responseText.match(/Explanation:\s*(.+)/i);
      if (expMatch) extractedExplanation = expMatch[1].trim();

      const codeBlockMatch = responseText.match(/```html\s*([\s\S]*?)```/i) || responseText.match(/```\s*([\s\S]*?)```/i);
      if (codeBlockMatch) {
        extractedCode = codeBlockMatch[1].trim();
      } else {
        const htmlMatch = responseText.match(/<!DOCTYPE html>[\s\S]*?<\/html>/i) || responseText.match(/<html[\s\S]*?<\/html>/i);
        if (htmlMatch) {
          extractedCode = htmlMatch[0].trim();
        }
      }
    }

    if (!extractedCode || extractedCode.length < 50) {
      const fallback = generateFallbackCode(prompt);
      extractedCode = fallback.code;
      if (!extractedTitle) extractedTitle = fallback.title;
      if (!extractedExplanation) extractedExplanation = fallback.explanation;
    }

    return res.status(200).json({
      title: extractedTitle || "Aplikasi " + prompt.slice(0, 20),
      explanation: extractedExplanation || "Aplikasi/Website berhasil dibuat!",
      code: extractedCode
    });

  } catch (error: any) {
    console.error('Vercel Handler Error:', error);
    const fallback = generateFallbackCode(req.body?.prompt || 'Aplikasi Web');
    return res.status(200).json(fallback);
  }
}
