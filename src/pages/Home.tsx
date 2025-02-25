import { useState } from 'react';
import { Lightbulb, Code, Palette, Briefcase } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
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
              Bringing Your Vision
              <span className="text-blue-400 ml-2 sm:ml-4">
                to Life
              </span>
            </h1>
<<<<<<< HEAD
=======
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Full-service consulting and creative studio focused on transforming ideas into exceptional digital experiences
            </p>
>>>>>>> parent of f32910f (Update Home.tsx)
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

      </section>

      {/* Client Banner */}
      <ClientBanner />

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
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
