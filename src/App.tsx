import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  MoreHorizontal,
  MoreVertical,
  Eye,
  EyeOff,
  MessageSquare,
  Folder,
  BrainCircuit,
  Settings,
  Plus,
  Send,
  X,
  Sparkles,
  Code,
  Copy,
  Check,
  ExternalLink,
  Download,
  Trash2,
  Globe,
  Palette,
  AlertTriangle,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Zap,
  Layout,
  Layers,
  ShoppingBag,
  Store,
  GraduationCap,
  Briefcase,
  Terminal
} from 'lucide-react';

// --- TYPES ---
type AccentTheme = 'purple' | 'blue' | 'red' | 'green';
type Language = 'id' | 'en';
type ActiveTab = 'chat' | 'projects' | 'system_prompt' | 'settings';
type ViewMode = 'chat' | 'preview' | 'code';
type ProjectTab = 'my_projects' | 'templates';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  image?: string;
  timestamp: string;
}

interface Project {
  id: string;
  title: string;
  explanation: string;
  code: string;
  date: string;
}

interface AccentConfig {
  id: AccentTheme;
  name: { id: string; en: string };
  hex: string;
  bg: string;
  bgHover: string;
  text: string;
  border: string;
  ring: string;
}

// --- ACCENT PALETTE CONFIG (NO GLOW, FLAT SOLID COLORS) ---
const ACCENT_COLORS: Record<AccentTheme, AccentConfig> = {
  purple: {
    id: 'purple',
    name: { id: 'Ungu', en: 'Purple' },
    hex: '#8B5CF6',
    bg: 'bg-[#8B5CF6]',
    bgHover: 'hover:bg-[#7C3AED]',
    text: 'text-[#8B5CF6]',
    border: 'border-[#8B5CF6]',
    ring: 'ring-[#8B5CF6]',
  },
  blue: {
    id: 'blue',
    name: { id: 'Biru', en: 'Blue' },
    hex: '#3B82F6',
    bg: 'bg-[#3B82F6]',
    bgHover: 'hover:bg-[#2563EB]',
    text: 'text-[#3B82F6]',
    border: 'border-[#3B82F6]',
    ring: 'ring-[#3B82F6]',
  },
  red: {
    id: 'red',
    name: { id: 'Merah', en: 'Red' },
    hex: '#EF4444',
    bg: 'bg-[#EF4444]',
    bgHover: 'hover:bg-[#DC2626]',
    text: 'text-[#EF4444]',
    border: 'border-[#EF4444]',
    ring: 'ring-[#EF4444]',
  },
  green: {
    id: 'green',
    name: { id: 'Hijau', en: 'Green' },
    hex: '#22C55E',
    bg: 'bg-[#22C55E]',
    bgHover: 'hover:bg-[#16A34A]',
    text: 'text-[#22C55E]',
    border: 'border-[#22C55E]',
    ring: 'ring-[#22C55E]',
  },
};

// --- DICTIONARY FOR I18N ---
const TRANSLATIONS = {
  id: {
    appName: "Bara Dev",
    tagline: "Chat jadi Aplikasi & Website",
    emptyTitle: "Mau bikin apa hari ini di Bara Dev?",
    emptyDesc: "Ketik ide aplikasi atau website impianmu di bawah ini, atau pilih contoh ide seru.",
    chatPlaceholder: "Tanyakan, buat aplikasi...",
    preview: "Preview",
    code: "Kode",
    togglePreview: "Sembunyikan Preview",
    showPreview: "Tampilkan Preview",
    chatAndPreview: "Chat & Preview",
    projects: "Project",
    systemPrompt: "System Prompt",
    settings: "Setting",
    footerVer: "Bara Dev V1",
    myProjects: "My Project",
    templates: "Templates",
    noProjectsYet: "Belum ada project tersimpan",
    noProjectsDesc: "Project yang kamu buat melalui chat akan otomatis muncul di sini.",
    presetPrompts: "Preset System Prompt",
    websiteExpert: "Website Expert: Kamu adalah expert tailwind dan landing page premium...",
    appBuilder: "App Builder: Kamu adalah senior React developer, buat aplikasi fungsional...",
    uiuxPremium: "UI/UX Premium: Fokus ke desain minimalis, clean, modern...",
    savePrompt: "Simpan System Prompt",
    promptSaved: "System prompt berhasil disimpan!",
    themeTitle: "A. Ganti Tema",
    themeDesc: "Pilih warna aksen solid favoritmu (flat solid color, tanpa glow)",
    languageTitle: "B. Bahasa",
    languageDesc: "Atur bahasa antarmuka aplikasi",
    dangerZoneTitle: "C. Danger Zone",
    deleteAllProjects: "Hapus Semua Project",
    modalDeleteTitle: "Yakin mau hapus semua project?",
    modalDeleteDesc: "Aksi ini tidak bisa dibatalkan. Semua data project di penyimpanan lokal akan terhapus secara permanen.",
    cancel: "Batal",
    confirmDelete: "Oke",
    copyCode: "Salin Kode",
    copied: "Tersalin!",
    downloadHtml: "Unduh HTML",
    openNewTab: "Buka di Tab Baru",
    sending: "Menganalisis & Mengode...",
    purple: "Ungu",
    blue: "Biru",
    red: "Merah",
    green: "Hijau",
    useTemplate: "Gunakan Template",
    createdOn: "Dibuat pada",
    deleteProject: "Hapus",
    uploadImageTooltip: "Upload foto referensi (PNG/JPG)",
    generatingMessage: "Bara Dev AI sedang merancang & mengode aplikasi kamu...",
    suggestions: [
      "Landing Page Warung Makan Modern dengan Menu Interaktif & WA",
      "Aplikasi Kasir POS Toko Kelontong dengan Hitung Kembalian",
      "Portfolio Developer Dark Theme dengan Grid Proyek & Form Kontak",
      "Portal Sekolah dengan Jadwal Pelajaran & Status Absensi"
    ]
  },
  en: {
    appName: "Bara Dev",
    tagline: "Chat into App & Website",
    emptyTitle: "What do you want to build today with Bara Dev?",
    emptyDesc: "Type your dream app or website idea below, or pick from our suggested ideas.",
    chatPlaceholder: "Ask, build an app...",
    preview: "Preview",
    code: "Code",
    togglePreview: "Hide Preview",
    showPreview: "Show Preview",
    chatAndPreview: "Chat & Preview",
    projects: "Projects",
    systemPrompt: "System Prompt",
    settings: "Settings",
    footerVer: "Bara Dev V1",
    myProjects: "My Projects",
    templates: "Templates",
    noProjectsYet: "No saved projects yet",
    noProjectsDesc: "Projects created via chat will automatically appear here.",
    presetPrompts: "Preset System Prompts",
    websiteExpert: "Website Expert: You are a tailwind expert & premium landing page builder...",
    appBuilder: "App Builder: You are a senior React developer building functional apps...",
    uiuxPremium: "UI/UX Premium: Focus on minimal, clean, modern design...",
    savePrompt: "Save System Prompt",
    promptSaved: "System prompt saved successfully!",
    themeTitle: "A. Change Theme",
    themeDesc: "Choose your favorite solid accent color (flat color, no glow)",
    languageTitle: "B. Language",
    languageDesc: "Configure application interface language",
    dangerZoneTitle: "C. Danger Zone",
    deleteAllProjects: "Delete All Projects",
    modalDeleteTitle: "Are you sure you want to delete all projects?",
    modalDeleteDesc: "This action cannot be undone. All project data in local storage will be permanently deleted.",
    cancel: "Cancel",
    confirmDelete: "OK",
    copyCode: "Copy Code",
    copied: "Copied!",
    downloadHtml: "Download HTML",
    openNewTab: "Open in New Tab",
    sending: "Analyzing & Coding...",
    purple: "Purple",
    blue: "Blue",
    red: "Red",
    green: "Green",
    useTemplate: "Use Template",
    createdOn: "Created on",
    deleteProject: "Delete",
    uploadImageTooltip: "Upload reference photo (PNG/JPG)",
    generatingMessage: "Bara Dev AI is designing & coding your app...",
    suggestions: [
      "Modern Food Stall Landing Page with Interactive Menu & WA Order",
      "Grocery Store POS Cashier App with Change Calculator",
      "Dark Theme Developer Portfolio with Project Grid & Contact Form",
      "School Portal App with Timetable Schedule & Attendance Status"
    ]
  }
};

