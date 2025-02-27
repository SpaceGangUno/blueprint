import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, MessageSquare, Clock, Ban, ChevronLeft, ChevronRight } from 'lucide-react';
import QuoteRequest from '../components/QuoteRequest';
import ServiceCard from '../components/ServiceCard';

export default function Home() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll carousel
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300; // Adjust as needed
      const currentScroll = carouselRef.current.scrollLeft;
      
      carouselRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="pt-16">
      <Helmet>
        <title>Streetwear Marketing Agency | Launch Events, SMS Campaigns & Hype Content</title>
        <meta 
          name="description" 
          content="Specialized streetwear marketing agency creating digital buzz for physical drops, building hype, and driving foot traffic to your store." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          >
            <source src="https://player.vimeo.com/external/370331493.sd.mp4?s=e90dcaba73c19e0e36f03406b47bbd6992dd6c1c&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Crowded sneaker launch event with people waiting in line"
              className="w-full h-full object-cover"
            />
          </video>
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              Turn Limited Drops into 
              <span className="text-[#FF00FF] ml-2 sm:ml-4 block sm:inline">
                Long Lines
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed">
              Streetwear marketing that fuels FOMO, community, and in-store hype.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="inline-block px-8 py-4 bg-[#FF00FF] text-white font-bold rounded-lg hover:bg-[#CC00CC] transition-all duration-300 shadow-lg hover:shadow-[#FF00FF]/20 hover:-translate-y-1"
              >
                Get Your Free Hype Audit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Grid Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Streetwear Stores Struggle With:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              title="Creating Digital Buzz for Physical Drops"
              description="Online hype ≠ packed stores. We bridge the gap."
              icon={<MessageSquare className="w-6 h-6" />}
            />
            
            <ServiceCard 
              title="Selling Out Before Resellers Do"
              description="Build urgency with content that rewards local loyalty."
              icon={<Clock className="w-6 h-6" />}
            />
            
            <ServiceCard 
              title="Generic Marketing That Feels Corporate"
              description="We speak hypebeast – no cringe, just culture."
              icon={<Ban className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* Services Packages Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Package 1 */}
            <div className="bg-gray-800 rounded-lg p-8 border border-[#00FFE0]/30 hover:border-[#00FFE0] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-[#00FFE0]/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">The Drop Catalyst</h3>
                <p className="text-xl font-bold text-[#00FFE0]">From $1,500/drop</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-[#00FFE0] mr-2 flex-shrink-0 mt-0.5" />
                  <span>3 viral IG Reels/TikToks</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-[#00FFE0] mr-2 flex-shrink-0 mt-0.5" />
                  <span>SMS & email campaign design</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-[#00FFE0] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Event promo kit</span>
                </li>
              </ul>
              
              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full py-3 bg-transparent border border-[#00FFE0] text-[#00FFE0] font-bold rounded-lg hover:bg-[#00FFE0]/10 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
            
            {/* Package 2 */}
            <div className="bg-gray-800 rounded-lg p-8 border border-[#FF00FF]/30 hover:border-[#FF00FF] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-[#FF00FF]/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Hype Machine (Ongoing)</h3>
                <p className="text-xl font-bold text-[#FF00FF]">From $3,500/month</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-[#FF00FF] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Weekly social content + UGC</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-[#FF00FF] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Bi-weekly SMS campaigns</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-[#FF00FF] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Loyalty program integration</span>
                </li>
              </ul>
              
              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full py-3 bg-transparent border border-[#FF00FF] text-[#FF00FF] font-bold rounded-lg hover:bg-[#FF00FF]/10 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="/portfolio" 
              className="inline-flex items-center px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all duration-300 hover:-translate-y-1"
            >
              See Streetwear Portfolio
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Content Examples Carousel */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Content That Converts</h2>
          
          <div className="relative">
            {/* Carousel Navigation */}
            <button 
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Carousel Content */}
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto hide-scrollbar gap-6 pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Carousel Item 1 */}
              <div className="min-w-[300px] sm:min-w-[350px] snap-start">
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                    alt="Instagram Story mockup showing tap to unbox feature" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-bold">Tap to Unbox Instagram Story</p>
                    <p className="text-gray-400 text-sm">Tease drops with interactive Stories</p>
                  </div>
                </div>
              </div>
              
              {/* Carousel Item 2 */}
              <div className="min-w-[300px] sm:min-w-[350px] snap-start">
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                    alt="SMS screenshot example showing exclusive drop notification" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-bold">SMS Campaign Example</p>
                    <p className="text-gray-400 text-sm">Drive foot traffic with geo-targeted texts</p>
                  </div>
                </div>
              </div>
              
              {/* Carousel Item 3 */}
              <div className="min-w-[300px] sm:min-w-[350px] snap-start">
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1633422488318-bddc3a8d883a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="AR filter demo showing virtual try-on for clothing" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-bold">AR Filter Demo</p>
                    <p className="text-gray-400 text-sm">Virtual try-ons for new collections</p>
                  </div>
                </div>
              </div>
              
              {/* Carousel Item 4 */}
              <div className="min-w-[300px] sm:min-w-[350px] snap-start">
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80" 
                    alt="Social media content showing sneaker release" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-bold">Social Media Content</p>
                    <p className="text-gray-400 text-sm">Engaging posts that drive anticipation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email/SMS Popup */}
      <div className="fixed bottom-6 right-6 z-40 max-w-sm">
        <div className="bg-black p-6 rounded-lg shadow-lg border border-[#00FFE0] animate-slide-up">
          <div className="flex items-start mb-4">
            <span className="text-2xl mr-2">🔥</span>
            <div>
              <h3 className="font-bold text-white">Get Free SMS Templates for Your Next Drop</h3>
              <p className="text-gray-400 text-sm">Enter your info to receive exclusive templates</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF00FF]"
            />
            <input 
              type="tel" 
              placeholder="Your Phone (for SMS)" 
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF00FF]"
            />
            <button className="w-full py-2 bg-[#FF00FF] text-white font-bold rounded-md hover:bg-[#CC00CC] transition-all duration-300">
              Send Me Templates
            </button>
          </div>
        </div>
      </div>

      {/* Footer CTA Bar */}
      <section className="py-8 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-white text-lg font-bold mb-4 md:mb-0">
              Your next drop could sell out in hours.
            </p>
            <button
              onClick={() => setShowQuoteModal(true)}
              className="px-6 py-3 bg-[#00FFE0] text-black font-bold rounded-lg hover:bg-[#00FFE0]/80 transition-all duration-300"
            >
              Book Strategy Call →
            </button>
          </div>
        </div>
      </section>

      {/* Quote Request Modal */}
      <QuoteRequest 
        isOpen={showQuoteModal} 
        onClose={() => setShowQuoteModal(false)} 
      />

      {/* Custom CSS is handled in index.css */}
    </div>
  );
}
