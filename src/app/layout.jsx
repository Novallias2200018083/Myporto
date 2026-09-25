import './globals.css';

export const metadata = {
  title: 'Noval Lias Ramadani | Fullstack Developer',
  description:
    'Portofolio Profesional Noval Lias Ramadani - Fullstack Developer, Project Manager, System Analyst, dan IT Enthusiast.',
  keywords: ['Noval Lias Ramadani', 'Fullstack Developer', 'Project Manager', 'System Analyst', 'Next.js', 'React', 'Portfolio'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
