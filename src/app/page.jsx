import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Certificates from '@/components/Certificates';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

function safeJsonParse(val, fallback) {
  if (typeof val === 'object' && val !== null) return val;
  if (!val || typeof val !== 'string') return fallback;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

async function getPortfolioData() {
  try {
    const [user, settings, projects, skills, experiences, certificates] = await Promise.all([
      prisma.user.findFirst(),
      prisma.siteSetting.findFirst(),
      prisma.project.findMany({
        orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.skill.findMany({
        orderBy: [{ order: 'asc' }],
      }),
      prisma.experience.findMany({
        orderBy: [{ order: 'asc' }],
      }),
      prisma.certificate.findMany({
        orderBy: [{ order: 'asc' }],
      }),
    ]);

    const parsedUser = user
      ? {
          ...user,
          socials: safeJsonParse(user.socials, {}),
        }
      : null;

    const parsedProjects = (projects || []).map((p) => ({
      ...p,
      techStack: safeJsonParse(p.techStack, []),
    }));

    return {
      user: parsedUser,
      settings: settings || {
        availableForHire: true,
        statusBadgeText: 'Available for new projects',
        statsExperience: '3+ Years',
        statsProjects: '20+ Built',
        statsClients: '12+ Happy',
      },
      projects: parsedProjects,
      skills: skills || [],
      experiences: experiences || [],
      certificates: certificates || [],
    };
  } catch (error) {
    console.error('Error fetching data on home page:', error);
    return {
      user: null,
      settings: null,
      projects: [],
      skills: [],
      experiences: [],
      certificates: [],
    };
  }
}

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <div className="relative min-h-screen">
      <Navbar user={data.user} />
      <main>
        <Hero user={data.user} settings={data.settings} />
        <Stats settings={data.settings} />
        <About user={data.user} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Experience experiences={data.experiences} />
        <Certificates certificates={data.certificates} />
        <Contact user={data.user} />
      </main>
      <Footer user={data.user} />
    </div>
  );
}
