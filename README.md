# 🚀 Dokumentasi Sistem - MyPorto Fullstack Portfolio & CMS

**MyPorto** adalah aplikasi web portofolio personal dan Content Management System (CMS) modern berkinerja tinggi yang dibangun untuk **Noval Lias Ramadani** (Fullstack Developer, Project Manager, dan System Analyst). Sistem ini memadukan tampilan publik yang interaktif dan estetis (*Modern Dark/Light Glassmorphism*) dengan dashboard manajemen konten (*Admin Panel*) yang aman dan fleksibel.

---

## 📑 Daftar Isi
1. [Ringkasan Arsitektur & Teknologi](#-1-ringkasan-arsitektur--teknologi)
2. [Fitur Utama Sistem](#-2-fitur-utama-sistem)
3. [Struktur Folder & Direktori](#-3-struktur-folder--direktori)
4. [Skema Basis Data (Database Schema)](#-4-skema-basis-data-database-schema)
5. [Daftar Endpoint API (RESTful API)](#-5-daftar-endpoint-api-restful-api)
6. [Panduan Instalasi & Menjalankan Sistem](#-6-panduan-instalasi--menjalankan-sistem)
7. [Panduan Penggunaan Panel Admin](#-7-panduan-penggunaan-panel-admin)
8. [Keamanan & Optimasi Sistem](#-8-keamanan--optimasi-sistem)

---

## 🛠️ 1. Ringkasan Arsitektur & Teknologi

| Lapisan (Layer) | Teknologi / Library | Keterangan |
|:---|:---|:---|
| **Core Framework** | **Next.js 14.2 (App Router)** | Server Components, Client Components, dan Route Handlers. |
| **Frontend UI Library** | **React 18** | Reusable UI components, hooks, dan state management lokal. |
| **Styling & Design System** | **Tailwind CSS & Glassmorphism** | Custom dark/light mode, backdrop blur, palet warna slate & emerald-teal. |
| **Icons & Micro-Interactions** | **Lucide React & Framer Motion** | Ikon visual modern, dynamic icon loader, animasi transisi halus. |
| **Database & ORM** | **SQLite & Prisma ORM** | Relational mapping, type-safe queries, dan mudah dimigrasi ke PostgreSQL/MySQL. |
| **Autentikasi & Security** | **JWT (JSON Web Token) & bcryptjs** | HttpOnly Session Cookies, password hashing, dan route protection middleware. |
| **File Handling** | **Node.js `fs/promises` & Multipart** | Upload file lokal ke `/public/uploads/` dengan sanitasi nama & timestamp unik. |

---

## ✨ 2. Fitur Utama Sistem

### A. Tampilan Publik (Public Facing)
1. **Hero Section:**
   * Foto profil interaktif dengan sistem **3-Card Carousel Switcher**.
   * Headline profesional dinamis dengan tombol aksi langsung (*Download CV*, *Hubungi Saya*).
   * Quick Counter Metrik (Tahun Pengalaman, Proyek Selesai, Kepuasan Klien, Kode Kontribusi).
2. **About Me:**
   * Uraian profil terstruktur dengan paragraf rata kanan-kiri (*justify*).
   * 4 Pilar Kompetensi (Arsitektur Bersih, Performa Tinggi, Manajemen Proyek, UX Modern).
3. **Portofolio Proyek Terpilih (19 Proyek Nyata):**
   * Filter kategori dinamis: `Semua`, `Enterprise & CRM`, `Quality Control`, `Finance`, `Fullstack`, `Frontend`, `AI & Algorithm`.
   * Modal Detail Interaktif (*Project Detail Modal*) dengan format rata kanan-kiri, badge status, tech stack badges, tautan Live Demo, dan Source Code.
4. **Riwayat Pengalaman & Edukasi:**
   * Filter tab: `Semua Riwayat`, `Pengalaman Kerja`, `Edukasi & Asistensi`, `Organisasi`.
   * Highlight badge **"Aktif"** berdenyut halus pada pekerjaan yang sedang berlangsung (*November 2025 – Sekarang*).
5. **Matriks Keahlian (Skills):**
   * Pengelompokan keahlian ke dalam kategori: *Backend*, *Frontend*, *Database*, *DevOps & Tools*.
   * Indikator progress bar tingkat kemahiran (*proficiency level*).
6. **Sertifikat & Lisensi:**
   * Galeri sertifikasi digital dengan tautan kredensial resmi.
7. **Form Kontak & Kirim Pesan:**
   * Validasi data input server-side, pencegahan spam, dan notifikasi instan.

### B. Panel Administrasi (Admin CMS - `/admin`)
1. **Dashboard Overview:** Ringkasan statistik jumlah proyek, pesan masuk belum dibaca, sertifikat, dan skill aktif.
2. **Kelola Profil:** Pengaturan biodata, bio singkat, multiple foto profil, link Google Drive CV, serta tautan media sosial (GitHub, LinkedIn, WhatsApp, Email).
3. **Kelola Proyek (CRUD):** Tambah proyek baru, unggah cover gambar, atur badge *Featured*, kelola daftar teknologi/tags, edit, dan hapus proyek.
4. **Kelola Pengalaman (CRUD):** Tambah dan urutkan riwayat pekerjaan, asistensi laboratorium, dan organisasi.
5. **Kelola Skill (CRUD):** Tambah skill, pilih icon dari preset Lucide, tentukan kategori dan persentase level.
6. **Kelola Sertifikat (CRUD):** Unggah sertifikat kompetensi dan tautan verifikasi.
7. **Kotak Masuk Pesan:** Membaca pesan masuk dari pengunjung, menandai status telah dibaca, atau menghapus pesan.

---

## 📂 3. Struktur Folder & Direktori

```text
Myporto/
├── prisma/
│   ├── schema.prisma          # Definisi skema database Prisma
│   ├── dev.db                 # File database SQLite lokal
│   └── seed.js                # Seeder data portofolio nyata
├── public/
│   ├── uploads/               # Direktori penyimpanan file foto/media yang diunggah
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/             # Halaman Dashboard CMS Admin
│   │   │   └── page.jsx
│   │   ├── api/               # RESTful API Route Handlers
│   │   │   ├── admin/         # Endpoint CRUD khusus admin (terproteksi JWT)
│   │   │   ├── auth/          # Endpoint login, logout, & verifikasi sesi
│   │   │   ├── contact/       # Endpoint submit pesan kontak publik
│   │   │   ├── portfolio/     # Endpoint fetch seluruh data portofolio publik
│   │   │   └── upload/        # Endpoint upload file foto/gambar
│   │   ├── layout.jsx         # Root Layout & Theme Provider
│   │   ├── page.jsx           # Halaman Utama (One-Page Portfolio)
│   │   └── globals.css        # Konfigurasi Tailwind & Glassmorphism styles
│   ├── components/            # Komponen UI Reusable
│   │   ├── About.jsx          # Section Tentang Saya
│   │   ├── Certificates.jsx   # Section Galeri Sertifikat
│   │   ├── Contact.jsx        # Section Formulir Kontak
│   │   ├── DynamicIcon.jsx    # Component renderer ikon Lucide dinamis
│   │   ├── Experience.jsx     # Section Timeline Pengalaman
│   │   ├── Hero.jsx           # Section Hero & Intro
│   │   ├── HeroCardCarousel.jsx # Komponen Switcher 3 Foto Profil
│   │   ├── ImageUpload.jsx    # Widget upload gambar drag & drop untuk Admin
│   │   ├── Navbar.jsx         # Header navigasi responsif dengan Dark Mode toggle
│   │   ├── ProjectModal.jsx   # Modal detail proyek (Justified text)
│   │   ├── Projects.jsx       # Section Galeri Proyek
│   │   ├── Skills.jsx         # Section Matriks Keahlian
│   │   └── Stats.jsx          # Section Counter Metrik
│   └── lib/                   # Utility & Konfigurasi
│       ├── auth.js            # JWT Token signing, verification, & session cookies
│       ├── iconPresets.js     # Preset daftar ikon untuk CMS
│       └── prisma.js          # Singleton instance PrismaClient
├── .env                       # Variabel konfigurasi lingkungan
├── next.config.mjs            # Konfigurasi Next.js
├── tailwind.config.js         # Konfigurasi tema Tailwind CSS
└── package.json               # Dependensi proyek
```

---

## 🗄️ 4. Skema Basis Data (Database Schema)

Skema database dimodelkan menggunakan Prisma ORM (`prisma/schema.prisma`):

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. Akun Pengguna / Profil Portofolio
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String   // Hashed with bcryptjs
  name      String
  title     String
  bio       String
  about     String
  avatarUrl String?  // Menyimpan JSON Array foto profil
  resumeUrl String?  // Link Google Drive CV
  socials   String?  // JSON String: github, linkedin, whatsapp, email, twitter
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 2. Proyek Portofolio
model Project {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  category    String   // Enterprise, Finance, Fullstack, Frontend, AI, Mobile
  description String
  coverImage  String
  demoUrl     String?
  githubUrl   String?
  techStack   String   // JSON Array string
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 3. Riwayat Pengalaman & Pendidikan
model Experience {
  id          String   @id @default(uuid())
  type        String   // WORK, EDUCATION, ORGANIZATION
  role        String
  institution String
  period      String
  description String
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 4. Matriks Keahlian (Skills)
model Skill {
  id        String   @id @default(uuid())
  name      String
  category  String   // Backend, Frontend, Database, DevOps & Tools
  iconName  String   // Nama Ikon Lucide
  level     Int      @default(80) // 1 - 100
  order     Int      @default(0)
  createdAt DateTime @default(now())
}

// 5. Sertifikasi & Lisensi
model Certificate {
  id            String   @id @default(uuid())
  title         String
  issuer        String
  issueDate     String
  credentialUrl String?
  imageUrl      String?
  order         Int      @default(0)
  createdAt     DateTime @default(now())
}

// 6. Pesan Kontak Masuk
model ContactMessage {
  id        String   @id @default(uuid())
  name      String
  email     String
  subject   String?
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## 🌐 5. Daftar Endpoint API (RESTful API)

### 🔹 Public Endpoints
* **`GET /api/portfolio`**: Mengambil seluruh data publik (Profil, Proyek, Pengalaman, Skill, Sertifikat, Statistik).
* **`POST /api/contact`**: Mengirim pesan baru dari form kontak publik.

### 🔹 Authentication Endpoints
* **`POST /api/auth/login`**: Melakukan autentikasi username & password, lalu membuat session cookie `admin_session_token`.
* **`GET /api/auth/me`**: Memverifikasi status login user yang sedang aktif.
* **`POST /api/auth/logout`**: Menghapus session cookie dan keluar dari sesi admin.

### 🔹 Admin Endpoints (Memerlukan Cookie Sesi Admin)
* **`POST /api/upload`**: Upload file gambar (JPG, PNG, WebP) ke server.
* **`PUT /api/admin/profile`**: Memperbarui profil, foto, bio, dan link media sosial.
* **`GET | POST | PUT | DELETE /api/admin/projects`**: Operasi CRUD data proyek.
* **`GET | POST | PUT | DELETE /api/admin/experiences`**: Operasi CRUD data pengalaman kerja/edukasi.
* **`GET | POST | PUT | DELETE /api/admin/skills`**: Operasi CRUD data matriks keahlian.
* **`GET | POST | PUT | DELETE /api/admin/certificates`**: Operasi CRUD sertifikat.
* **`GET | PATCH | DELETE /api/admin/messages`**: Mengelola kotak masuk pesan kontak.

---

## 🚀 6. Panduan Instalasi & Menjalankan Sistem

### 1. Prasyarat
* **Node.js:** Versi 18.17.0 atau lebih baru (Disarankan Node.js v20/v22).
* **NPM:** Bawaan dari instalasi Node.js.

### 2. Konfigurasi File Lingkungan (`.env`)
Pastikan file `.env` berada di root folder proyek:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="rahasia-kunci-jwt-portofolio-noval-2026"
NODE_ENV="development"
```

### 3. Migrasi Database & Seeding Data
Jalankan perintah berikut untuk menginisialisasi skema dan mengisi 19 data proyek nyata:
```bash
# Sinkronisasi Skema Database
npx prisma db push

# Menjalankan Seeder Data Portofolio Lengkap
node prisma/seed.js
```

### 4. Menjalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Buka browser dan akses:
* **Website Publik:** `http://localhost:3000`
* **Admin CMS Panel:** `http://localhost:3000/admin`

### 5. Membangun untuk Produksi (Production Build)
```bash
npm run build
npm start
```

---

## 🔑 7. Panduan Penggunaan Panel Admin

1. Akses URL `http://localhost:3000/admin` melalui browser.
2. Masukkan kredensial login default:
   * **Username:** `admin`
   * **Password:** `admin123`
3. Setelah masuk, Anda dapat:
   * Mengubah foto profil secara langsung dengan klik **Ganti Foto**.
   * Menambahkan proyek baru beserta cover image, live demo URL, dan tag teknologi.
   * Menambah/mengedit riwayat pengalaman kerja serta mengatur status aktif.
   * Menambah sertifikat baru dengan mengunggah gambar sertifikat.
   * Membaca dan menghapus pesan kontak yang dikirim oleh pengunjung.

---

## 🛡️ 8. Keamanan & Optimasi Sistem

1. **HttpOnly Cookies:** Token JWT disimpan secara eksklusif di dalam cookie dengan flag `HttpOnly` dan `SameSite=Lax` untuk mencegah serangan *Cross-Site Scripting (XSS)*.
2. **Password Hashing:** Kata sandi akun admin dienkripsi menggunakan algoritma *bcryptjs* dengan salt rounds standar industri.
3. **Safe File Upload:** Penamaan file yang diunggah secara otomatis disanitasi dari karakter khusus dan ditambahkan stempel waktu milidetik (*unique timestamp*) guna menghindari konflik nama berkas atau *directory traversal*.
4. **Optimasi Asset:** Format gambar teroptimasi dengan Next.js Image optimizer serta sistem caching API dinamis.

---
*Dibuat & Didokumentasikan untuk: **Noval Lias Ramadani** | Portofolio Sistem Fullstack Developer.*