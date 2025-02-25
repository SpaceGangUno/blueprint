import { useState } from 'react';
import { Lightbulb, Code, Palette, Briefcase, ChevronDown } from 'lucide-react';
import QuoteRequest from '../components/QuoteRequest';

export default function Home() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Services with portfolio images
  const services = [
    {
      title: 'Project Consulting',
      description: 'Strategic guidance to transform your ideas into actionable plans.',
      icon: <Briefcase className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      category: 'Strategy'
    },
    {
      title: 'Creative Design',
      description: 'Innovative solutions that capture your brand\'s essence.',
      icon: <Palette className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80',
      category: 'Design'
    },
    {
      title: 'Tech Integration',
      description: 'Seamless integration of cutting-edge technology.',
      icon: <Code className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80',
      category: 'Development'
    },
    {
      title: 'Digital Innovation',
      description: 'Forward-thinking solutions for the digital landscape.',
      icon: <Lightbulb className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1539189017399-63b9d09f6daf?auto=format&fit=crop&q=80',
      category: 'Innovation'
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

      {/* Visual Portfolio Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our expertise spans across multiple disciplines, delivering innovative solutions tailored to your unique needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {services.map((service) => (
              <div 
                key={service.title}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-600/90 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                  </div>
                  <p className="text-gray-200 text-sm">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <a 
              href="/services" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View All Services
            </a>
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
