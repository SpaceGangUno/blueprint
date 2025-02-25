import { useState } from 'react';
import { Lightbulb, Code, Palette, Briefcase, ChevronDown } from 'lucide-react';
import QuoteRequest from '../components/QuoteRequest';
import ClientBanner from '../components/ClientBanner';

export default function Home() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const services = [
    {
      title: 'Project Consulting',
      description: 'Strategic guidance for your ideas.',
      icon: <Briefcase className="w-6 h-6" />
    },
    {
      title: 'Creative Design',
      description: 'Innovative solutions for your brand.',
      icon: <Palette className="w-6 h-6" />
    },
    {
      title: 'Tech Integration',
      description: 'Cutting-edge technology solutions.',
      icon: <Code className="w-6 h-6" />
    },
    {
      title: 'Digital Innovation',
      description: 'Forward-thinking digital solutions.',
      icon: <Lightbulb className="w-6 h-6" />
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section - Inspired by Elite Media */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center overflow-hidden bg-purple-700">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white/90 tracking-tight leading-none">
              FROM<br />
              CONCEPT<br />
              <span className="text-white">
                TO REALITY
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white/80 max-w-3xl leading-relaxed">
              Full-service creative studio dedicated to bringing your ideas to life
            </p>
            <div className="pt-4">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="inline-block px-8 py-4 bg-white text-purple-700 font-semibold rounded-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 animate-bounce hover:bg-white/20 transition-colors cursor-pointer">
            <ChevronDown className="w-7 h-7 text-white" />
          </div>
        </div>
      </section>

      {/* Client Banner - Styled to match Elite Media aesthetic */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-500 mb-8">OUR CLIENTS</h2>
          <ClientBanner />
        </div>
      </div>

      {/* Services Section - Inspired by Elite Media */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-500 mb-12">SELECTED SERVICES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={service.title} className="group relative">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center mr-4 font-medium">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuoteRequest 
        isOpen={showQuoteModal} 
        onClose={() => setShowQuoteModal(false)} 
      />
    </div>
  );
}
