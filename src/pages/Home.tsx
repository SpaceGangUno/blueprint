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
      description: 'Strategic guidance and expert consultation to transform your ideas into actionable plans.',
      icon: <Briefcase className="w-6 h-6" />
    },
    {
      title: 'Creative Design',
      description: 'Innovative design solutions that capture your brand\'s essence and engage your audience.',
      icon: <Palette className="w-6 h-6" />
    },
    {
      title: 'Tech Integration',
      description: 'Seamless integration of cutting-edge technology to power your digital presence.',
      icon: <Code className="w-6 h-6" />
    },
    {
      title: 'Digital Innovation',
      description: 'Forward-thinking solutions that keep you ahead in the digital landscape.',
      icon: <Lightbulb className="w-6 h-6" />
    }
  ];

  const metrics = [
    { number: '98%', label: 'Client Satisfaction', icon: <Users className="w-6 h-6" /> },
    { number: '45%', label: 'Average ROI Increase', icon: <BarChart className="w-6 h-6" /> },
    { number: '2x', label: 'Faster Time to Market', icon: <Clock className="w-6 h-6" /> }
  ];

  const process = [
    {
      title: 'Discovery',
      description: 'We dive deep into your business goals and challenges to understand your unique needs.',
      icon: <Target className="w-6 h-6" />
    },
    {
      title: 'Strategy',
      description: 'Our team develops a comprehensive plan tailored to your objectives and timeline.',
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      title: 'Execution',
      description: 'We bring your vision to life with precision, expertise, and attention to detail.',
      icon: <Code className="w-6 h-6" />
    },
    {
      title: 'Launch & Growth',
      description: 'We ensure successful deployment and provide ongoing support for continuous improvement.',
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
              Bringing Your Vision
              <span className="text-blue-400 ml-2 sm:ml-4">
                to Life
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Full-service consulting and creative studio focused on transforming ideas into exceptional digital experiences
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

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Blueprint Studios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We deliver measurable results that drive your business forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {metric.icon}
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">{metric.number}</div>
                <div className="text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine creativity, technology, and strategy to deliver exceptional results for our clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* How We Work Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Work
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our proven process ensures consistent, high-quality results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-8 transform -translate-y-1/2 -translate-x-4">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            What Our Clients Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Blueprint Studios modernized our entire digital infrastructure in just 3 months. The new system reduced our operational costs by 32% and improved customer response times significantly.",
                author: "Sarah Johnson",
                role: "Director of Digital Operations, TechStart"
              },
              {
                quote: "Their team's deep understanding of both design and development helped us launch our e-commerce platform 2 weeks ahead of schedule. Our online sales increased by 45% in the first quarter.",
                author: "Michael Chen",
                role: "Head of E-commerce, Innovate Inc"
              },
              {
                quote: "The UI/UX redesign of our mobile app resulted in a 28% increase in user engagement and a 4.8-star rating on both app stores. Their attention to user feedback was exceptional.",
                author: "Emily Rodriguez",
                role: "Product Manager, Design Co"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <p className="text-gray-600 mb-6 italic">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
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
