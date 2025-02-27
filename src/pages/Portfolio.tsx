import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/portfolio/HeroSection';
import CategoryFilter from '../components/portfolio/CategoryFilter';
import ProjectCard from '../components/portfolio/ProjectCard';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  link: string;
  tags: string[];
  imageAlt?: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'TechCorp Website Redesign',
    description: 'Modern website redesign with enhanced user experience and performance optimization',
    category: 'web',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&h=1366',
    link: '#',
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
    imageAlt: 'TechCorp website redesign showing responsive layout on desktop and mobile devices with modern UI elements'
  },
  {
    id: '2',
    title: 'EcoTrack Mobile App',
    description: 'Cross-platform mobile application for tracking environmental impact',
    category: 'mobile',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=2426&h=1366',
    link: '#',
    tags: ['React Native', 'Firebase', 'Maps API'],
    imageAlt: 'EcoTrack mobile app interface showing environmental impact tracking dashboard with graphs and maps'
  },
  {
    id: '3',
    title: 'GreenLeaf Brand Identity',
    description: 'Complete brand identity design including logo, guidelines, and marketing materials',
    category: 'branding',
    image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&q=80&w=2426&h=1366',
    link: '#',
    tags: ['Branding', 'Logo Design', 'Guidelines'],
    imageAlt: 'GreenLeaf brand identity package showing logo variations, color palette, and marketing materials'
  },
  {
    id: '4',
    title: 'CloudSync Platform',
    description: 'Enterprise-level cloud synchronization and management platform',
    category: 'development',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2426&h=1366',
    link: '#',
    tags: ['Cloud', 'React', 'Node.js'],
    imageAlt: 'CloudSync platform dashboard showing cloud synchronization status and management controls'
  },
  {
    id: '5',
    title: 'FitLife Mobile App',
    description: 'Fitness tracking and workout planning mobile application',
    category: 'mobile',
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=2426&h=1366',
    link: '#',
    tags: ['iOS', 'Android', 'React Native'],
    imageAlt: 'FitLife mobile app screens showing workout tracking, fitness goals, and health statistics'
  },
  {
    id: '6',
    title: 'ArtGallery Website',
    description: 'Interactive virtual art gallery with 3D viewing experience',
    category: 'web',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&h=1366',
    link: '#',
    tags: ['Three.js', 'WebGL', 'React'],
    imageAlt: 'ArtGallery website showing 3D virtual gallery space with interactive art displays'
  }
];

export default function Portfolio() {
  // Meta description for the Portfolio page
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = projects.filter(
    project => selectedCategory === 'all' || project.category === selectedCategory
  );

  return (
    <div className="pt-16">
      <Helmet>
        <title>Our Work | Blueprint Studios</title>
        <meta name="description" content="Explore Blueprint Studios' portfolio of web development, mobile apps, branding, and design projects. See how we've helped businesses transform their digital presence." />
      </Helmet>
      <HeroSection
        title="Our Work"
        subtitle="Showcasing our finest projects and creative solutions"
        videoUrl="https://www.instagram.com/reel/DGd4dbzP_HV/embed/"
      />

      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </section>

      <section className="py-16 bg-[#1E0B2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                link={project.link}
                tags={project.tags}
                imageAlt={project.imageAlt}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-black via-black/90 to-[#1E0B2C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Let's create something amazing together
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-[#FF6B00] text-white font-semibold rounded-lg hover:bg-[#E05A00] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
