import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Coffee, Phone, Mail, Zap } from 'lucide-react';
import QuoteRequest from '../components/QuoteRequest';

export default function Contact() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  return (
    <>
      <Helmet>
        <title>Contact Us | Blueprint Studios</title>
        <meta name="description" content="Get in touch with Blueprint Studios. We're ready to bring your ideas to life with our expert design and development services. Contact us today to start your project." />
      </Helmet>
      <div className="min-h-screen pt-16">
      <div className="relative">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-[#1E0B2C] overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.1
              }}
            >
              {i % 2 === 0 ? <Star className="w-8 h-8" /> : <Coffee className="w-8 h-8" />}
            </div>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Let's Create Something Amazing
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              Don't be shy, we're just as excited to hear from you!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="tel:9294132940" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00E0FF] text-black rounded-full hover:bg-[#00E0FF]/80 transition-all"
              >
                <Phone className="w-5 h-5" />
                Call Us: (929) 413-2940
              </a>
              <a 
                href="mailto:create@blueprintstudios.tech" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white rounded-full hover:bg-[#FF6B00]/80 transition-all"
              >
                <Mail className="w-5 h-5" />
                Email Now
              </a>
              <a 
                href="https://calendly.com/create-blueprintstudios" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C3AED] text-white rounded-full hover:bg-[#6D28D9] transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Schedule a Free Consultation
              </a>
            </div>
          </div>


          {/* Interactive Call-to-Action */}
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Ready to Start Your Project?</h3>
              <p className="text-gray-300 mb-6">
                Tell us about your vision and let's create something amazing together. Our team is ready to bring your ideas to life!
              </p>
              <button
                onClick={() => setShowQuoteModal(true)}
                className="px-8 py-4 bg-[#FF6B00] text-white rounded-xl hover:bg-[#E05A00] transition-all inline-flex items-center justify-center gap-2 group"
              >
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Your Project
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="p-6 border-2 border-gray-800 rounded-xl hover:border-[#00E0FF] transition-all hover:shadow-md">
                <h4 className="text-lg font-semibold mb-2 text-white">Our Process</h4>
                <p className="text-gray-300">
                  We follow a collaborative approach to ensure your vision comes to life exactly as you imagined.
                </p>
              </div>
              
              <div className="p-6 border-2 border-gray-800 rounded-xl hover:border-[#00E0FF] transition-all hover:shadow-md">
                <h4 className="text-lg font-semibold mb-2 text-white">Transparent Pricing</h4>
                <p className="text-gray-300">
                  No hidden fees or surprises. We provide clear estimates before any work begins.
                </p>
              </div>
              
              <div className="p-6 border-2 border-gray-800 rounded-xl hover:border-[#FFEC00] transition-all hover:shadow-md">
                <h4 className="text-lg font-semibold mb-2 text-white">Fast Turnaround</h4>
                <p className="text-gray-300">
                  We value your time and work efficiently to deliver quality results on schedule.
                </p>
              </div>
              
              <div className="p-6 border-2 border-gray-800 rounded-xl hover:border-[#FFEC00] transition-all hover:shadow-md">
                <h4 className="text-lg font-semibold mb-2 text-white">Ongoing Support</h4>
                <p className="text-gray-300">
                  Our relationship doesn't end at delivery. We provide continued support for your project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    
      <QuoteRequest 
        isOpen={showQuoteModal} 
        onClose={() => setShowQuoteModal(false)} 
      />
    </>
  );
}
