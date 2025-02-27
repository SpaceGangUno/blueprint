import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, Plus, Minus, ArrowRight, Zap, Sparkles } from 'lucide-react';
import QuoteRequest from '../components/QuoteRequest';
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

export default function Home() {
  // Meta description for the Home page
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Function to toggle expanded service
  const toggleService = (index: number) => {
    if (expandedService === index) {
      setExpandedService(null);
    } else {
      setExpandedService(index);
    }
  };

  // Function to get icon for category
  const getIconForCategory = (title: string, isActive: boolean) => {
    const className = `w-5 h-5 ${isActive ? 'text-white' : 'text-blue-500'}`;
    
    // Use title to determine which icon to show for different categories
    // For now, we'll just use Sparkles for all categories
    console.log(`Getting icon for category: ${title}`);
    return <Sparkles className={className} />;
  };

  // Auto-rotate categories every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % serviceCategories.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Service categories
  const serviceCategories = [
    {
      title: 'Branding That Stands Out',
      description: 'Create a memorable look and voice that customers love.',
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Logo & Visual Identity',
          description: 'Design or refresh your logo, colors, and style to look professional instantly.',
          features: [
            'Simple updates to your current branding',
            'Full brand kits for new businesses'
          ]
        },
        {
          title: 'Brand Personality',
          description: 'Define your vibe (fun, trustworthy, bold) so customers connect with you.',
          features: [
            'Help with taglines, social media voice, or packaging design'
          ]
        }
      ],
      ctaText: 'Make Your Mark',
      ctaLink: '/services#branding'
    },
    {
      title: 'Marketing That Works',
      description: 'Get new customers and keep them coming back.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Hype Campaigns',
          description: 'Launch products/services with excitement.',
          features: [
            'Social media teasers',
            'Email announcements',
            'Limited-time discounts'
          ]
        },
        {
          title: 'Loyalty Programs',
          description: 'Reward repeat customers.',
          features: [
            'Refer-a-friend discounts',
            'VIP perks or points systems'
          ]
        },
        {
          title: 'Simple Ads',
          description: 'Run Facebook/Google ads that actually sell.',
          features: [
            'No confusing jargon—we set them up for you',
            'Track what\'s working'
          ]
        }
      ],
      ctaText: 'Grow Your Reach',
      ctaLink: '/services#marketing'
    },
    {
      title: 'Digital Tools & Apps',
      description: 'Build easy-to-use websites, apps, and tools.',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Custom Websites',
          description: 'Mobile-friendly sites that let customers find, trust, and buy from you.',
          features: [
            'Edit text/images yourself',
            'Built-in booking/contact forms'
          ]
        },
        {
          title: 'Business Apps',
          description: 'Save time with tools like appointment reminders or loyalty apps.',
          features: [
            'Affordable monthly plans'
          ]
        },
        {
          title: 'Online Stores',
          description: 'Sell products/services securely.',
          features: [
            'Connect to social media or local pickup'
          ]
        }
      ],
      ctaText: 'See How We Can Help',
      ctaLink: '/services#digital'
    },
    {
      title: 'Products & Spaces',
      description: 'Create physical products or eye-catching spaces.',
      image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Product Design',
          description: 'Turn your idea into a real product.',
          features: [
            'Work with local manufacturers',
            'Eco-friendly options'
          ]
        },
        {
          title: 'Storefronts & Events',
          description: 'Design pop-up shops or booths that attract customers.',
          features: [
            'Budget-friendly setups'
          ]
        }
      ],
      ctaText: 'Make It Real',
      ctaLink: '/services#products'
    }
  ];

  // Portfolio projects
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

  const filteredProjects = projects.filter(
    project => selectedCategory === 'all' || project.category === selectedCategory
  );

  return (
    <div className="pt-16">
      <Helmet>
        <title>Blueprint Studios - Digital Design & Development</title>
        <meta name="description" content="Blueprint Studios is a full-service creative studio dedicated to bringing your ideas to life. We offer branding, marketing, digital tools, product design, and strategic guidance for businesses of all sizes." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
            alt="Blueprint Studios creative workspace with modern design elements"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
              From Concept
              <span className="text-blue-400 ml-2 sm:ml-4">
                to Reality
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Full-service creative studio dedicated to bringing your ideas to life
            </p>
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 animate-bounce hover:bg-white/20 transition-colors cursor-pointer">
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
        </div>
      </section>

      {/* Our Work Section - Interactive Version */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-400/10 animate-float"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 15}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-yellow-400 mr-2 animate-pulse" />
              <h2 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Our Work
              </h2>
              <Sparkles className="w-8 h-8 text-yellow-400 ml-2 animate-pulse" />
            </div>
            <div className="w-24 h-2 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Practical solutions that help small businesses grow without the tech headaches.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {serviceCategories.map((category, index) => (
                <button
                  key={category.title}
                  onClick={() => setActiveCategory(index)}
                  className={`px-4 py-3 rounded-full transition-all duration-300 text-sm md:text-base font-medium flex items-center
                    ${activeCategory === index 
                      ? 'bg-blue-600 text-white shadow-lg scale-105' 
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                  {getIconForCategory(category.title, activeCategory === index)}
                  <span className="ml-2">{category.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Category Content */}
          <div className="transition-all duration-500 transform">
            <div className="lg:flex gap-8 items-center">
              {/* Category Image with Animation */}
              <div className="lg:w-2/5 mb-8 lg:mb-0">
                <div className="relative rounded-xl overflow-hidden shadow-xl h-64 lg:h-96 transform transition-all duration-700 hover:scale-[1.02] group">
                  <img 
                    src={serviceCategories[activeCategory].image} 
                    alt={`${serviceCategories[activeCategory].title} - ${serviceCategories[activeCategory].description}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-500">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-y-[-5px]">
                      {serviceCategories[activeCategory].title}
                    </h3>
                    <p className="text-gray-200 group-hover:translate-y-[-5px] transition-all duration-500 delay-100">
                      {serviceCategories[activeCategory].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Services */}
              <div className="lg:w-3/5">
                <div className="space-y-6">
                  {serviceCategories[activeCategory].services.map((service, serviceIndex) => (
                    <div 
                      key={service.title}
                      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 
                        border-l-4 border-blue-500 overflow-hidden
                        ${expandedService === serviceIndex ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                        transform hover:-translate-y-1`}
                    >
                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => toggleService(serviceIndex)}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-xl font-semibold text-gray-900">{service.title}</h4>
                          <button className="text-blue-500 hover:text-blue-700 transition-colors">
                            {expandedService === serviceIndex ? 
                              <Minus className="w-5 h-5" /> : 
                              <Plus className="w-5 h-5" />
                            }
                          </button>
                        </div>
                        <p className="text-gray-600 mt-2">{service.description}</p>
                      </div>
                      
                      {/* Expandable Features */}
                      <div 
                        className={`px-6 transition-all duration-500 ease-in-out overflow-hidden
                          ${expandedService === serviceIndex ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <ul className="space-y-3 border-t border-gray-100 pt-4">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <ArrowRight className="w-4 h-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center mt-10">
                    <a 
                      href={serviceCategories[activeCategory].ctaLink} 
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg 
                        hover:from-blue-700 hover:to-blue-800 transition-all duration-300 
                        shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      {serviceCategories[activeCategory].ctaText}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Projects Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          
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

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <button
            onClick={() => setShowQuoteModal(true)}
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Request a Quote
          </button>
        </div>
      </section>

      <QuoteRequest 
        isOpen={showQuoteModal} 
        onClose={() => setShowQuoteModal(false)} 
      />
    </div>
  );
}
