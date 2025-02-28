import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import QuoteRequest from '../components/QuoteRequest';
import HypeAuditForm from '../components/HypeAuditForm';

export default function Home() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showHypeAuditForm, setShowHypeAuditForm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Carousel state for each section
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  
  // Refs for each carousel
  const challengesCarouselRef = useRef<HTMLDivElement>(null);
  const portfolioCarouselRef = useRef<HTMLDivElement>(null);
  const servicesCarouselRef = useRef<HTMLDivElement>(null);
  
  // Touch event handlers for challenges carousel
  const handleChallengeSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && activeChallengeIndex < 2) {
      setActiveChallengeIndex(activeChallengeIndex + 1);
    } else if (direction === 'right' && activeChallengeIndex > 0) {
      setActiveChallengeIndex(activeChallengeIndex - 1);
    }
  };
  
  // Touch event handlers for portfolio carousel
  const handlePortfolioSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && activePortfolioIndex < 2) {
      setActivePortfolioIndex(activePortfolioIndex + 1);
    } else if (direction === 'right' && activePortfolioIndex > 0) {
      setActivePortfolioIndex(activePortfolioIndex - 1);
    }
  };
  
  // Touch event handlers for services carousel
  const handleServiceSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && activeServiceIndex < 2) {
      setActiveServiceIndex(activeServiceIndex + 1);
    } else if (direction === 'right' && activeServiceIndex > 0) {
      setActiveServiceIndex(activeServiceIndex - 1);
    }
  };
  
  // Generic touch event handlers
  const handleTouchStart = useRef<number>(0);
  const handleTouchMove = useRef<number>(0);
  
  const onTouchStart = (e: React.TouchEvent) => {
    handleTouchStart.current = e.targetTouches[0].clientX;
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    handleTouchMove.current = e.targetTouches[0].clientX;
  };
  
  const onTouchEnd = (carouselType: 'challenges' | 'portfolio' | 'services') => {
    const touchStart = handleTouchStart.current;
    const touchEnd = handleTouchMove.current;
    
    if (touchStart - touchEnd > 75) {
      // Swipe left
      if (carouselType === 'challenges') {
        handleChallengeSwipe('left');
      } else if (carouselType === 'portfolio') {
        handlePortfolioSwipe('left');
      } else if (carouselType === 'services') {
        handleServiceSwipe('left');
      }
    }
    
    if (touchEnd - touchStart > 75) {
      // Swipe right
      if (carouselType === 'challenges') {
        handleChallengeSwipe('right');
      } else if (carouselType === 'portfolio') {
        handlePortfolioSwipe('right');
      } else if (carouselType === 'services') {
        handleServiceSwipe('right');
      }
    }
  };
  
  // Scroll to active item when it changes
  useEffect(() => {
    if (challengesCarouselRef.current) {
      const scrollAmount = activeChallengeIndex * challengesCarouselRef.current.offsetWidth;
      challengesCarouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [activeChallengeIndex]);
  
  useEffect(() => {
    if (portfolioCarouselRef.current) {
      const scrollAmount = activePortfolioIndex * portfolioCarouselRef.current.offsetWidth;
      portfolioCarouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [activePortfolioIndex]);
  
  useEffect(() => {
    if (servicesCarouselRef.current) {
      const scrollAmount = activeServiceIndex * servicesCarouselRef.current.offsetWidth;
      servicesCarouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [activeServiceIndex]);

  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollElements = document.querySelectorAll('.scroll-animate');
      
      scrollElements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.85) {
          element.classList.add('animate-in');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pt-16 overflow-x-hidden">
      <Helmet>
        <title>Streetwear Marketing Agency | Launch Events, SMS Campaigns & Hype Content</title>
        <meta 
          name="description" 
          content="Specialized streetwear marketing agency creating digital buzz for physical drops, building hype, and driving foot traffic to your store." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#1E0B2C" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] sm:min-h-[500px] md:h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover hidden md:block"
            poster="/public/images/hornets-hive-mentality.jpg"
          >
            <source src="https://player.vimeo.com/progressive_redirect/playback/735671584/rendition/720p/file.mp4?loc=external&oauth2_token_id=57447761&signature=e7e8d8f2e23f0b3bf04b7c6de6c2a7f8e0c65c9a9c8a0e1a0d6c8e8c8c8c8c8" type="video/mp4" />
          </video>
          {/* Mobile-optimized image instead of video */}
          <img
            src="/public/images/hornets-hive-mentality.jpg"
            alt="Streetwear fashion showcase with urban backdrop"
            className="w-full h-full object-cover md:hidden"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-[#1E0B2C]" />
          
          {/* Futuristic grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiPjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDBoMHY0MCIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
          
          {/* Animated gradient accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B00] via-[#00E0FF] to-[#FFEC00] opacity-80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-0">
          <div className="space-y-5 md:space-y-6 max-w-3xl scroll-animate fade-up">
            <div className="inline-flex items-center px-3 py-1 bg-[#FF6B00]/20 text-[#FF6B00] text-sm font-medium rounded-full mb-2 backdrop-blur-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FF6B00] mr-2 animate-pulse"></span>
              STREETWEAR MARKETING
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Turn Limited Drops into 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FFEC00] ml-2 block md:inline">
                Long Lines
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl">
              We create digital buzz for physical drops, building hype that drives foot traffic to your store.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowHypeAuditForm(true)}
                className="inline-block px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#FF6B00] to-[#E05A00] text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#FF6B00]/30 hover:-translate-y-1 active:translate-y-0 transform-gpu"
              >
                Get Your Free Hype Audit
              </button>
              <a 
                href="/portfolio" 
                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-transparent border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                See Our Work
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Grid Section */}
      <section className="py-16 sm:py-20 bg-black text-white relative">
        {/* Futuristic grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiPjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDBoMHY0MCIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="scroll-animate fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-300">Streetwear Stores Struggle With:</h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">We'll tell you which pieces to burn 🔥 and which will sell out in 10 minutes.</p>
          </div>
          
          {/* Challenges Carousel Navigation */}
          <div className="flex justify-between items-center mb-6 px-2">
            <button 
              onClick={() => handleChallengeSwipe('right')}
              className={`p-2 rounded-full bg-black/50 text-white backdrop-blur-sm ${activeChallengeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
              disabled={activeChallengeIndex === 0}
              aria-label="Previous challenge"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex gap-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={`challenge-${index}`}
                  onClick={() => setActiveChallengeIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeChallengeIndex === index 
                      ? 'bg-[#FF6B00] w-6' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to challenge ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={() => handleChallengeSwipe('left')}
              className={`p-2 rounded-full bg-black/50 text-white backdrop-blur-sm ${activeChallengeIndex === 2 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
              disabled={activeChallengeIndex === 2}
              aria-label="Next challenge"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Challenges Carousel */}
          <div 
            ref={challengesCarouselRef}
            className="overflow-x-hidden scroll-animate fade-up"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={() => onTouchEnd('challenges')}
          >
            <div className="flex transition-transform duration-500 ease-out" style={{ width: '300%', transform: `translateX(-${activeChallengeIndex * 33.333}%)` }}>
              {/* Challenge 1 */}
              <div className="w-full flex-shrink-0 px-4">
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 border-l-4 border-[#00E0FF] hover:shadow-lg hover:shadow-[#00E0FF]/20 transition-all duration-300 hover:-translate-y-2 transform-gpu">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#00E0FF]/20 flex items-center justify-center mr-3">
                      <span className="text-[#00E0FF] font-bold">01</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">"Empty Stores"</h3>
                  </div>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start text-sm sm:text-base text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Slow foot traffic & online sales</span>
                    </li>
                    <li className="flex items-start text-sm sm:text-base text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                      <span>New drops go unnoticed (no email/SMS hype)</span>
                    </li>
                    <li className="flex items-start text-sm sm:text-base text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#00E0FF] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Ads that don't convert to customers</span>
                    </li>
                  </ul>
                  <p className="text-gray-300 border-t border-gray-800 pt-4 italic">"We turn quiet stores into sold-out chaos with geo-targeted ads, FOMO SMS campaigns, and much more."</p>
                </div>
              </div>
              
              {/* Challenge 2 */}
              <div className="w-full flex-shrink-0 px-4">
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 border-l-4 border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/20 transition-all duration-300 hover:-translate-y-2 transform-gpu">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mr-3">
                      <span className="text-[#FF6B00] font-bold">02</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">"No Hype"</h3>
                  </div>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start text-sm sm:text-base text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Weak social media presence (no engagement/hype)</span>
                    </li>
                    <li className="flex items-start text-sm sm:text-base text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Can't keep up with trends or content creation</span>
                    </li>
                    <li className="flex items-start text-sm sm:text-base text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>No time to post consistently</span>
                    </li>
                  </ul>
                  <p className="text-gray-300 border-t border-gray-800 pt-4 italic">"We'll flood your IG with viral Reels, trend-riding posts, and UGC that makes your brand the talk of the streets."</p>
                </div>
              </div>
              
              {/* Challenge 3 */}
              <div className="w-full flex-shrink-0 px-4">
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 border-l-4 border-[#FFEC00] hover:shadow-lg hover:shadow-[#FFEC00]/20 transition-all duration-300 hover:-translate-y-2 transform-gpu">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FFEC00]/20 flex items-center justify-center mr-3">
                      <span className="text-[#FFEC00] font-bold">03</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">"No Loyalty"</h3>
                  </div>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start text-sm sm:text-base text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Low customer loyalty/repeat buys</span>
                    </li>
                    <li className="flex items-start text-sm sm:text-base text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>No system to reward regulars</span>
                    </li>
                    <li className="flex items-start text-sm sm:text-base text-gray-300">
                      <ArrowRight className="w-4 h-4 text-[#FFEC00] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Can't track what's hot vs. deadstock</span>
                    </li>
                  </ul>
                  <p className="text-gray-300 border-t border-gray-800 pt-4 italic">"Build a cult following with loyalty apps, 'Insider Only' drops, and our hype-forecasting audits that tell you what to stock next."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-black to-[#1E0B2C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-animate fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-300">Featured Projects</h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Check out some of our recent work for streetwear brands and retailers</p>
          </div>
          
          {/* Portfolio Carousel Navigation */}
          <div className="flex justify-between items-center mb-6 px-2">
            <button 
              onClick={() => handlePortfolioSwipe('right')}
              className={`p-2 rounded-full bg-black/50 text-white backdrop-blur-sm ${activePortfolioIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
              disabled={activePortfolioIndex === 0}
              aria-label="Previous project"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex gap-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={`portfolio-${index}`}
                  onClick={() => setActivePortfolioIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activePortfolioIndex === index 
                      ? 'bg-[#FF6B00] w-6' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={() => handlePortfolioSwipe('left')}
              className={`p-2 rounded-full bg-black/50 text-white backdrop-blur-sm ${activePortfolioIndex === 2 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
              disabled={activePortfolioIndex === 2}
              aria-label="Next project"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Portfolio Carousel */}
          <div 
            ref={portfolioCarouselRef}
            className="overflow-x-hidden scroll-animate fade-up"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={() => onTouchEnd('portfolio')}
          >
            <div className="flex transition-transform duration-500 ease-out" style={{ width: '300%', transform: `translateX(-${activePortfolioIndex * 33.333}%)` }}>
              {/* Project 1 */}
              <div className="w-full flex-shrink-0 px-4">
                <div className="group bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform-gpu">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src="https://i.imgur.com/R2H6i7c.jpeg"
                      alt="Charlotte Hornets 'Hive Mentality' branding with logo and design elements"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
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
              </div>
              
              {/* Project 2 */}
              <div className="w-full flex-shrink-0 px-4">
                <div className="group bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform-gpu">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src="https://i.imgur.com/nFotQHJ.jpeg"
                      alt="Streetwear brand social media campaign"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
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
                      Streetwear Brand Campaign
                    </h3>
                    <p className="text-gray-400