// --- PRESET SYSTEM PROMPTS ---
const PRESET_PROMPTS = {
  websiteExpert: `Website Expert: Kamu adalah expert Tailwind CSS dan pembuat landing page premium. Buatlah antarmuka web yang ultra-clean, responsif, berdesain kontemporer, berkecepatan tinggi, dengan tipografi rapi dan salinan pemasaran yang memikat.`,
  appBuilder: `App Builder: Kamu adalah senior React & Fullstack Developer. Buatlah aplikasi web interaktif fungsional dengan penanganan state lengkap, validasi form, fitur pencarian & filter, serta struktur logika JavaScript yang kuat.`,
  uiuxPremium: `UI/UX Premium: Fokus ke desain minimalis, clean, dan modern. Utamakan hierarki visual yang jelas, kontras warna tinggi, penggunaan ruang kosong (spacing) yang seimbang, serta pengalaman pengguna yang mulus dan elegan.`
};

// --- PRE-BUILT READY TEMPLATES ---
const TEMPLATES: (Project & { icon: any; category: string })[] = [
  {
    id: 'tpl-warung',
    title: 'Landing Page Warung Makan',
    explanation: 'Landing page warung makan kuliner nusantara dengan menu interaktif, filter kategori, keranjang belanja, dan pemesanan WhatsApp langsung.',
    icon: Store,
    category: 'Kuliner & UMKM',
    date: '2026-09-30',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Warung Makan Berkah - Kuliner Nusantara</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-[#0b0b0e] text-gray-100 min-h-screen">
  <!-- Header Navbar -->
  <nav class="border-b border-gray-800 bg-[#121216]/90 backdrop-blur sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-black text-xl">🍜</div>
        <div>
          <h1 class="font-extrabold text-lg tracking-tight text-white">Warung Makan Berkah</h1>
          <p class="text-xs text-amber-400 font-medium">Spesialis Masakan Rasa Bintang Lima</p>
        </div>
      </div>
      <button onclick="toggleCart()" class="relative bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition">
        🛒 Keranjang
        <span id="cart-count" class="bg-black text-amber-400 text-xs px-2 py-0.5 rounded-full font-extrabold">0</span>
      </button>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="max-w-6xl mx-auto px-4 py-12 text-center">
    <span class="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Lezat • Halal • Terjangkau</span>
    <h2 class="text-4xl md:text-5xl font-black text-white mt-4 tracking-tight leading-tight">Nikmati Kelezatan Kuliner<br><span class="text-amber-400">Nusantara Asli</span></h2>
    <p class="text-gray-400 mt-3 max-w-xl mx-auto text-sm">Resep warisan keluarga sejak 1998 dengan bumbu rempah pilihan. Siap diantar langsung ke rumahmu!</p>
  </section>

  <!-- Menu Grid -->
  <section class="max-w-6xl mx-auto px-4 pb-20">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-white flex items-center gap-2">🔥 Menu Favorit Hari Ini</h3>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="menu-container"></div>
  </section>

  <!-- Cart Drawer Modal -->
  <div id="cart-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex justify-end">
    <div class="bg-[#141419] w-full max-w-md h-full p-6 flex flex-col border-l border-gray-800">
      <div class="flex justify-between items-center pb-4 border-b border-gray-800">
        <h3 class="text-lg font-bold text-white">Keranjang Pesanan</h3>
        <button onclick="toggleCart()" class="text-gray-400 hover:text-white font-bold text-xl">&times;</button>
      </div>
      <div id="cart-items" class="flex-1 overflow-y-auto py-4 space-y-3"></div>
      <div class="border-t border-gray-800 pt-4 space-y-3">
        <div class="flex justify-between text-gray-300 font-bold text-lg">
          <span>Total:</span>
          <span id="cart-total" class="text-amber-400">Rp 0</span>
        </div>
        <button onclick="checkoutWA()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
          📲 Pesan via WhatsApp
        </button>
      </div>
    </div>
  </div>

  <script>
    const menus = [
      { id: 1, name: "Nasi Goreng Spesial Berkah", price: 25000, desc: "Ayam suwir, telur mata sapi, kerupuk & acar segar", img: "🍳" },
      { id: 2, name: "Soto Ayam Kampung Bening", price: 22000, desc: "Kuah rempah gurih, koya renyah, bihun & perasan jeruk nipis", img: "🍲" },
      { id: 3, name: "Ayam Bakar Madu Pedas Manis", price: 28000, desc: "Ayam bakar pilihan dioles bumbu madu dan sambal terasi", img: "🍗" },
      { id: 4, name: "Es Teh Manis Jumbo", price: 6000, desc: "Teh pilihan diseduh segar manis pas meluruhkan dahaga", img: "🍹" },
      { id: 5, name: "Es Jeruk Peras Murni", price: 8000, desc: "Jeruk peras murni kaya vitamin C", img: "🍊" }
    ];

    let cart = [];

    function renderMenu() {
      const container = document.getElementById('menu-container');
      container.innerHTML = menus.map(item => \`
        <div class="bg-[#16161c] border border-gray-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/50 transition">
          <div>
            <div class="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-4xl mb-4">\${item.img}</div>
            <h4 class="font-bold text-lg text-white mb-1">\${item.name}</h4>
            <p class="text-gray-400 text-xs mb-4 leading-relaxed">\${item.desc}</p>
          </div>
          <div class="flex justify-between items-center pt-3 border-t border-gray-800/60">
            <span class="font-extrabold text-amber-400 text-base">Rp \${item.price.toLocaleString('id-ID')}</span>
            <button onclick="addToCart(\${item.id})" class="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-bold px-3 py-1.5 rounded-xl text-xs transition">
              + Tambah
            </button>
          </div>
        </div>
      \`).join('');
    }

    function addToCart(id) {
      const item = menus.find(m => m.id === id);
      const existing = cart.find(c => c.id === id);
      if(existing) {
        existing.qty++;
      } else {
        cart.push({ ...item, qty: 1 });
      }
      updateCartUI();
    }

    function updateCartUI() {
      const countEl = document.getElementById('cart-count');
      const totalEl = document.getElementById('cart-total');
      const itemsEl = document.getElementById('cart-items');

      const totalCount = cart.reduce((acc, curr) => acc + curr.qty, 0);
      const totalPrice = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

      countEl.innerText = totalCount;
      totalEl.innerText = "Rp " + totalPrice.toLocaleString('id-ID');

      if(cart.length === 0) {
        itemsEl.innerHTML = '<p class="text-gray-500 text-center text-sm py-10">Keranjang masih kosong</p>';
        return;
      }

      itemsEl.innerHTML = cart.map(item => \`
        <div class="bg-[#1a1a22] p-3 rounded-xl flex justify-between items-center">
          <div>
            <div class="font-bold text-sm text-white">\${item.name}</div>
            <div class="text-xs text-amber-400 font-semibold">Rp \${item.price.toLocaleString('id-ID')} x \${item.qty}</div>
          </div>
          <div class="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg">
            <button onclick="changeQty(\${item.id}, -1)" class="text-gray-400 hover:text-white font-bold px-1.5">-</button>
            <span class="text-xs font-bold text-white">\${item.qty}</span>
            <button onclick="changeQty(\${item.id}, 1)" class="text-gray-400 hover:text-white font-bold px-1.5">+</button>
          </div>
        </div>
      \`).join('');
    }

    function changeQty(id, delta) {
      const item = cart.find(c => c.id === id);
      if(!item) return;
      item.qty += delta;
      if(item.qty <= 0) {
        cart = cart.filter(c => c.id !== id);
      }
      updateCartUI();
    }

    function toggleCart() {
      const modal = document.getElementById('cart-modal');
      modal.classList.toggle('hidden');
    }

    function checkoutWA() {
      if(cart.length === 0) return alert('Keranjang masih kosong!');
      let msg = "Halo Warung Makan Berkah, saya mau pesan:%0A";
      cart.forEach((c, idx) => {
        msg += \`\${idx+1}. \${c.name} (\${c.qty}x) = Rp \${(c.price * c.qty).toLocaleString('id-ID')}%0A\`;
      });
      const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
      msg += \`%0ATotal Pembayaran: Rp \${total.toLocaleString('id-ID')}\`;
      window.open(\`https://wa.me/6281234567890?text=\${msg}\`, '_blank');
    }

    renderMenu();
  </script>
</body>
</html>`
  },
  {
    id: 'tpl-kasir',
    title: 'Aplikasi Kasir POS (Kasirku)',
    explanation: 'Sistem Kasir POS interaktif lengkap dengan hitung total otomatis, metode pembayaran, kalkulator kembalian, dan cetak struk rekap.',
    icon: ShoppingBag,
    category: 'Bisnis & Kasir',
    date: '2026-09-30',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kasirku POS System</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#09090c] text-gray-100 h-screen overflow-hidden flex flex-col">
  <header class="bg-[#121218] border-b border-gray-800 px-6 py-3 flex justify-between items-center">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">⚡</div>
      <span class="font-extrabold text-lg text-white">Kasirku <span class="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">POS PRO</span></span>
    </div>
    <div class="text-xs text-gray-400 font-mono">Shift Active: Kasir 01 • Tanggal: <span id="current-date"></span></div>
  </header>

  <div class="flex-1 flex overflow-hidden">
    <!-- Products Panel -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="flex gap-2 mb-6">
        <input type="text" id="search" placeholder="Cari nama barang..." oninput="filterProducts()" class="bg-[#16161e] border border-gray-800 text-sm px-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-indigo-500 w-full">
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="products-grid"></div>
    </div>

    <!-- Right Order Summary -->
    <div class="w-96 bg-[#121218] border-l border-gray-800 flex flex-col p-5">
      <h3 class="font-bold text-white text-base mb-4 flex justify-between">
        <span>Ringkasan Item</span>
        <span class="text-xs text-indigo-400 cursor-pointer" onclick="clearCart()">Reset</span>
      </h3>
      
      <div id="cart-list" class="flex-1 overflow-y-auto space-y-3 pr-1"></div>

      <div class="border-t border-gray-800 pt-4 space-y-3 mt-auto">
        <div class="flex justify-between text-xs text-gray-400">
          <span>Subtotal</span>
          <span id="subtotal">Rp 0</span>
        </div>
        <div class="flex justify-between text-xs text-gray-400">
          <span>Pajak (10%)</span>
          <span id="tax">Rp 0</span>
        </div>
        <div class="flex justify-between text-lg font-black text-white pt-2 border-t border-gray-800">
          <span>Total</span>
          <span id="grand-total" class="text-indigo-400">Rp 0</span>
        </div>

        <div class="pt-2">
          <label class="text-xs text-gray-400 block mb-1">Uang Diterima (Rp)</label>
          <input type="number" id="cash-input" oninput="calculateChange()" placeholder="Contoh: 100000" class="w-full bg-[#1c1c24] border border-gray-700 text-sm px-3 py-2 rounded-xl text-white font-bold focus:outline-none focus:border-indigo-500">
        </div>
        <div class="flex justify-between text-xs font-bold text-emerald-400">
          <span>Kembalian:</span>
          <span id="change-text">Rp 0</span>
        </div>

        <button onclick="processPayment()" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition text-sm">
          💳 Selesaikan Pembayaran
        </button>
      </div>
    </div>
  </div>

  <script>
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('id-ID');

    const products = [
      { id: 1, name: "Kopi Espresso Single", price: 18000, icon: "☕" },
      { id: 2, name: "Roti Bakar Coklat Keju", price: 22000, icon: "🍞" },
      { id: 3, name: "Matcha Latte Ice", price: 25000, icon: "🍵" },
      { id: 4, name: "French Fries Crispy", price: 15000, icon: "🍟" },
      { id: 5, name: "Burger Sapi Spesial", price: 32000, icon: "🍔" },
      { id: 6, name: "Air Mineral 600ml", price: 5000, icon: "💧" },
    ];

    let cart = [];

    function renderProducts(list = products) {
      const grid = document.getElementById('products-grid');
      grid.innerHTML = list.map(p => \`
        <div onclick="addToCart(\${p.id})" class="bg-[#16161e] border border-gray-800/80 rounded-2xl p-4 cursor-pointer hover:border-indigo-500 transition flex flex-col items-center text-center">
          <div class="text-4xl mb-2">\${p.icon}</div>
          <div class="font-bold text-xs text-white mb-1 line-clamp-1">\${p.name}</div>
          <div class="text-indigo-400 font-extrabold text-xs">Rp \${p.price.toLocaleString('id-ID')}</div>
        </div>
      \`).join('');
    }

    function filterProducts() {
      const q = document.getElementById('search').value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(q));
      renderProducts(filtered);
    }

    function addToCart(id) {
      const item = products.find(p => p.id === id);
      const existing = cart.find(c => c.id === id);
      if(existing) existing.qty++;
      else cart.push({ ...item, qty: 1 });
      updateCartUI();
    }

    function updateCartUI() {
      const listEl = document.getElementById('cart-list');
      if(cart.length === 0) {
        listEl.innerHTML = '<p class="text-gray-500 text-xs text-center py-10">Pilih barang untuk menambah pesanan</p>';
      } else {
        listEl.innerHTML = cart.map(c => \`
          <div class="bg-[#181822] p-2.5 rounded-xl flex justify-between items-center text-xs">
            <div>
              <div class="font-bold text-white">\${c.name}</div>
              <div class="text-gray-400">Rp \${c.price.toLocaleString('id-ID')} x \${c.qty}</div>
            </div>
            <div class="font-bold text-indigo-400">Rp \${(c.price * c.qty).toLocaleString('id-ID')}</div>
          </div>
        \`).join('');
      }

      const subtotal = cart.reduce((a, b) => a + (b.price * b.qty), 0);
      const tax = Math.round(subtotal * 0.1);
      const grandTotal = subtotal + tax;

      document.getElementById('subtotal').innerText = 'Rp ' + subtotal.toLocaleString('id-ID');
      document.getElementById('tax').innerText = 'Rp ' + tax.toLocaleString('id-ID');
      document.getElementById('grand-total').innerText = 'Rp ' + grandTotal.toLocaleString('id-ID');
      calculateChange();
    }

    function calculateChange() {
      const cash = parseFloat(document.getElementById('cash-input').value) || 0;
      const subtotal = cart.reduce((a, b) => a + (b.price * b.qty), 0);
      const grandTotal = subtotal + Math.round(subtotal * 0.1);
      const change = cash - grandTotal;
      document.getElementById('change-text').innerText = 'Rp ' + (change >= 0 ? change.toLocaleString('id-ID') : 0);
    }

    function clearCart() { cart = []; updateCartUI(); }

    function processPayment() {
      if(cart.length === 0) return alert('Pilih barang terlebih dahulu!');
      alert('Pembayaran Sukses! Struk berhasil dicetak.');
      clearCart();
      document.getElementById('cash-input').value = '';
    }

    renderProducts();
    updateCartUI();
  </script>
</body>
</html>`
  },
  {
    id: 'tpl-portfolio',
    title: 'Portfolio Developer Dark',
    explanation: 'Website portofolio pengembang perangkat lunak bergaya dark premium dengan daftar skill, kartu proyek, dan formulir kontak interaktif.',
    icon: Briefcase,
    category: 'Personal Portfolio',
    date: '2026-09-30',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Budi Pratama - Senior Fullstack Engineer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#07070a] text-gray-100 min-h-screen">
  <nav class="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
    <div class="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
      <span class="text-purple-500">&lt;/&gt;</span> Budi.dev
    </div>
    <div class="flex gap-6 text-xs font-semibold text-gray-400">
      <a href="#about" class="hover:text-purple-400 transition">Tentang</a>
      <a href="#projects" class="hover:text-purple-400 transition">Proyek</a>
      <a href="#contact" class="hover:text-purple-400 transition">Kontak</a>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="about" class="max-w-5xl mx-auto px-6 py-20">
    <div class="inline-block bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
      🚀 Tersedia untuk Freelance & Full-time
    </div>
    <h1 class="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
      Membangun Solusi Digital<br>
      <span class="text-purple-500">Cepat, Indah & Skalabel</span>
    </h1>
    <p class="text-gray-400 max-w-2xl text-base leading-relaxed mb-8">
      Saya seorang Fullstack Web Developer berpengalaman 5+ tahun dalam merancang aplikasi React, Node.js, dan arsitektur Cloud modern.
    </p>

    <!-- Tech Stack Tags -->
    <div class="flex flex-wrap gap-2 mb-12">
      <span class="bg-[#14141c] border border-gray-800 text-xs text-gray-300 font-semibold px-3 py-1.5 rounded-lg">TypeScript</span>
      <span class="bg-[#14141c] border border-gray-800 text-xs text-gray-300 font-semibold px-3 py-1.5 rounded-lg">React / Next.js</span>
      <span class="bg-[#14141c] border border-gray-800 text-xs text-gray-300 font-semibold px-3 py-1.5 rounded-lg">Tailwind CSS</span>
      <span class="bg-[#14141c] border border-gray-800 text-xs text-gray-300 font-semibold px-3 py-1.5 rounded-lg">Node.js / Express</span>
      <span class="bg-[#14141c] border border-gray-800 text-xs text-gray-300 font-semibold px-3 py-1.5 rounded-lg">PostgreSQL / Cloud SQL</span>
    </div>
  </section>

  <!-- Projects Grid -->
  <section id="projects" class="max-w-5xl mx-auto px-6 py-12 border-t border-gray-900">
    <h2 class="text-2xl font-bold text-white mb-8 flex items-center gap-2">✨ Karya Unggulan</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-[#111117] border border-gray-800/80 rounded-2xl p-6 hover:border-purple-500/50 transition">
        <div class="text-xs text-purple-400 font-bold mb-2">SaaS / Web App</div>
        <h3 class="text-xl font-bold text-white mb-2">FinTech Analytics Dashboard</h3>
        <p class="text-gray-400 text-xs leading-relaxed mb-4">Platform pemantauan arus kas real-time dengan grafik interaktif dan prediksi berbasis AI.</p>
        <span class="text-xs font-bold text-purple-400 hover:underline cursor-pointer">Lihat Detail Proyek &rarr;</span>
      </div>

      <div class="bg-[#111117] border border-gray-800/80 rounded-2xl p-6 hover:border-purple-500/50 transition">
        <div class="text-xs text-purple-400 font-bold mb-2">E-Commerce</div>
        <h3 class="text-xl font-bold text-white mb-2">Marketplace Fashion Local</h3>
        <p class="text-gray-400 text-xs leading-relaxed mb-4">Toko online terintegrasi payment gateway dan pelacakan kurir otomatis.</p>
        <span class="text-xs font-bold text-purple-400 hover:underline cursor-pointer">Lihat Detail Proyek &rarr;</span>
      </div>
    </div>
  </section>

  <!-- Contact Form -->
  <section id="contact" class="max-w-5xl mx-auto px-6 py-20 border-t border-gray-900">
    <div class="bg-[#111117] border border-gray-800 rounded-2xl p-8 max-w-xl mx-auto">
      <h3 class="text-2xl font-bold text-white mb-2 text-center">Mari Berkolaborasi!</h3>
      <p class="text-gray-400 text-xs text-center mb-6">Kirimkan pesan mengenai proyek atau pertanyaan pekerjaanmu.</p>
      
      <form onsubmit="event.preventDefault(); alert('Pesan berhasil dikirim!');" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1">Nama Lengkap</label>
          <input type="text" required placeholder="John Doe" class="w-full bg-[#181822] border border-gray-800 text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-purple-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1">Email</label>
          <input type="email" required placeholder="john@example.com" class="w-full bg-[#181822] border border-gray-800 text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-purple-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1">Pesan</label>
          <textarea rows="4" required placeholder="Ceritakan detail proyekmu..." class="w-full bg-[#181822] border border-gray-800 text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-purple-500"></textarea>
        </div>
        <button type="submit" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 rounded-xl transition">
          Kirim Pesan
        </button>
      </form>
    </div>
  </section>
</body>
</html>`
  },
  {
    id: 'tpl-ecommerce',
    title: 'Toko Online E-Commerce',
    explanation: 'Aplikasi E-Commerce modern dengan galeri produk gadget, pencarian cepat, modal detail produk, dan keranjang belanja otomatis.',
    icon: Layout,
    category: 'E-Commerce & Retail',
    date: '2026-09-30',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GadgetLab - Modern Store</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#08080c] text-gray-100 min-h-screen flex flex-col">
  <header class="border-b border-gray-800 bg-[#101016]/80 backdrop-blur sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="font-black text-xl text-white tracking-tight flex items-center gap-2">
        <span class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm">🎧</span> GadgetLab
      </div>
      <div class="flex items-center gap-4">
        <button onclick="alert('Keranjang berisi ' + cartCount + ' item')" class="bg-blue-600/20 text-blue-400 font-bold text-xs px-4 py-2 rounded-xl border border-blue-500/30">
          🛒 Cart (<span id="cart-val">0</span>)
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-6 py-10 flex-1">
    <div class="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-3xl p-8 mb-10 text-center">
      <h2 class="text-3xl font-black text-white mb-2">Aksesori Audio & Gadget Masa Depan</h2>
      <p class="text-gray-400 text-xs">Garansi resmi 2 tahun dengan pengiriman kilat seluruh Indonesia.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[#12121a] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
        <div class="text-5xl text-center py-6">🎧</div>
        <div>
          <h3 class="font-bold text-white text-base">Headphone Wireless ANC Pro</h3>
          <p class="text-gray-400 text-xs mt-1 mb-4">Active Noise Cancelling dengan daya tahan baterai 40 jam.</p>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-gray-800">
          <span class="font-extrabold text-blue-400 text-sm">Rp 1.499.000</span>
          <button onclick="addCart()" class="bg-blue-600 text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-blue-500 transition">+ Beli</button>
        </div>
      </div>

      <div class="bg-[#12121a] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
        <div class="text-5xl text-center py-6">⌚</div>
        <div>
          <h3 class="font-bold text-white text-base">Smartwatch Sport Ultra</h3>
          <p class="text-gray-400 text-xs mt-1 mb-4">Layar AMOLED, GPS presisi tinggi dan monitor detak jantung 24/7.</p>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-gray-800">
          <span class="font-extrabold text-blue-400 text-sm">Rp 2.199.000</span>
          <button onclick="addCart()" class="bg-blue-600 text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-blue-500 transition">+ Beli</button>
        </div>
      </div>

      <div class="bg-[#12121a] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
        <div class="text-5xl text-center py-6">🔊</div>
        <div>
          <h3 class="font-bold text-white text-base">Speaker Bluetooth BassX</h3>
          <p class="text-gray-400 text-xs mt-1 mb-4">Tahan air IPX7 dengan suara surround 360 derajat super mantap.</p>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-gray-800">
          <span class="font-extrabold text-blue-400 text-sm">Rp 899.000</span>
          <button onclick="addCart()" class="bg-blue-600 text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-blue-500 transition">+ Beli</button>
        </div>
      </div>
    </div>
  </main>

  <script>
    let cartCount = 0;
    function addCart() {
      cartCount++;
      document.getElementById('cart-val').innerText = cartCount;
    }
  </script>
</body>
</html>`
  },
  {
    id: 'tpl-sekolah',
    title: 'Aplikasi Portal Sekolah',
    explanation: 'Dashboard portal sekolah interaktif berisi jadwal pelajaran mingguan, pengumuman terbaru, dan pemantau absensi siswa.',
    icon: GraduationCap,
    category: 'Edukasi & Sekolah',
    date: '2026-09-30',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portal Siswa SMA Nusantara</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#090a0f] text-gray-100 min-h-screen">
  <header class="bg-[#121420] border-b border-gray-800 px-6 py-4 flex justify-between items-center">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-lg">🏫</div>
      <div>
        <h1 class="font-bold text-white text-sm">Portal Akademik SMA Nusantara</h1>
        <p class="text-xs text-gray-400">Siswa: Ahmad Fauzi (Kelas XII IPA 1)</p>
      </div>
    </div>
    <span class="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
      Status: Aktif
    </span>
  </header>

  <div class="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="md:col-span-2 space-y-6">
      <div class="bg-[#121420] border border-gray-800 rounded-2xl p-5">
        <h3 class="font-bold text-white text-base mb-4 flex items-center gap-2">📅 Jadwal Pelajaran Hari Ini</h3>
        <div class="space-y-3">
          <div class="bg-[#1a1c2d] p-3 rounded-xl flex justify-between items-center border border-gray-800">
            <div>
              <div class="font-bold text-sm text-white">Matematika Peminatan</div>
              <div class="text-xs text-gray-400">07.30 - 09.00 • Ruang 204 (Pak Budi)</div>
            </div>
            <span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md font-bold">Selesai</span>
          </div>
          <div class="bg-[#1a1c2d] p-3 rounded-xl flex justify-between items-center border border-emerald-500/40">
            <div>
              <div class="font-bold text-sm text-white">Fisika Modern</div>
              <div class="text-xs text-gray-400">09.15 - 10.45 • Lab Fisika (Ibu Sri)</div>
            </div>
            <span class="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-md font-bold">Berlangsung</span>
          </div>
          <div class="bg-[#1a1c2d] p-3 rounded-xl flex justify-between items-center border border-gray-800">
            <div>
              <div class="font-bold text-sm text-white">Bahasa Inggris</div>
              <div class="text-xs text-gray-400">11.00 - 12.30 • Ruang 204 (Mr. David)</div>
            </div>
            <span class="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-md font-bold">Mendatang</span>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="bg-[#121420] border border-gray-800 rounded-2xl p-5">
        <h3 class="font-bold text-white text-sm mb-3">📢 Pengumuman</h3>
        <div class="bg-[#191b2a] p-3 rounded-xl text-xs space-y-2">
          <span class="text-emerald-400 font-bold block">Ujian Tengah Semester (UTS)</span>
          <p class="text-gray-300">UTS Semester Ganjil akan dilaksanakan mulai tanggal 12 Oktober 2026. Harap persiapkan kartu ujian.</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
  }
];

// --- SYNTAX HIGHLIGHTED CODE COMPONENT ---
function SyntaxHighlightedCode({ code }: { code: string }) {
  const lines = code.split('\n');

  const highlightLine = (line: string) => {
    if (!line) return '&nbsp;';

    let escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/&gt;/g, '&gt;');

    // Comments <!-- ... -->
    if (escaped.includes('&lt;!--')) {
      return `<span class="text-gray-500 italic font-sans">${escaped}</span>`;
    }

    // Strings "..."
    escaped = escaped.replace(/(&quot;|"|')([^"']*)(&quot;|"|')/g, '<span class="text-emerald-400 font-medium">"$2"</span>');

    // Tags <tag or </tag
    escaped = escaped.replace(/(&lt;\/?[a-zA-Z0-9\-]+)/g, '<span class="text-purple-400 font-bold">$1</span>');

    // Closing >
    escaped = escaped.replace(/(\/&gt;|&gt;)/g, '<span class="text-purple-400 font-bold">$1</span>');

    // Attributes class=, src=, etc
    escaped = escaped.replace(/\b([a-zA-Z0-9\-]+)(?=\=)/g, '<span class="text-amber-300 font-semibold">$1</span>');

    return escaped;
  };

  return (
    <div className="font-mono text-xs leading-relaxed select-text overflow-x-auto bg-[#08080c] text-gray-200 p-4 min-h-full">
      <table className="border-collapse w-full">
        <tbody>
          {lines.map((line, idx) => (
            <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
              <td className="text-gray-600 text-right pr-4 select-none w-10 text-[11px] font-mono border-r border-gray-800/80 shrink-0 align-top">
                {idx + 1}
              </td>
              <td className="pl-4 whitespace-pre text-[12px] font-mono">
                <span dangerouslySetInnerHTML={{ __html: highlightLine(line) }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  // --- STATES ---
  const [accentTheme, setAccentTheme] = useState<AccentTheme>('purple');
  const [language, setLanguage] = useState<Language>('id');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [mainViewMode, setMainViewMode] = useState<ViewMode>('chat');
  const [projectTab, setProjectTab] = useState<ProjectTab>('my_projects');

  // Floating 3-dots action menu state
  const [floatingMenuOpen, setFloatingMenuOpen] = useState<boolean>(false);

  // Chat Messages State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Input States
  const [inputText, setInputText] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<{ base64: string; mimeType: string } | null>(null);

  // AI & Code State
  const [currentCode, setCurrentCode] = useState<string>('');
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(true);

  // Projects State stored in localStorage
  const [projects, setProjects] = useState<Project[]>([]);

  // System Prompt State
  const [systemPrompt, setSystemPrompt] = useState<string>(PRESET_PROMPTS.websiteExpert);
  const [promptSavedNotification, setPromptSavedNotification] = useState<boolean>(false);

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [copiedCodeToast, setCopiedCodeToast] = useState<boolean>(false);

  // File Input & Scroll Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Text i18n helper
  const t = TRANSLATIONS[language];
  const accent = ACCENT_COLORS[accentTheme];

  // Auto-scroll chat history when new message added
  useEffect(() => {
    if (mainViewMode === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isGenerating, mainViewMode]);

  // --- INITIAL LOAD FROM LOCALSTORAGE ---
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('bara_dev_accent') as AccentTheme;
      if (savedTheme && ACCENT_COLORS[savedTheme]) {
        setAccentTheme(savedTheme);
      }

      const savedLang = localStorage.getItem('bara_dev_language') as Language;
      if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
        setLanguage(savedLang);
      }

      const savedPrompt = localStorage.getItem('bara_dev_system_prompt');
      if (savedPrompt) {
        setSystemPrompt(savedPrompt);
      }

      const savedProjects = localStorage.getItem('bara_dev_projects');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } catch (e) {
      console.error('Error loading localStorage:', e);
    }
  }, []);

  // Set root CSS variable for accent color
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accent.hex);
  }, [accentTheme, accent.hex]);

  // Handle auto-expand textarea up to 160px
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  };

  // --- SAVE THEMING / PREFERENCES ---
  const changeTheme = (theme: AccentTheme) => {
    setAccentTheme(theme);
    localStorage.setItem('bara_dev_accent', theme);
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('bara_dev_language', lang);
  };

  const saveSystemPrompt = () => {
    localStorage.setItem('bara_dev_system_prompt', systemPrompt);
    setPromptSavedNotification(true);
    setTimeout(() => setPromptSavedNotification(false), 3000);
  };

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedImage({
          base64: result,
          mimeType: file.type || 'image/png'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- GENERATE APP VIA AI API ROUTE ---
  const handleSendPrompt = async (promptToUse?: string) => {
    const finalPrompt = promptToUse || inputText;
    if (!finalPrompt.trim() && !uploadedImage) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: finalPrompt,
      image: uploadedImage?.base64,
      timestamp: timeStr
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    setActiveTab('chat');
    setMainViewMode('chat'); // show chat thread immediately when sending message

    const currentImg = uploadedImage;
    if (!promptToUse) {
      setInputText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
    setUploadedImage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          systemPrompt,
          imageBase64: currentImg?.base64 || null,
          imageMimeType: currentImg?.mimeType || null,
          currentCode: currentCode || null,
        }),
      });

      const data = await response.json();

      if (data.isChatOnly) {
        const aiMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          role: 'assistant',
          text: data.explanation || 'Halo! Ada yang bisa saya bantu?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, aiMsg]);
        setMainViewMode('chat');
        return;
      }

      let appCode = data.code;
      let appTitle = data.title || ('Aplikasi ' + finalPrompt.slice(0, 20));
      let appExp = data.explanation || `Aplikasi "${appTitle}" berhasil dirancang oleh Bara Dev AI.`;

      if (!appCode || appCode.length < 50) {
        appCode = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#0a0a0f] text-gray-100 min-h-screen flex flex-col justify-between">
  <nav class="border-b border-gray-800 bg-[#12121a] px-6 py-4 flex justify-between items-center">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-black text-white text-lg">⚡</div>
      <span class="font-extrabold text-base text-white tracking-tight">${appTitle}</span>
    </div>
    <button onclick="alert('Fitur interaktif siap digunakan!')" class="bg-purple-600 text-white font-bold text-xs px-4 py-2 rounded-xl">🚀 Buka Fitur</button>
  </nav>
  <main class="max-w-4xl mx-auto px-6 py-12 text-center flex-1 flex flex-col justify-center items-center">
    <h2 class="text-3xl md:text-4xl font-black text-white mb-4">${appTitle}</h2>
    <p class="text-gray-400 text-sm mb-8 leading-relaxed">Aplikasi ini dirancang berdasarkan instruksi Anda: "${finalPrompt}". Tata letak responsif dan komponen interaktif telah disiapkan.</p>
  </main>
</body>
</html>`;
      }

      setCurrentCode(appCode);
      setCurrentTitle(appTitle);

      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        text: appExp,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);

      setMainViewMode('preview');
      setPreviewVisible(true);

      // Save to projects localStorage
      const newProj: Project = {
        id: 'proj-' + Date.now(),
        title: appTitle,
        explanation: appExp,
        code: appCode,
        date: new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      };

      const updatedProjects = [newProj, ...projects];
      setProjects(updatedProjects);
      localStorage.setItem('bara_dev_projects', JSON.stringify(updatedProjects));
    } catch (err: any) {
      console.error('Generation Error:', err);
      const fallbackTitle = "Aplikasi " + (finalPrompt.slice(0, 20) || "Bara Dev");
      const fallbackCode = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fallbackTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0a0a0f] text-white min-h-screen flex flex-col justify-center items-center p-6 text-center">
  <div class="max-w-xl bg-[#12121c] border border-gray-800 rounded-3xl p-8">
    <div class="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-2xl mx-auto mb-4">⚡</div>
    <h1 class="text-3xl font-extrabold mb-3">${fallbackTitle}</h1>
    <p class="text-gray-400 text-sm mb-6 leading-relaxed">Aplikasi/Website ini telah berhasil dirancang oleh Bara Dev AI. Anda dapat terus mengobrol di bawah untuk menambahkan tombol, form, atau fitur baru!</p>
    <button onclick="alert('Tombol Interaktif Bekerja!')" class="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition text-sm">Coba Tombol Fitur</button>
  </div>
</body>
</html>`;

      setCurrentCode(fallbackCode);
      setCurrentTitle(fallbackTitle);

      const aiFallbackMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        text: `Aplikasi "${fallbackTitle}" telah berhasil dirancang oleh Bara Dev AI.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiFallbackMsg]);

      const fallbackProj: Project = {
        id: 'proj-' + Date.now(),
        title: fallbackTitle,
        explanation: 'Aplikasi buatan Bara Dev AI',
        code: fallbackCode,
        date: new Date().toLocaleDateString()
      };
      const updatedProjects = [fallbackProj, ...projects];
      setProjects(updatedProjects);
      localStorage.setItem('bara_dev_projects', JSON.stringify(updatedProjects));

      setMainViewMode('preview');
      setPreviewVisible(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- ACTIONS ---
  const handleLoadProject = (proj: Project) => {
    setCurrentCode(proj.code);
    setCurrentTitle(proj.title);
    setChatMessages([
      {
        id: 'msg-loaded-user',
        role: 'user',
        text: `Buka project: ${proj.title}`,
        timestamp: proj.date
      },
      {
        id: 'msg-loaded-ai',
        role: 'assistant',
        text: proj.explanation || `Project "${proj.title}" berhasil dimuat.`,
        timestamp: proj.date
      }
    ]);
    setMainViewMode('preview');
    setPreviewVisible(true);
    setActiveTab('chat');
  };

  const handleEyeIconClick = () => {
    if (!previewVisible) {
      setPreviewVisible(true);
      setMainViewMode('preview');
    } else {
      if (mainViewMode === 'code') {
        setMainViewMode('preview');
      } else {
        setPreviewVisible(false);
      }
    }
  };

  const handleDeleteSingleProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = projects.filter(p => p.id !== id);
    setProjects(filtered);
    localStorage.setItem('bara_dev_projects', JSON.stringify(filtered));
  };

  const handleDeleteAllProjects = () => {
    setProjects([]);
    localStorage.removeItem('bara_dev_projects');
    setDeleteModalOpen(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCodeToast(true);
    setTimeout(() => setCopiedCodeToast(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([currentCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTitle || 'bara-dev-app'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(currentCode);
      newWindow.document.close();
    }
  };

  return (
    <div className="bg-[#050507] text-gray-100 min-h-screen font-sans flex flex-col overflow-hidden select-none">
      
      {/* 2. HEADER TIPIS (WAJIB PERSIS) */}
      <header className="h-14 border-b border-gray-900 bg-[#08080c] px-4 flex justify-between items-center z-20 shrink-0">
        {/* Kiri atas: Icon garis 3 ditumpuk (hamburger menu) */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 rounded-xl border border-gray-800/80 bg-[#121216] flex items-center justify-center hover:bg-gray-800 text-gray-300 transition cursor-pointer"
          title="Buka Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Tengah: Logo Bara Dev text bold */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('chat')}>
          <div className={`w-2.5 h-2.5 rounded-full ${accent.bg}`}></div>
          <span className="font-extrabold text-base tracking-tight text-white">Bara Dev</span>
          <span className="text-[10px] bg-gray-800/80 text-gray-400 px-1.5 py-0.5 rounded-md font-mono border border-gray-700/50">V1</span>
        </div>

        {/* Kanan atas: Icon mata (Eye / EyeOff) HANYA muncul di Chat & Preview */}
        {activeTab === 'chat' ? (
          <button
            onClick={handleEyeIconClick}
            className={`w-9 h-9 rounded-xl border border-gray-800/80 flex items-center justify-center transition cursor-pointer ${
              previewVisible ? `${accent.bg} text-white` : 'bg-[#121216] text-gray-400 hover:text-white'
            }`}
            title={previewVisible ? t.togglePreview : t.showPreview}
          >
            {previewVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
      </header>

      {/* 4. SIDEBAR (muncul saat klik titik 3) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay Dark */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40"
            />

            {/* Sidebar drawer 280px */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0c0c10] border-r border-gray-800/80 z-50 flex flex-col justify-between p-4"
            >
              <div>
                {/* Header Sidebar */}
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-800/80">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${accent.bg}`}></div>
                    <span className="font-bold text-base text-white">Bara Dev</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 4 MENU ITEM SAJA */}
                <nav className="space-y-1.5">
                  {/* 1. Chat & Preview */}
                  <button
                    onClick={() => { setActiveTab('chat'); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                      activeTab === 'chat'
                        ? `${accent.bg} text-white`
                        : 'text-gray-300 hover:bg-[#15151c]'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>{t.chatAndPreview}</span>
                  </button>

                  {/* 2. Project */}
                  <button
                    onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                      activeTab === 'projects'
                        ? `${accent.bg} text-white`
                        : 'text-gray-300 hover:bg-[#15151c]'
                    }`}
                  >
                    <Folder className="w-4 h-4 shrink-0" />
                    <span>{t.projects}</span>
                    {projects.length > 0 && (
                      <span className="ml-auto bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full font-mono">
                        {projects.length}
                      </span>
                    )}
                  </button>

                  {/* 3. System Prompt */}
                  <button
                    onClick={() => { setActiveTab('system_prompt'); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                      activeTab === 'system_prompt'
                        ? `${accent.bg} text-white`
                        : 'text-gray-300 hover:bg-[#15151c]'
                    }`}
                  >
                    <BrainCircuit className="w-4 h-4 shrink-0" />
                    <span>{t.systemPrompt}</span>
                  </button>

                  {/* 4. Setting */}
                  <button
                    onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                      activeTab === 'settings'
                        ? `${accent.bg} text-white`
                        : 'text-gray-300 hover:bg-[#15151c]'
                    }`}
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    <span>{t.settings}</span>
                  </button>
                </nav>
              </div>

              {/* Footer Sidebar */}
              <div className="pt-4 border-t border-gray-800/80 text-center">
                <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
                  {t.footerVer}
                </span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        
        {/* VIEW 1: CHAT & PREVIEW (MAIN LANDING) */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Bar Tabs if chat has messages or code generated */}
            {(chatMessages.length > 0 || currentCode) && (
              <div className="h-11 bg-[#0b0b0f] border-b border-gray-800/80 px-4 flex justify-between items-center shrink-0 z-10">
                {/* Left: Chat vs Preview vs Code tab */}
                <div className="flex bg-[#121218] border border-gray-800/80 p-0.5 rounded-xl">
                  <button
                    onClick={() => setMainViewMode('chat')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      mainViewMode === 'chat' ? `${accent.bg} text-white` : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={() => {
                      setMainViewMode('preview');
                      setPreviewVisible(true);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      mainViewMode === 'preview' ? `${accent.bg} text-white` : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t.preview}</span>
                  </button>
                  <button
                    onClick={() => setMainViewMode('code')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      mainViewMode === 'code' ? `${accent.bg} text-white` : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>{t.code}</span>
                  </button>
                </div>

                {/* Title */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-300 truncate max-w-xs">{currentTitle || 'Bara Dev Chat'}</span>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
              {/* If no chat messages yet and no code */}
              {chatMessages.length === 0 && !currentCode ? (
                <div className="flex-1 flex flex-col justify-center items-center p-6 text-center max-w-2xl mx-auto">
                  <div className={`w-16 h-16 rounded-2xl bg-[#101010] border border-gray-800 flex items-center justify-center mb-6`}>
                    <Sparkles className={`w-8 h-8 ${accent.text}`} />
                  </div>
                  
                  {/* Empty State */}
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                    {t.emptyTitle}
                  </h2>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    {t.emptyDesc}
                  </p>

                  {/* Suggested prompt chips */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full text-left">
                    {t.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendPrompt(sug)}
                        className="bg-[#101010] border border-gray-800/80 hover:border-gray-700 p-3.5 rounded-2xl text-xs text-gray-300 hover:text-white transition flex items-center justify-between group cursor-pointer"
                      >
                        <span className="line-clamp-2 pr-2">{sug}</span>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${accent.text} group-hover:translate-x-0.5 transition`} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : mainViewMode === 'chat' ? (
                /* CHAT MESSAGES HISTORY STREAM */
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 space-y-4 max-w-3xl mx-auto w-full">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-gray-500 font-mono">
                        <span>{msg.role === 'user' ? 'Kamu' : 'Bara Dev AI'}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-4 rounded-2xl text-xs md:text-sm max-w-[85%] leading-relaxed ${
                          msg.role === 'user'
                            ? `${accent.bg} text-white font-medium rounded-tr-xs shadow-md`
                            : 'bg-[#121218] border border-gray-800 text-gray-200 rounded-tl-xs shadow-md'
                        }`}
                      >
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="Upload"
                            className="w-48 h-auto max-h-48 object-cover rounded-xl mb-3 border border-white/20"
                          />
                        )}
                        <div className="whitespace-pre-wrap">{msg.text}</div>

                        {msg.role === 'assistant' && currentCode && (
                          <button
                            onClick={() => {
                              setMainViewMode('preview');
                              setPreviewVisible(true);
                            }}
                            className="mt-3 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-gray-700"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Preview Aplikasi</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Inline Loading Indicator (NO POPUP) */}
                  {isGenerating && (
                    <div className="flex flex-col items-start my-2">
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-gray-500 font-mono">
                        <span>Bara Dev AI</span>
                      </div>
                      <div className="bg-[#121218] border border-gray-800 rounded-2xl rounded-tl-xs p-4 text-xs text-gray-300 max-w-[85%] flex items-center gap-3 shadow-md">
                        <div className={`w-6 h-6 rounded-lg ${accent.bg} flex items-center justify-center text-white shrink-0`}>
                          <Terminal className="w-3.5 h-3.5 animate-spin" />
                        </div>
                        <span>Bara Dev AI sedang merancang & mengode aplikasi kamu...</span>
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              ) : mainViewMode === 'preview' ? (
                /* PREVIEW VIEW */
                <div className="flex-1 bg-black relative overflow-hidden h-full">
                  {previewVisible ? (
                    <div className="relative w-full h-full">
                      {/* Tombol Chat di Pojok Kiri Atas Preview */}
                      <button
                        onClick={() => setMainViewMode('chat')}
                        className="absolute top-3 left-3 z-30 bg-[#101014]/90 hover:bg-[#181820] border border-gray-700/80 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2 transition cursor-pointer group hover:scale-105"
                        title="Kembali ke Chat"
                      >
                        <MessageSquare className={`w-4 h-4 ${accent.text}`} />
                        <span>Chat ({chatMessages.filter(m => m.role === 'user').length})</span>
                      </button>

                      <iframe
                        key={currentCode.length}
                        srcDoc={currentCode}
                        title="Bara Dev Generated App Preview"
                        className="w-full h-full border-0 bg-white"
                        sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center text-gray-500 text-xs">
                      <EyeOff className="w-8 h-8 mb-2 opacity-50" />
                      <span>Preview disembunyikan. Klik icon mata di kanan atas untuk menampilkan kembali.</span>
                    </div>
                  )}
                </div>
              ) : (
                /* CODE VIEW WITH SYNTAX HIGHLIGHTING */
                <div className="w-full h-full overflow-auto bg-[#08080c]">
                  <SyntaxHighlightedCode code={currentCode} />
                </div>
              )}
            </div>
          </div>
        )}

      {/* FLOATING 3-DOTS STACKED ACTION MENU (KODE, SALIN, DOWNLOAD, LAYAR PENUH) */}
      {activeTab === 'chat' && currentCode && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
          <AnimatePresence>
            {floatingMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="mb-3 bg-[#101016] border border-gray-800 rounded-2xl p-2 shadow-2xl w-52 flex flex-col gap-1 backdrop-blur-md"
              >
                {/* 1. Tombol Kode / Preview */}
                <button
                  onClick={() => {
                    setMainViewMode(mainViewMode === 'code' ? 'preview' : 'code');
                    setFloatingMenuOpen(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:text-white hover:bg-[#181822] flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Code className={`w-4 h-4 ${accent.text}`} />
                    <span>{mainViewMode === 'code' ? 'Lihat Preview' : 'Tampilkan Kode'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {/* 2. Tombol Salin */}
                <button
                  onClick={() => {
                    handleCopyCode();
                    setFloatingMenuOpen(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:text-white hover:bg-[#181822] flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {copiedCodeToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className={`w-4 h-4 ${accent.text}`} />}
                    <span>{copiedCodeToast ? t.copied : 'Salin Kode'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {/* 3. Tombol Download */}
                <button
                  onClick={() => {
                    handleDownloadHtml();
                    setFloatingMenuOpen(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:text-white hover:bg-[#181822] flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className={`w-4 h-4 ${accent.text}`} />
                    <span>Unduh HTML</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {/* 4. Tombol Layar Penuh (Tab Baru) */}
                <button
                  onClick={() => {
                    handleOpenNewTab();
                    setFloatingMenuOpen(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:text-white hover:bg-[#181822] flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Maximize2 className={`w-4 h-4 ${accent.text}`} />
                    <span>Layar Penuh (Tab Baru)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tombol Utama Titik 3 Ditumpuk (MoreVertical) */}
          <button
            onClick={() => setFloatingMenuOpen(!floatingMenuOpen)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${accent.bg} ${accent.bgHover} text-white flex items-center justify-center shadow-2xl transition cursor-pointer hover:scale-105 active:scale-95`}
            title="Menu Opsi: Kode, Salin, Download, Layar Penuh"
          >
            <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

        {/* VIEW 2: PROJECT PAGE */}
        {activeTab === 'projects' && (
          <div className="flex-1 flex flex-col p-4 md:p-6 max-w-6xl mx-auto w-full overflow-y-auto">
            {/* Top Tabs: My Project vs Templates */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex bg-[#101010] border border-gray-800 p-1 rounded-2xl">
                <button
                  onClick={() => setProjectTab('my_projects')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    projectTab === 'my_projects' ? `${accent.bg} text-white` : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t.myProjects} ({projects.length})
                </button>
                <button
                  onClick={() => setProjectTab('templates')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    projectTab === 'templates' ? `${accent.bg} text-white` : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t.templates} ({TEMPLATES.length})
                </button>
              </div>
            </div>

            {/* Tab Content 1: My Project */}
            {projectTab === 'my_projects' && (
              <div>
                {projects.length === 0 ? (
                  <div className="bg-[#101010] border border-gray-800/80 rounded-2xl p-12 text-center">
                    <Folder className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <h3 className="font-bold text-white text-base mb-1">{t.noProjectsYet}</h3>
                    <p className="text-gray-400 text-xs">{t.noProjectsDesc}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => handleLoadProject(proj)}
                        className="bg-[#101010] border border-gray-800/80 hover:border-gray-700 rounded-2xl overflow-hidden cursor-pointer group transition flex flex-col justify-between"
                      >
                        {/* Thumbnail iframe preview mini */}
                        <div className="h-36 bg-black relative overflow-hidden border-b border-gray-800/60 pointer-events-none">
                          <iframe
                            srcDoc={proj.code}
                            title={proj.title}
                            className="w-[200%] h-[200%] transform scale-50 origin-top-left border-0 bg-white opacity-80 group-hover:opacity-100 transition"
                            tabIndex={-1}
                          />
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-white text-sm mb-1 group-hover:text-purple-400 transition line-clamp-1">
                              {proj.title}
                            </h4>
                            <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                              {proj.explanation}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-800/60 text-[11px] text-gray-500">
                            <span>{proj.date}</span>
                            <button
                              onClick={(e) => handleDeleteSingleProject(proj.id, e)}
                              className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                              title={t.deleteProject}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab Content 2: Templates */}
            {projectTab === 'templates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATES.map((tpl) => {
                  const IconComp = tpl.icon;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleLoadProject(tpl)}
                      className="bg-[#101010] border border-gray-800/80 hover:border-gray-700 rounded-2xl p-5 cursor-pointer group transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className={`w-10 h-10 rounded-xl ${accent.bg} flex items-center justify-center text-white`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] bg-gray-800 text-gray-300 font-semibold px-2 py-0.5 rounded-full">
                            {tpl.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-base mb-1 group-hover:text-purple-400 transition">
                          {tpl.title}
                        </h4>
                        <p className="text-gray-400 text-xs leading-relaxed mb-4">
                          {tpl.explanation}
                        </p>
                      </div>

                      <button
                        onClick={() => handleLoadProject(tpl)}
                        className={`w-full ${accent.bg} ${accent.bgHover} text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5`}
                      >
                        <span>{t.useTemplate}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: SYSTEM PROMPT PAGE */}
        {activeTab === 'system_prompt' && (
          <div className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-white mb-1 flex items-center gap-2">
                <BrainCircuit className={`w-5 h-5 ${accent.text}`} />
                <span>Pengaturan System Prompt</span>
              </h2>
              <p className="text-gray-400 text-xs">
                Kustomisasi perilaku AI saat meng-generate kode aplikasi & website.
              </p>
            </div>

            {/* 3 Preset Chips */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold text-gray-300">{t.presetPrompts}</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <button
                  onClick={() => setSystemPrompt(PRESET_PROMPTS.websiteExpert)}
                  className="p-3 bg-[#101010] border border-gray-800/80 hover:border-gray-700 rounded-xl text-left transition cursor-pointer group"
                >
                  <div className="font-bold text-xs text-white mb-1">Website Expert</div>
                  <div className="text-[11px] text-gray-400 line-clamp-2">Landing page premium, Tailwind CSS expert & UX memikat.</div>
                </button>

                <button
                  onClick={() => setSystemPrompt(PRESET_PROMPTS.appBuilder)}
                  className="p-3 bg-[#101010] border border-gray-800/80 hover:border-gray-700 rounded-xl text-left transition cursor-pointer group"
                >
                  <div className="font-bold text-xs text-white mb-1">App Builder</div>
                  <div className="text-[11px] text-gray-400 line-clamp-2">Aplikasi interaktif fungsional dengan logika JS mantap.</div>
                </button>

                <button
                  onClick={() => setSystemPrompt(PRESET_PROMPTS.uiuxPremium)}
                  className="p-3 bg-[#101010] border border-gray-800/80 hover:border-gray-700 rounded-xl text-left transition cursor-pointer group"
                >
                  <div className="font-bold text-xs text-white mb-1">UI/UX Premium</div>
                  <div className="text-[11px] text-gray-400 line-clamp-2">Desain minimalis, clean, kontras tinggi & modern.</div>
                </button>
              </div>
            </div>

            {/* Large Textarea */}
            <div className="mb-4">
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={10}
                className="w-full bg-[#101010] border border-gray-800 rounded-2xl p-4 text-xs text-gray-200 focus:outline-none focus:border-gray-700 font-mono leading-relaxed"
                placeholder="Tuliskan instruksi kustom untuk AI..."
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={saveSystemPrompt}
                className={`${accent.bg} ${accent.bgHover} text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer`}
              >
                <Check className="w-4 h-4" />
                <span>{t.savePrompt}</span>
              </button>

              {promptSavedNotification && (
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                  {t.promptSaved}
                </span>
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: SETTINGS PAGE (DETAIL) */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full overflow-y-auto space-y-8">
            <div>
              <h2 className="text-xl font-extrabold text-white mb-1 flex items-center gap-2">
                <Settings className={`w-5 h-5 ${accent.text}`} />
                <span>{t.settings}</span>
              </h2>
              <p className="text-gray-400 text-xs">Atur preferensi tampilan dan aplikasi Bara Dev.</p>
            </div>

            {/* A. Ganti Tema (4 bulatan warna solid, TANPA GLOW) */}
            <section className="bg-[#101010] border border-gray-800/80 rounded-2xl p-5">
              <h3 className="font-bold text-white text-sm mb-1">{t.themeTitle}</h3>
              <p className="text-gray-400 text-xs mb-4">{t.themeDesc}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(ACCENT_COLORS) as AccentTheme[]).map((themeKey) => {
                  const item = ACCENT_COLORS[themeKey];
                  const isSelected = accentTheme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => changeTheme(themeKey)}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                        isSelected ? 'bg-[#181820] border-gray-500' : 'bg-[#121216] border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      {/* Bulatan warna solid */}
                      <div
                        className="w-6 h-6 rounded-full shrink-0 border border-white/20"
                        style={{ backgroundColor: item.hex }}
                      />
                      <span className="font-semibold text-xs text-white">
                        {item.name[language]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* B. Bahasa */}
            <section className="bg-[#101010] border border-gray-800/80 rounded-2xl p-5">
              <h3 className="font-bold text-white text-sm mb-1">{t.languageTitle}</h3>
              <p className="text-gray-400 text-xs mb-4">{t.languageDesc}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => changeLanguage('id')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                    language === 'id' ? `${accent.bg} text-white` : 'bg-[#121216] text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Indonesia</span>
                </button>

                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                    language === 'en' ? `${accent.bg} text-white` : 'bg-[#121216] text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                </button>
              </div>
            </section>

            {/* C. Danger Zone */}
            <section className="bg-[#101010] border border-red-900/30 rounded-2xl p-5">
              <h3 className="font-bold text-red-400 text-sm mb-1">{t.dangerZoneTitle}</h3>
              <p className="text-gray-400 text-xs mb-4">
                Tindakan ini akan menghapus seluruh data riwayat project yang tersimpan di browser ini.
              </p>

              <button
                onClick={() => setDeleteModalOpen(true)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.deleteAllProjects}</span>
              </button>
            </section>
          </div>
        )}

        {/* 3. CHAT INPUT MELAYANG DI BAWAH TENGAH (FITUR UTAMA) */}
        {activeTab === 'chat' && (
          <div className="fixed bottom-6 left-0 right-0 z-30 px-4 flex flex-col items-center pointer-events-none">
            
            {/* Image Preview Thumbnail if attached */}
            {uploadedImage && (
              <div className="mb-2 bg-[#121216] border border-gray-800 p-2 rounded-2xl flex items-center gap-2 pointer-events-auto shadow-lg">
                <img
                  src={uploadedImage.base64}
                  alt="Upload Reference"
                  className="w-10 h-10 object-cover rounded-xl border border-gray-700"
                />
                <span className="text-xs text-gray-300 font-medium">Foto referensi siap dikirim</span>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Pill Capsule Chat Input */}
            <div className="w-[90%] max-w-3xl bg-[#101014] border border-gray-800/90 rounded-[28px] p-2 flex items-center gap-2 shadow-2xl pointer-events-auto transition-all">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Tombol "+" di dalam capsule paling kiri */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-[#181822] hover:bg-gray-800 text-gray-300 hover:text-white flex items-center justify-center shrink-0 transition cursor-pointer"
                title={t.uploadImageTooltip}
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Textarea di tengah */}
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendPrompt();
                  }
                }}
                rows={1}
                placeholder={t.chatPlaceholder}
                className="flex-1 bg-transparent text-white text-xs md:text-sm focus:outline-none resize-none max-h-[160px] py-2 px-1 placeholder-gray-500 font-sans"
              />

              {/* Tombol Send (panah ke atas) */}
              <button
                onClick={() => handleSendPrompt()}
                disabled={isGenerating || (!inputText.trim() && !uploadedImage)}
                className={`w-10 h-10 rounded-full ${accent.bg} ${accent.bgHover} text-white flex items-center justify-center shrink-0 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                title="Kirim pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* POP-UP MODAL DANGER ZONE (HAPUS SEMUA PROJECT) */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#121216] border border-gray-800 rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-white mb-2">{t.modalDeleteTitle}</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">{t.modalDeleteDesc}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white font-bold text-xs transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDeleteAllProjects}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  {t.confirmDelete}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
