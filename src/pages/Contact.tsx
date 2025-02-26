import { useState } from 'react';
import { Star, Coffee, Phone, Mail, Zap } from 'lucide-react';
import QuoteRequest from '../components/QuoteRequest';

export default function Contact() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  return (
    <>
      <div className="min-h-screen pt-16">
      <div className="relative">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Let's Create Something Amazing
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Don't be shy, we're just as excited to hear from you!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="tel:9294132940" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all"
              >
                <Phone className="w-5 h-5" />
                Call Us: (929) 413-2940
              </a>
              <a 
                href="mailto:create@blueprintstudios.tech" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
              >
                <Mail className="w-5 h-5" />
                Email Now
              </a>
            </div>
          </div>


          {/* Interactive Call-to-Action */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Ready to Start Your Project?</h3>
              <p className="text-gray-600 mb-6">
                Tell us about your vision and let's create something amazing together. Our team is ready to bring your ideas to life!
              </p>
              <button
                onClick={() => setShowQuoteModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-all inline-flex items-center justify-center gap-2 group"
              >
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Your Project
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-all hover:shadow-md">
                <h4 className="text-lg font-semibold mb-2">Our Process</h4>
                <p className="text-gray-600">
                  We follow a collaborative approach to ensure your vision comes to life exactly as you imagined.
                </p>
              </div>
              
              <div className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-all hover:shadow-md">
                <h4 className="text-lg font-semibold mb-2">Transparent Pricing</h4>
                <p className="text-gray-600">
                  No hidden fees or surprises. We provide clear estimates before any work begins.
                </p>
              </div>
              
              <div className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-all hover:shadow-md">
                <h4 className="text-lg font-semibold mb-2">Fast Turnaround</h4>
                <p className="text-gray-600">
                  We value your time and work efficiently to deliver quality results on schedule.
                </p>
              </div>
              
              <div className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-all hover:shadow-md">
                <h4 className="text-lg font-semibold mb-2">Ongoing Support</h4>
                <p className="text-gray-600">
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
