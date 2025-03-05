import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronLeft, ChevronRight, Store, TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';
import QuoteRequest from '../components/QuoteRequest';
import HypeAuditForm from '../components/HypeAuditForm';
import HeroSection from '../components/portfolio/HeroSection';

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
    <div className="overflow-x-hidden">
      <Helmet>
        <title>Blueprint - Digital Marketing & Web Development</title>
        <meta name="description" content="Blueprint helps businesses grow through strategic digital marketing and web development solutions." />
      </Helmet>
      
      {/* Hero Banner */}
      <HeroSection 
        title="Transform Your Digital Presence"
        subtitle="Strategic marketing solutions and custom web development to help your business thrive in the digital landscape"
        image="/images/hornets-hive-mentality.jpg"
        imageAlt="Blueprint Digital Marketing and Web Development"
      />
      
      {/* Pain Points Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Challenges We Solve</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              We transform these everyday business struggles into opportunities for growth and success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pain Point 1: Empty Stores */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 scroll-animate">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                  <Store className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Empty Stores</h3>
                <ul className="mb-4 space-y-2">
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Slow foot traffic & online sales</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">New drops go unnoticed (no email/SMS hype)</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Ads that don't convert to customers</span>
                  </li>
                </ul>
                
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                  <p className="text-blue-700 font-medium">
                    "We turn quiet stores into sold-out chaos with geo-targeted ads, FOMO SMS campaigns, and much more."
                  </p>
                </div>
                
                {/* No visual element here */}
              </div>
            </div>
            
            {/* Pain Point 2: No Hype */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 scroll-animate">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No Hype</h3>
                <ul className="mb-4 space-y-2">
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Weak social media presence (no engagement/hype)</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Can't keep up with trends or content creation</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">No time to post consistently</span>
                  </li>
                </ul>
                
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                  <p className="text-blue-700 font-medium">
                    "We'll flood your IG with Reels, trend-riding posts, and UGC that makes your brand the talk of the streets."
                  </p>
                </div>
                
                {/* No visual element here */}
              </div>
            </div>
            
            {/* Pain Point 3: No Loyalty */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 scroll-animate">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No Loyalty</h3>
                <ul className="mb-4 space-y-2">
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Low customer loyalty/repeat buys</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">No system to reward regulars</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Can't track what's hot vs. deadstock</span>
                  </li>
                </ul>
                
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                  <p className="text-blue-700 font-medium">
                    "Build a cult following with loyalty/reward system, 'Insider Only' drops, and our hype-forecasting audits that tell you what to stock next."
                  </p>
                </div>
                
                {/* No visual element here */}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Challenges Carousel */}
      <div className="flex transition-transform duration-500 ease-out" style={{ width: '300%', transform: `translateX(-${activeChallengeIndex * 33.333}%)` }}></div>
      
      {/* Portfolio Carousel */}
      <div className="flex transition-transform duration-500 ease-out" style={{ width: '300%', transform: `translateX(-${activePortfolioIndex * 33.333}%)` }}></div>
      
      {showQuoteModal && <QuoteRequest isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} />}
      {showHypeAuditForm && <HypeAuditForm isOpen={showHypeAuditForm} onClose={() => setShowHypeAuditForm(false)} />}
    </div>
  );
}
