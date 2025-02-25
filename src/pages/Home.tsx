import { useState } from 'react';
import { Lightbulb, Code, Palette, Briefcase, ChevronDown } from 'lucide-react';
import QuoteRequest from '../components/QuoteRequest';

export default function Home() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Service categories
  const serviceCategories = [
    {
      title: 'Digital Tools & Apps',
      description: 'Build easy-to-use websites, apps, and tools that grow your business.',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Custom Websites',
          description: 'Mobile-friendly sites that let customers find, trust, and buy from you.',
          features: [
            'Simple updates (you can edit text/images yourself!)',
            'Built-in contact forms or booking systems'
          ]
        },
        {
          title: 'Business Apps',
          description: 'Apps that save you time, like scheduling tools or customer loyalty programs.',
          features: [
            'Affordable monthly plans',
            'Automate repetitive tasks (e.g., appointment reminders)'
          ]
        },
        {
          title: 'Online Stores',
          description: 'Sell products or services with secure payment options.',
          features: [
            'Connect to social media or local pickup',
            'Track orders in real time'
          ]
        }
      ],
      ctaText: 'See How We Can Help',
      ctaLink: '/services#digital'
    },
    {
      title: 'Products & Spaces',
      description: 'Create physical products or eye-catching spaces that reflect your brand.',
      image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Product Design',
          description: 'Turn your idea into a real, sellable product.',
          features: [
            'Work with local manufacturers',
            'Eco-friendly material options'
          ]
        },
        {
          title: 'Storefronts & Events',
          description: 'Design spaces that attract customers—like pop-up shops or trade show booths.',
          features: [
            'Budget-friendly setups',
            'Reusable displays for future events'
          ]
        }
      ],
      ctaText: 'Make It Real',
      ctaLink: '/services#products'
    },
    {
      title: 'Guidance & Planning',
      description: 'Get clear, practical advice to make smart tech decisions.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Tech Roadmaps',
          description: 'Affordable plans to choose the right tools for your goals.',
          features: [
            'No confusing tech talk—we explain things simply',
            'Avoid overspending on unnecessary features'
          ]
        },
        {
          title: 'Website Checkups',
          description: 'Fix issues that might be turning customers away.',
          features: [
            'Make your site faster and easier to navigate',
            'Ensure it looks great on phones'
          ]
        }
      ],
      ctaText: 'Talk to Us',
      ctaLink: '/contact'
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
            alt="Hero background"
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

      {/* What We Do Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Practical solutions that help small businesses grow without the tech headaches.
            </p>
          </div>

          {serviceCategories.map((category, categoryIndex) => (
            <div key={category.title} className={`mb-24 ${categoryIndex % 2 === 1 ? 'lg:flex-row-reverse' : ''} lg:flex gap-8 items-center`}>
              {/* Category Image */}
              <div className="lg:w-2/5 mb-8 lg:mb-0">
                <div className="relative rounded-xl overflow-hidden shadow-xl h-64 lg:h-96">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                    <p className="text-gray-200">{category.description}</p>
                  </div>
                </div>
              </div>

              {/* Category Services */}
              <div className="lg:w-3/5">
                <div className="space-y-6">
                  {category.services.map((service) => (
                    <div key={service.title} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-blue-500">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h4>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  
                  <div className="text-center mt-8">
                    <a 
                      href={category.ctaLink} 
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {category.ctaText}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
