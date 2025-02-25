import { useState } from 'react';
import { Lightbulb, Code, Palette, Briefcase, BarChart, Users, Clock, Zap, Target, ArrowRight, ChevronDown } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import QuoteRequest from '../components/QuoteRequest';
import ClientBanner from '../components/ClientBanner';

export default function Home() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const services = [
    {
      title: 'Project Consulting',
      description: 'Strategic guidance to transform your ideas into actionable plans.',
      icon: <Briefcase className="w-6 h-6" />
    },
    {
      title: 'Creative Design',
      description: 'Innovative solutions that capture your brand\'s essence.',
      icon: <Palette className="w-6 h-6" />
    },
    {
      title: 'Tech Integration',
      description: 'Seamless integration of cutting-edge technology.',
      icon: <Code className="w-6 h-6" />
    },
    {
      title: 'Digital Innovation',
      description: 'Forward-thinking solutions for the digital landscape.',
      icon: <Lightbulb className="w-6 h-6" />
    }
  ];

  const metrics = [
    { number: '98%', label: 'Client Satisfaction', icon: <Users className="w-6 h-6" /> },
    { number: '45%', label: 'ROI Increase', icon: <BarChart className="w-6 h-6" /> },
    { number: '2x', label: 'Faster Delivery', icon: <Clock className="w-6 h-6" /> }
  ];

  const process = [
    {
      title: 'Discovery',
      description: 'Understanding your unique needs and goals.',
      icon: <Target className="w-6 h-6" />
    },
    {
      title: 'Strategy',
      description: 'Developing a tailored plan for success.',
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      title: 'Execution',
      description: 'Bringing your vision to life with precision.',
      icon: <Code className="w-6 h-6" />
    },
    {
      title: 'Launch',
      description: 'Ensuring successful deployment and growth.',
      icon: <Zap className="w-6 h-6" />
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

      {/* Client Banner */}
      <ClientBanner />

      {/* Services & Metrics Combined Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  {metric.icon}
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">{metric.number}</div>
                  <div className="text-gray-600 text-sm">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Services */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-8"></div>
          </div>

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

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Work</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-gray-50 p-6 rounded-xl hover:bg-blue-50 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-6 transform -translate-y-1/2 -translate-x-3">
                    <ArrowRight className="w-6 h-6 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Client Success Stories</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Blueprint Studios modernized our infrastructure, reducing costs by 32% and improving response times.",
                author: "Sarah Johnson",
                role: "Director of Digital Operations, TechStart"
              },
              {
                quote: "Launched our e-commerce platform 2 weeks early, increasing online sales by 45% in Q1.",
                author: "Michael Chen",
                role: "Head of E-commerce, Innovate Inc"
              },
              {
                quote: "UI/UX redesign boosted user engagement by 28% with a 4.8-star app rating.",
                author: "Emily Rodriguez",
                role: "Product Manager, Design Co"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <p className="text-gray-600 mb-4 text-sm italic">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
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
