const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding comprehensive real portfolio data for Noval Lias Ramadani (Herbanova + Aladdin + Indorkarya)...');

  // 1. Clean existing data
  await prisma.contactMessage.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create User Profile
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: 'Noval Lias Ramadani',
      title: 'Fullstack Developer, Project Manager, System Analyst, IT Enthusiast',
      bio: 'Membangun solusi digital yang andal, inovatif, dan berkinerja tinggi. Berfokus pada perancangan sistem modern serta mengubah tantangan kompleks menjadi produk teknologi yang efektif dan bernilai nyata.',
      about: 'Saya adalah Fullstack Developer, Project Manager, dan System Analyst yang berfokus pada pembangunan solusi digital modern dan berkinerja tinggi. Menggabungkan keahlian teknis pemrograman dengan analisis sistem yang mendalam dan manajemen proyek yang terstruktur untuk menciptakan produk teknologi yang efektif, teruji, dan memberikan dampak nyata bagi pengguna maupun bisnis.',
      avatarUrl: JSON.stringify(['/uploads/FotoWarna3x4-1790307625989.jpg', '', '']),
      resumeUrl: 'https://drive.google.com/file/d/1YImuN3lU8U6QYstLpfSqJg6Kd_JYB7RW/view?usp=sharing',
      socials: JSON.stringify({
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'valleramadan46@gmail.com',
        whatsapp: 'https://wa.me/6281268181997',
        twitter: 'https://twitter.com',
      }),
    },
  });

  // 3. Create Site Settings
  await prisma.siteSetting.create({
    data: {
      id: 'site-config',
      availableForHire: true,
      statusBadgeText: 'Tersedia untuk Proyek Baru & Kolaborasi',
      statsExperience: '3+ Tahun',
      statsProjects: '15+ Proyek',
      statsClients: '8+ Mitra & Klien',
    },
  });

  // 4. Create Skills
  const skillsData = [
    // Backend & Architecture
    { name: 'PHP & Laravel (v9 - v12)', category: 'Backend', iconName: 'Server', level: 96, order: 1 },
    { name: 'RESTful API & Inertia.js', category: 'Backend', iconName: 'Network', level: 94, order: 2 },
    { name: 'Livewire & Blade UI', category: 'Backend', iconName: 'Cpu', level: 90, order: 3 },
    { name: 'Python (Data Analysis & Scraping)', category: 'Backend', iconName: 'Code2', level: 86, order: 4 },
    { name: 'Role-Based Access (Spatie RBAC) & JWT', category: 'Backend', iconName: 'ShieldCheck', level: 92, order: 5 },

    // Frontend & Modern UI
    { name: 'React 19 & Next.js 14', category: 'Frontend', iconName: 'Layers', level: 94, order: 6 },
    { name: 'Vue.js 3 & VueUse (Inertia.js)', category: 'Frontend', iconName: 'Code', level: 92, order: 7 },
    { name: 'TypeScript (Strict Types & Interfaces)', category: 'Frontend', iconName: 'FileCode', level: 92, order: 8 },
    { name: 'Tailwind CSS (v3 & v4) & Glassmorphism', category: 'Frontend', iconName: 'Palette', level: 96, order: 9 },
    { name: 'Zustand / Redux State Management', category: 'Frontend', iconName: 'Cpu', level: 90, order: 10 },
    { name: 'Bootstrap & Responsive Layouts', category: 'Frontend', iconName: 'Layout', level: 92, order: 11 },

    // Database & Optimization
    { name: 'MySQL & Relational DB Modeling', category: 'Database', iconName: 'Database', level: 94, order: 12 },
    { name: 'Query Optimization & DataTables Yajra', category: 'Database', iconName: 'Layers', level: 92, order: 13 },
    { name: 'SQLite & Prisma ORM Indexing', category: 'Database', iconName: 'HardDrive', level: 90, order: 14 },

    // Tools, DevOps & Management
    { name: 'Git & GitHub Version Control', category: 'DevOps & Tools', iconName: 'GitBranch', level: 94, order: 15 },
    { name: 'Project Management (Agile / Trello)', category: 'DevOps & Tools', iconName: 'Briefcase', level: 92, order: 16 },
    { name: 'System Analysis & Draw.io / UML', category: 'DevOps & Tools', iconName: 'Workflow', level: 92, order: 17 },
    { name: 'Framer Motion & Modern Micro-Animations', category: 'DevOps & Tools', iconName: 'Terminal', level: 90, order: 18 },
  ];

  for (const s of skillsData) {
    await prisma.skill.create({ data: s });
  }

  // 5. Create 15 Real Projects Analyzed from Laptop Workspace
  const projectsData = [
    {
      title: 'Curva Information System & CS CRM',
      slug: 'curva-information-system-cs-crm',
      category: 'Enterprise',
      description: 'Sistem Manajemen Pelanggan (CRM) terintegrasi untuk tim Customer Service (CS) brand Curva (Herbanova). Fitur mencakup manajemen prospek, pencatatan histori follow-up chat, analitis performa konversi CS, sistem role-based access control (RBAC), reporting transaksi harian berskala besar, dan ekspor FastExcel.',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Laravel 11', 'PHP 8.2', 'MySQL', 'Spatie Permission', 'DataTables', 'FastExcel', 'Tailwind CSS', 'REST API']),
      featured: true,
      order: 1,
    },
    {
      title: 'QC System Curva (Quality Control)',
      slug: 'qc-system-curva',
      category: 'Enterprise',
      description: 'Sistem kendali mutu (Quality Control) terstandarisasi untuk lini produk Curva di bawah naungan Herbanova. Mengelola batch produksi, audit kelayakan standar produk, verifikasi spesifikasi bahan baku, pencatatan produk reject/defect, dan rekap laporan inspeksi berkala.',
      coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Laravel 11', 'PHP 8.3', 'MySQL', 'FastExcel', 'Tailwind CSS', 'REST API']),
      featured: true,
      order: 2,
    },
    {
      title: 'QC System Mokuru (Quality Control)',
      slug: 'qc-system-mokuru',
      category: 'Enterprise',
      description: 'Sistem manajemen kontrol kualitas terstandarisasi untuk lini produk Mokuru (Herbanova). Memastikan setiap alur manufaktur memenuhi parameter standar mutu, pemantauan inspeksi bahan masuk, pelacakan tingkat cacat produk, dan analisis data kelayakan rilis.',
      coverImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Laravel 11', 'PHP 8.3', 'MySQL', 'Tailwind CSS', 'FastExcel', 'REST API']),
      featured: true,
      order: 3,
    },
    {
      title: 'Sistem Keuangan & Pembukuan Aladdin',
      slug: 'sistem-keuangan-aladdin',
      category: 'Finance',
      description: 'Sistem pencatatan keuangan dan pembukuan komprehensif untuk Aladdin Carpets. Mendukung pengelolaan arus kas (cashflow), jurnal umum, buku besar, neraca keuangan, generate laporan laba rugi otomatis, kuitansi digital ber-QR code, dan ekspor data PDF/Excel.',
      coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Laravel 9', 'PHP', 'MySQL', 'DomPDF', 'QR Code', 'Excel Export', 'Bootstrap', 'Tailwind CSS']),
      featured: true,
      order: 4,
    },
    {
      title: 'Sistem Manajemen Leads & Pipeline Aladdin',
      slug: 'sistem-leads-aladdin',
      category: 'Fullstack',
      description: 'Platform modern berbasis Laravel 12 & Inertia.js React 19 dengan TypeScript untuk pelacakan, segmentasi, dan konversi prospek pelanggan Aladdin. Dilengkapi fitur penugasan leads otomatis ke sales, pemantauan pipeline penjualan dinamis, visualisasi performa Recharts, dan export PhpSpreadsheet.',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['React 19', 'TypeScript', 'Inertia.js', 'Laravel 12', 'Tailwind CSS v4', 'Radix UI', 'Recharts', 'MySQL']),
      featured: true,
      order: 5,
    },
    {
      title: 'Point Of Sales (POS) Aladdin Karpet',
      slug: 'pos-aladdin-karpet',
      category: 'Fullstack',
      description: 'Sistem Point of Sales (POS) berbasis web untuk Aladdin Carpets yang mengelola transaksi penjualan karpet secara real-time. Fitur utama meliputi pencatatan penjualan, manajemen inventaris stok, generate faktur/invoice otomatis, laporan penjualan harian/mingguan, dan integrasi pembayaran digital.',
      coverImage: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Laravel', 'Livewire', 'PHP', 'MySQL', 'Tailwind CSS', 'BladeUI', 'REST API']),
      featured: true,
      order: 6,
    },
    {
      title: 'Sistem Operasional PT Indorkarya Persada',
      slug: 'sistem-operasional-indorkarya',
      category: 'Enterprise',
      description: 'Sistem operasional internal berbasis web untuk PT Indorkarya Persada guna mengoptimalkan manajemen alur produksi, pelacakan tugas harian tim, pemantauan pesanan/persediaan barang, persetujuan alur kerja berjenjang, dan dasbor analitis real-time.',
      coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Laravel', 'Livewire', 'PHP', 'MySQL', 'Tailwind CSS', 'Bootstrap', 'REST API']),
      featured: true,
      order: 7,
    },
    {
      title: 'Sistem Manajemen Supply Chain Indorkarya Persada',
      slug: 'supply-chain-indorkarya',
      category: 'Fullstack',
      description: 'Sistem manajemen rantai pasok terintegrasi khusus untuk industri karpet. Mengoptimalkan seluruh alur kerja mulai dari pengadaan bahan baku, proses produksi pabrik, kendali mutu (QC), manajemen inventaris produk jadi, hingga distribusi ke gerai pelanggan dengan pemantauan biaya real-time.',
      coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Laravel', 'Livewire', 'PHP', 'MySQL', 'Tailwind CSS', 'BladeUI', 'REST API']),
      featured: true,
      order: 8,
    },
    {
      title: 'Portal Informasi Muhammadiyah Jogja Expo #4',
      slug: 'muhammadiyah-jogja-expo-4',
      category: 'Fullstack',
      description: 'Portal web pusat informasi resmi untuk perhelatan akbar Muhammadiyah di Yogyakarta. Mendukung promosi event, registrasi online pengunjung, sistem pengundian doorprize, dan scanning barcode presisi untuk presensi event.',
      coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Laravel', 'Blade', 'PHP', 'MySQL', 'JavaScript', 'Tailwind CSS', 'Bootstrap']),
      featured: false,
      order: 9,
    },
    {
      title: 'Sistem Informasi Alumni Ganissa',
      slug: 'sistem-informasi-alumni-ganissa',
      category: 'Fullstack',
      description: 'Platform terpusat pengelolaan data dan komunikasi antar alumni Ganissa. Menyediakan registrasi profil terverifikasi, bursa lowongan kerja, agenda kegiatan komunitas, dan panel administrasi data lengkap.',
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'Bootstrap', 'JavaScript', 'Git']),
      featured: false,
      order: 10,
    },
    {
      title: 'E-Commerce Platform Beautetox (Toko Online)',
      slug: 'ecommerce-beautetox',
      category: 'Fullstack',
      description: 'Platform e-commerce modern full stack untuk brand kosmetik Beautetox yang dibangun menggunakan React 19, TypeScript, dan Inertia.js. Fitur meliputi drag-and-drop checkout (@hello-pangea/dnd), integrasi peta Mapbox GL, QR Code generator, rich text editor TinyMCE, dan animasi Motion.',
      coverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['React 19', 'TypeScript', 'Inertia.js', 'Laravel', 'Tailwind CSS v4', 'Motion', 'Mapbox GL', 'Radix UI']),
      featured: false,
      order: 11,
    },
    {
      title: 'Website Profil Sekolah SMA N 2 Singkep',
      slug: 'web-profil-sman2-singkep',
      category: 'Frontend',
      description: 'Website profil sekolah dinamis dan informatif yang mencakup pusat berita, pengumuman resmi, galeri kegiatan siswa, direktori tenaga pengajar, dan panel CMS kustom yang ramah pengguna.',
      coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['PHP', 'Laravel', 'MySQL', 'Tailwind CSS', 'Bootstrap', 'JavaScript', 'Git']),
      featured: false,
      order: 12,
    },
    {
      title: 'Web E-Commerce Catering Makanan',
      slug: 'web-catering-makanan',
      category: 'Fullstack',
      description: 'Aplikasi web pemesanan layanan katering makanan dengan katalog menu variatif, paket prasmanan, keranjang belanja fleksibel, generate invoice pemesanan, dan panel manajemen admin.',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'JavaScript']),
      featured: false,
      order: 13,
    },
    {
      title: 'Sistem Pendukung Keputusan (SPK) Pemilihan Menu Gout',
      slug: 'spk-menu-gout-saw-profile-matching',
      category: 'AI & Algorithm',
      description: 'Sistem cerdas penunjang keputusan pemilihan makanan bagi penderita Gout menggunakan metode SAW (Simple Additive Weighting) dan Profile Matching berbasis algoritma Python dan analisis data gizi komparatif.',
      coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Python', 'Data Analysis', 'Algorithm SAW', 'Profile Matching', 'MySQL']),
      featured: false,
      order: 14,
    },
    {
      title: 'Aplikasi SIRS Terintegrasi (Smart City Oriented)',
      slug: 'sirs-smart-city-mobile-backend',
      category: 'Mobile',
      description: 'Perancangan arsitektur Sistem Informasi Rumah Sakit (SIRS) terintegrasi berorientasi smart city, mencakup detail reservasi rumah sakit, sistem antrean pasien, dan aplikasi mobile pasien.',
      coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Java Backend', 'Kotlin Android', 'REST API', 'MySQL']),
      featured: false,
      order: 15,
    },
    {
      title: 'Sistem Reservasi Meja Cafe Canary (Vue 3 + Inertia)',
      slug: 'sistem-reservasi-cafe-canary',
      category: 'Fullstack',
      description: 'Aplikasi web reservasi meja digital real-time untuk Kafe Canary yang dibangun dengan Vue 3 Composition API dan Inertia.js. Fitur meliputi Glassmorphism UI, pemilihan jadwal sesi meja live, panel admin manajemen reservasi dengan VueUse dan Lucide Icons, serta rekapitulasi data tamu otomatis.',
      coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Vue.js 3', 'Inertia.js', 'Laravel 11', 'Tailwind CSS', 'VueUse', 'Lucide Vue', 'MySQL']),
      featured: false,
      order: 16,
    },
    {
      title: 'Sistem Informasi & Profil Perusahaan BDP Company',
      slug: 'sistem-informasi-bdp-company',
      category: 'Enterprise',
      description: 'Platform enterprise korporat untuk BDP Company yang memadukan backend Laravel 12 Sanctum REST API dengan frontend React 19 & Vite yang cepat. Memiliki katalog layanan interaktif, form inquiry dinamis, state management Zustand terpusat, dan integrasi Swiper carousel.',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['React 19', 'Vite', 'Tailwind CSS', 'Zustand', 'Laravel 12 API', 'Sanctum', 'React Router 7']),
      featured: false,
      order: 17,
    },
    {
      title: 'Sistem Antrian Pintar & Monitor Display (Morbis Queue)',
      slug: 'sistem-antrian-pintar-morbis',
      category: 'Fullstack',
      description: 'Sistem manajemen antrian cerdas multi-layanan dan multi-loket terintegrasi. Menampilkan monitor display publik real-time, antarmuka pemanggilan suara/loket untuk petugas loket (Teller/CS), pencetakan tiket nomor antrian, dan dashboard pemantauan waktu tunggu antrian.',
      coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['Laravel', 'PHP', 'MySQL', 'Real-time AJAX Monitor', 'Blade UI', 'Tailwind CSS', 'Queue Architecture']),
      featured: true,
      order: 18,
    },
    {
      title: 'Sistem Booking & Manajemen Lapangan Olahraga',
      slug: 'sistem-booking-lapangan',
      category: 'Fullstack',
      description: 'Platform reservasi dan jadwal sewa lapangan olahraga online interaktif dengan frontend React 19, Framer Motion animasi, TanStack React Query untuk sinkronisasi state data server, Tremor chart analytics, dan form validation Zod.',
      coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      techStack: JSON.stringify(['React 19', 'Framer Motion', 'TanStack Query', 'Tremor', 'Zustand', 'Laravel API', 'Tailwind CSS', 'Zod']),
      featured: true,
      order: 19,
    },
  ];

  for (const p of projectsData) {
    await prisma.project.create({ data: p });
  }

  // 6. Create Real Experiences & Education
  const experienceData = [
    {
      type: 'WORK',
      role: 'Fullstack Developer (Remote)',
      institution: 'Herbanova',
      period: 'April 2026 – September 2026',
      description: 'Bekerja secara remote sebagai Fullstack Developer untuk merancang, mengembangkan, dan memelihara ekosistem aplikasi enterprise internal Herbanova. Bertanggung jawab atas pembangunan Curva Information System, Customer Service CRM (CS CRM), Dashboard Analitik Operasional, serta Quality Control (QC) System untuk lini produk Curva dan Mokuru.',
      order: 1,
    },
    {
      type: 'WORK',
      role: 'Staff IT Programmer / Fullstack Developer',
      institution: 'PT Indorkarya Persada',
      period: 'November 2025 – Sekarang',
      description: 'Mengembangkan dan memelihara aplikasi IT untuk mendukung operasional perusahaan sebagai Fullstack Developer. Merancang fitur backend menggunakan Laravel dan database MySQL untuk meningkatkan efisiensi sistem, integrasi RESTful API, serta debugging dan optimasi performa kode.',
      order: 2,
    },
    {
      type: 'WORK',
      role: 'Freelancer Full Stack Developer',
      institution: 'Humii Digital',
      period: 'September 2025 – Desember 2025',
      description: 'Membangun platform e-commerce full stack untuk klien menggunakan backend Laravel dan frontend TypeScript. Mengimplementasikan autentikasi JWT, fitur komunikasi real-time dengan Socket.io, dan version control Git hingga proyek sukses diluncurkan.',
      order: 3,
    },
    {
      type: 'WORK',
      role: 'Freelancer Joki IT & Software Engineer',
      institution: 'Freelance / Klien Mandiri',
      period: 'Oktober 2025 – Februari 2026',
      description: 'Menyediakan layanan pengembangan software dan troubleshooting IT untuk klien individu. Menyelesaikan berbagai proyek web berbasis JavaScript, PHP Laravel, dan SQL, serta integrasi custom API dan data scraping menggunakan Python.',
      order: 4,
    },
    {
      type: 'WORK',
      role: 'Koordinator Tim IT & Infrastruktur Digital',
      institution: 'Muhammadiyah Jogja Expo #4',
      period: 'September 2025',
      description: 'Memimpin tim IT dalam setup jaringan, website event, dan ticketing system untuk mendukung expo akbar. Menggunakan Trello dan Draw.io untuk manajemen proyek serta menangani troubleshooting real-time dengan capaian 99% uptime.',
      order: 5,
    },
    {
      type: 'EDUCATION',
      role: 'Asisten Praktikum Laboratorium Informatika',
      institution: 'Universitas Ahmad Dahlan',
      period: '2024 – 2025',
      description: 'Membimbing mahasiswa dalam mata kuliah Algoritma Pemrograman, Kecerdasan Buatan, Statistika Informatika, Pemrograman Berorientasi Objek (OOP), Struktur Data, dan Dasar-dasar Pemrograman. Menganalisis efisiensi algoritma serta memandu penyelesaian proyek mahasiswa.',
      order: 6,
    },
    {
      type: 'EDUCATION',
      role: 'Student Employment Tracer Study',
      institution: 'Universitas Ahmad Dahlan',
      period: 'Mei 2025 – Agustus 2025',
      description: 'Mengelola proyek Tracer Study untuk evaluasi mutu lulusan. Melakukan survei terstruktur kepada 400+ responden alumni, analisis visualisasi data dengan Excel, dan penyusunan dashboard analitis pendukung keputusan institusi.',
      order: 7,
    },
    {
      type: 'EDUCATION',
      role: 'Sarjana Informatika (S.Kom)',
      institution: 'Universitas Ahmad Dahlan (UAD) Yogyakarta',
      period: '2021 – Sekarang',
      description: 'Fokus pada Rekayasa Perangkat Lunak, Arsitektur Sistem Web, dan Manajemen Basis Data dengan keterlibatan aktif dalam proyek riset laboratorium dan organisasi kampus.',
      order: 8,
    },
    {
      type: 'ORGANIZATION',
      role: 'Staff Departemen Sarana & Prasarana',
      institution: 'Organisasi Otonom Tapak Suci UAD',
      period: 'Februari 2024 – Februari 2025',
      description: 'Mengkoordinasikan kebutuhan operasional sarana dan prasarana organisasi, mengelola logistik pertemuan internal serta acara eksternal guna meningkatkan visibilitas publik.',
      order: 9,
    },
    {
      type: 'ORGANIZATION',
      role: 'Anggota Purna Paskibraka Indonesia (PPI)',
      institution: 'PPI Kab. Lingga & Provinsi Kepulauan Riau',
      period: 'Oktober 2019 – Sekarang',
      description: 'Aktif dalam organisasi kepemudaan kedisiplinan dan kepemimpinan untuk mengembangkan strategi penguatan karakter dan nilai kebangsaan.',
      order: 10,
    },
  ];

  for (const e of experienceData) {
    await prisma.experience.create({ data: e });
  }

  // 7. Create Certificates
  const certData = [
    {
      title: 'Fullstack Web Development & Laravel Architecture',
      issuer: 'Indorkarya Persada & Professional Standard',
      issueDate: '2025',
      credentialUrl: 'https://github.com',
      imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
      order: 1,
    },
    {
      title: 'Laboratorium Informatika Assistant Certificate',
      issuer: 'Universitas Ahmad Dahlan',
      issueDate: '2025',
      credentialUrl: 'https://github.com',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
      order: 2,
    },
    {
      title: 'Purna Paskibraka Indonesia Leadership Certification',
      issuer: 'Purna Paskibraka Indonesia',
      issueDate: '2019',
      credentialUrl: 'https://github.com',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      order: 3,
    },
  ];

  for (const c of certData) {
    await prisma.certificate.create({ data: c });
  }

  console.log('Seeding completed successfully with 15 real projects and updated Herbanova experience!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
