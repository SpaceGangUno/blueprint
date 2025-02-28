import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import QuoteRequest from '../components/QuoteRequest';
import HypeAuditForm from '../components/HypeAuditForm';

export default function Home() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showHypeAuditForm, setShowHypeAuditForm] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const sections = ["hero", "challenges", "portfolio", "services"];
  
  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - go to next section
      if (activeSection < sections.length - 1) {
        setActiveSection(activeSection + 1);
      }
    }
    
    if (touchEnd - touchStart > 75) {
      // Swipe right - go to previous section
      if (activeSection > 0) {
        setActiveSection(activeSection - 1);
      }
    }
  };
  
  // Navigate to specific section
  const goToSection = (index: number) => {
    setActiveSection(index);
  };
  
  // Navigate to next section
  const nextSection = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1);
    }
  };
  
  // Navigate to previous section
  const prevSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  };
  
  // Scroll to active section when it changes
  useEffect(() => {
    if (carouselRef.current) {
      const sectionElement = document.getElementById(sections[activeSection]);
      if (sectionElement) {
        carouselRef.current.scrollTo({
          left: sectionElement.offsetLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeSection]);

  return (
    <div className="pt-16 h-screen flex flex-col overflow-hidden">
      <Helmet>
        <title>Streetwear Marketing Agency | Launch Events, SMS Campaigns & Hype Content</title>
        <meta 
          name="description" 
          content="Specialized streetwear marketing agency creating digital buzz for physical drops, building hype, and driving foot traffic to your store." 
        />
      </Helmet>
      
      {/* Carousel Navigation */}
      <div className="fixed top-1/2 left-4 z-50 transform -translate-y-1/2 flex flex-col gap-2">
        <button 
          onClick={prevSection}
          className={`p-2 rounded-full bg-black/50 text-white ${activeSection === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
          disabled={activeSection === 0}
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      
      <div className="fixed top-1/2 right-4 z-50 transform -translate-y-1/2 flex flex-col gap-2">
        <button 
          onClick={nextSection}
          className={`p-2 rounded-full bg-black/50 text-white ${activeSection === sections.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
          disabled={activeSection === sections.length - 1}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Section Indicators */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
        {sections.map((section, index) => (
          <button
            key={section}
            onClick={() => goToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index 
                ? 'bg-[#FF6B00] w-6' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to ${section} section`}
          />
        ))}
      </div>
      
      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="flex-1 flex overflow-x-hidden snap-x snap-mandatory"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[500px] w-full flex-shrink-0 snap-start flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover hidden md:block"
          >
            <source src="https://player.vimeo.com/progressive_redirect/playback/735671584/rendition/720p/file.mp4?loc=external&oauth2_token_id=57447761&signature=e7e8d8f2e23f0b3bf04b7c6de6c2a7f8e0c65c9a9c8a0e1a0d6c8e8c8c8c8c8" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <img
              src="/public/images/hornets-hive-mentality.jpg"
              alt="Streetwear fashion showcase with urban backdrop"
              className="w-full h-full object-cover"
            />
          </video>
          {/* Mobile-optimized image instead of video */}
          <img
            src="/public/images/hornets-hive-mentality.jpg"
            alt="Streetwear fashion showcase with urban backdrop"
            className="w-full h-full object-cover md:hidden"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-[#1E0B2C]" />
          
          {/* Urban texture overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-20"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-0">
          <div className="space-y-4 md:space-y-6 max-w-3xl">
            <div className="inline-block px-3 py-1 bg-[#FF6B00]/20 text-[#FF6B00] text-sm font-medium rounded-full mb-2">
              STREETWEAR MARKETING
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Turn Limited Drops into 
              <span className="text-[#FF6B00] ml-2 block md:inline">
                Long Lines
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl">
              We create digital buzz for physical drops, building hype that drives foot traffic to your store.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowHypeAuditForm(true)}
                className="inline-block px-6 py-3 md:px-8 md:py-4 bg-[#FF6B00] text-white font-bold rounded-lg hover:bg-[#E05A00] transition-all duration-300 shadow-lg hover:shadow-[#FF6B00]/20 hover:-translate-y-1"
              >
                Get Your Free Hype Audit
              </button>
              <a 
                href="/portfolio" 
                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-transparent border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                See Our Work
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Grid Section */}
      <section id="challenges" className="py-20 bg-black text-white relative w-full flex-shrink-0 snap-start">
        {/* Urban texture overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-center">Streetwear Stores Struggle With:</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">We'll tell you which pieces to burn 🔥 and which will sell out in 10 minutes.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-8 border-l-4 border-[#00E0FF] hover:shadow-lg hover:shadow-[#00E0FF]/10 transition-all duration-300 hover:-translate-y-2">
              <h3 className="text-xl font-bold mb-4 text-white">1. "Empty Stores"</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start text-sm text-gray-300">
                  <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Slow foot traffic & online sales</span>
                </li>
                <li className="flex items-start text-sm text-gray-300">
                  <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                  <span>New drops go unnoticed (no email/SMS hype)</span>
                </li>
                <li className="flex items-start text-sm text-gray-300">
                  <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Ads that don't convert to customers</span>
                </li>
              </ul>
              <p className="text-gray-300">"We turn quiet stores into sold-out chaos with geo-targeted ads, FOMO SMS campaigns, and much more."</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-8 border-l-4 border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/10 transition-all duration-300 hover:-translate-y-2">
              <h3 className="text-xl font-bold mb-4 text-white">2. "No Hype"</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start text-sm text-gray-300">
                  <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Weak social media presence (no engagement/hype)</span>
                </li>
                <li className="flex items-start text-sm text-gray-300">
                  <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Can't keep up with trends or content creation</span>
                </li>
                <li className="flex items-start text-sm text-gray-300">
                  <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                  <span>No time to post consistently</span>
                </li>
              </ul>
              <p className="text-gray-300">"We'll flood your IG with viral Reels, trend-riding posts, and UGC that makes your brand the talk of the streets."</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-8 border-l-4 border-[#FFEC00] hover:shadow-lg hover:shadow-[#FFEC00]/10 transition-all duration-300 hover:-translate-y-2">
              <h3 className="text-xl font-bold mb-4 text-white">3. "No Loyalty"</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start text-sm text-gray-300">
                  <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Low customer loyalty/repeat buys</span>
                </li>
                <li className="flex items-start text-sm text-gray-300">
                  <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                  <span>No system to reward regulars</span>
                </li>
                <li className="flex items-start text-sm text-gray-300">
                  <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Can't track what's hot vs. deadstock</span>
                </li>
              </ul>
              <p className="text-gray-300">"Build a cult following with loyalty apps, 'Insider Only' drops, and our hype-forecasting audits that tell you what to stock next."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gradient-to-b from-black to-[#1E0B2C] text-white w-full flex-shrink-0 snap-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Featured Projects</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Check out some of our recent work for streetwear brands and retailers</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://i.imgur.com/R2H6i7c.jpeg"
                  alt="Charlotte Hornets 'Hive Mentality' branding with logo and design elements"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#FF6B00] text-white rounded-full text-sm">Event Marketing</span>
                      <span className="px-3 py-1 bg-[#00E0FF] text-black rounded-full text-sm">Social Media</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 relative">
                <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#FF6B00] to-[#00E0FF] group-hover:w-full transition-all duration-500"></div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#FF6B00] transition-colors">
                  Charlotte Hornets "Hive Mentality"
                </h3>
                <p className="text-gray-400 mb-4">Rebranding & Hype Campaign</p>
                <a
                  href="/portfolio"
                  className="inline-flex items-center text-[#00E0FF] hover:text-[#00E0FF]/80 font-medium relative group/link"
                >
                  <span>View Project</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00E0FF] to-[#FF6B00] group-hover/link:w-full transition-all duration-300"></span>
                </a>
              </div>
            </div>
            
            {/* Project 2 */}
            <div className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://i.imgur.com/nFotQHJ.jpeg"
                  alt="Streetwear brand social media campaign"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#FFEC00] text-black rounded-full text-sm">Branding</span>
                      <span className="px-3 py-1 bg-[#FF6B00] text-white rounded-full text-sm">Content</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 relative">
                <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#FFEC00] to-[#FF6B00] group-hover:w-full transition-all duration-500"></div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#FFEC00] transition-colors">
                  Gear Locker 
                </h3>
                <p className="text-gray-400 mb-4">Complete brand refresh (Supreme Hype)</p>
                <a
                  href="/portfolio"
                  className="inline-flex items-center text-[#FFEC00] hover:text-[#FFEC00]/80 font-medium relative group/link"
                >
                  <span>View Project</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FFEC00] to-[#FF6B00] group-hover/link:w-full transition-all duration-300"></span>
                </a>
              </div>
            </div>
            
            {/* Project 3 */}
            <div className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://assets.arpost.co/wp-content/uploads/2022/11/28182239/AR-Fashion-Platform-ZERO10.png"
                  alt="AR mobile app for virtual clothing try-on"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#00E0FF] text-black rounded-full text-sm">Mobile App</span>
                      <span className="px-3 py-1 bg-[#FF6B00] text-white rounded-full text-sm">AR Technology</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 relative">
                <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#00E0FF] to-[#FF6B00] group-hover:w-full transition-all duration-500"></div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#00E0FF] transition-colors">
                  Augmented Reality 
                </h3>
                <p className="text-gray-400 mb-4">4D AR-powered Augmented Reality shirts</p>
                <a
                  href="/portfolio"
                  className="inline-flex items-center text-[#00E0FF] hover:text-[#00E0FF]/80 font-medium relative group/link"
                >
                  <span>View Project</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00E0FF] to-[#FF6B00] group-hover/link:w-full transition-all duration-300"></span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="/portfolio" 
              className="inline-flex items-center px-6 py-3 bg-[#FF6B00] text-white font-bold rounded-lg hover:bg-[#E05A00] transition-all duration-300 hover:-translate-y-1"
            >
              View All Projects
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Services Packages Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-black to-[#1E0B2C] text-white w-full flex-shrink-0 snap-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Pricing Packages</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">No cookie-cutter templates – your brand, your rules. Choose the package that fits your streetwear ambitions.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Package 1: Hype Essentials */}
            <div className="bg-gray-900 rounded-lg p-8 border border-[#00E0FF]/30 hover:border-[#00E0FF] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-[#00E0FF]/20">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-[#00E0FF]/10 text-[#00E0FF] text-sm font-medium rounded-full mb-3">BASIC</span>
                <h3 className="text-2xl font-bold mb-2">Hype Essentials</h3>
                <p className="text-sm text-gray-400 mb-3">Ignite Your Brand, No Fluff.</p>
                <p className="text-xl font-bold text-[#00E0FF]">Starting at $1,500</p>
              </div>
              
              <div className="mb-8">
                <div className="mb-4">
                  <p className="font-semibold text-white mb-2">🎨 Brand Identity Starter Kit:</p>
                  <ul className="space-y-2 pl-5">
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom logo + brand color palette</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Instagram/TikTok profile optimization</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <p className="font-semibold text-white mb-2">📱 Weekly Content & Ads:</p>
                  <ul className="space-y-2 pl-5">
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                      <span>5 Instagram posts + 2 Reels (trend-focused)</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                      <span>1 targeted ad campaign (creative + audience setup)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-semibold text-white mb-2">✉️ Weekly Engagement Blasts:</p>
                  <ul className="space-y-2 pl-5">
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Email & SMS templates for drops/restocks</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Basic analytics (open rates, click-throughs)</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full py-3 bg-transparent border border-[#00E0FF] text-[#00E0FF] font-bold rounded-lg hover:bg-[#00E0FF]/10 transition-all duration-300"
              >
                Spark Your Hype
              </button>
            </div>
            
            {/* Package 2: Hype Suite */}
            <div className="bg-gray-900 rounded-lg p-8 border border-[#FF6B00]/30 hover:border-[#FF6B00] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-[#FF6B00]/20 transform scale-105 z-10">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-[#FF6B00]/10 text-[#FF6B00] text-sm font-medium rounded-full mb-3">ADVANCED</span>
                <h3 className="text-2xl font-bold mb-2">Hype Suite</h3>
                <p className="text-sm text-gray-400 mb-3">From Closet to Cult Following.</p>
                <p className="text-xl font-bold text-[#FF6B00]">Starting at $3,500</p>
              </div>
              
              <div className="mb-8">
                <div className="mb-4">
                  <p className="font-semibold text-white mb-2">✅ Everything in Hype Essentials</p>
                </div>
                
                <div className="mb-4">
                  <p className="font-semibold text-white mb-2">🛠️ Custom Website & Shop Build:</p>
                  <ul className="space-y-2 pl-5">
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Mobile-optimized site (Shopify/Webflow)</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Instagram Shop integration + product listings</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <p className="font-semibold text-white mb-2">📦 Signature Unboxing Experience:</p>
                  <ul className="space-y-2 pl-5">
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom poly mailers, branded shipping supplies</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Mystery box template designs (limited editions)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-semibold text-white mb-2">📈 Smart Ad Strategy:</p>
                  <ul className="space-y-2 pl-5">
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>2 ad campaigns/month with A/B testing</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Retargeting for drop-day FOMO</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full py-3 bg-[#FF6B00] text-white font-bold rounded-lg hover:bg-[#E05A00] transition-all duration-300"
              >
                Fuel the Frenzy
              </button>
            </div>
            
            {/* Package 3: Empire Builder */}
            <div className="bg-gray-900 rounded-lg p-8 border border-[#FFEC00]/30 hover:border-[#FFEC00] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-[#FFEC00]/20">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-[#FFEC00]/10 text-[#FFEC00] text-sm font-medium rounded-full mb-3">ENTERPRISE</span>
                <h3 className="text-2xl font-bold mb-2">Empire Builder</h3>
                <p className="text-sm text-gray-400 mb-3">Streetwear Domination, Full Throttle.</p>
                <p className="text-xl font-bold text-[#FFEC00]">Starting at $7,500</p>
              </div>
              
              <div className="mb-8">
                <div className="mb-4">
                  <p className="font-semibold text-white mb-2">✅ Everything in Hype Suite</p>
                </div>
                
                <div className="mb-4">
                  <p className="font-semibold text-white mb-2">💎 VIP Loyalty Ecosystem:</p>
                  <ul className="space-y-2 pl-5">
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Tiered rewards program (points, early access)</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom "member-only" drop system</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <p className="font-semibold text-white mb-2">🏷️ Private Label Production:</p>
                  <ul className="space-y-2 pl-5">
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Design-to-sourcing for 1 product line</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <p className="font-semibold text-white mb-2">🎥 Premium Content Engine:</p>
                  <ul className="space-y-2 pl-5">
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>15 posts/month + 3 viral Reels</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>3 ad campaigns with influencer collabs</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-semibold text-white mb-2">🔥 Hype Forecasting:</p>
                  <ul className="space-y-2 pl-5">
                    <li className="flex items-start text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Monthly trend reports + competitor breakdowns</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full py-3 bg-transparent border border-[#FFEC00] text-[#FFEC00] font-bold rounded-lg hover:bg-[#FFEC00]/10 transition-all duration-300"
              >
                Command the Culture
              </button>
            </div>
          </div>
        </div>
      </section>

      </div> {/* End of Carousel Container */}
      
      {showQuoteModal && (
        <QuoteRequest isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} />
      )}

      {showHypeAuditForm && (
        <HypeAuditForm isOpen={showHypeAuditForm} onClose={() => setShowHypeAuditForm(false)} />
      )}
    </div>
  );
}
