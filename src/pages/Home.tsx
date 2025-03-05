import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowRight, ChevronLeft, ChevronRight, Store, TrendingUp, Users, 
  CheckCircle, AlertCircle, Sparkles, Flame, Crown, Palette, 
  MessageSquare, BarChart3, ShoppingBag, Package, Award, Smartphone, 
  Search, Calendar, Box, Plus
} from 'lucide-react';
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
      
      {/* Services Packages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services Packages</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the perfect package to elevate your brand and dominate the market
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Package 1: Hype Essentials */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 flex flex-col">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-full mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Hype Essentials</h3>
                <p className="text-blue-600 font-medium italic mt-1">"Spark Your Hype"</p>
              </div>
              
              <div className="p-6 flex-grow">
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-start mb-2">
                      <Palette className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-gray-800">Brand Identity Starter Kit</span>
                    </div>
                    <ul className="pl-7 space-y-1 text-gray-600 text-sm">
                      <li>Custom logo + brand color palette</li>
                      <li>Instagram/TikTok profile optimization</li>
                    </ul>
                  </li>
                  
                  <li>
                    <div className="flex items-start mb-2">
                      <MessageSquare className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-gray-800">Weekly Content & Ads</span>
                    </div>
                    <ul className="pl-7 space-y-1 text-gray-600 text-sm">
                      <li>5 Instagram posts + 2 Reels (trend-focused)</li>
                      <li>1 targeted ad campaign (creative + audience setup)</li>
                    </ul>
                  </li>
                  
                  <li>
                    <div className="flex items-start mb-2">
                      <BarChart3 className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-gray-800">Weekly Engagement Blasts</span>
                    </div>
                    <ul className="pl-7 space-y-1 text-gray-600 text-sm">
                      <li>Email & SMS templates for drops/restocks</li>
                      <li>Basic analytics (open rates, click-throughs)</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 bg-gray-50">
                <button className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
                  Spark Your Hype
                </button>
              </div>
            </div>
            
            {/* Package 2: Supreme Hype */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-blue-500 flex flex-col relative z-10 transform md:scale-105">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold">
                POPULAR
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-white rounded-full mb-4">
                  <Flame className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Supreme Hype</h3>
                <p className="text-blue-100 font-medium italic mt-1">"Fuel the Frenzy"</p>
              </div>
              
              <div className="p-6 flex-grow">
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center text-blue-500 font-medium">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Everything in Hype Essentials
                  </div>
                </div>
                
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-start mb-2">
                      <ShoppingBag className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-gray-800">Custom Website & Shop Build</span>
                    </div>
                    <ul className="pl-7 space-y-1 text-gray-600 text-sm">
                      <li>Mobile-optimized site (Shopify/Webflow)</li>
                      <li>Instagram Shop integration + product listings</li>
                    </ul>
                  </li>
                  
                  <li>
                    <div className="flex items-start mb-2">
                      <Package className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-gray-800">Signature Unboxing Experience</span>
                    </div>
                    <ul className="pl-7 space-y-1 text-gray-600 text-sm">
                      <li>Custom poly mailers, branded shipping supplies</li>
                      <li>Mystery box template designs (limited editions)</li>
                    </ul>
                  </li>
                  
                  <li>
                    <div className="flex items-start mb-2">
                      <BarChart3 className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-gray-800">Smart Ad Strategy</span>
                    </div>
                    <ul className="pl-7 space-y-1 text-gray-600 text-sm">
                      <li>2 ad campaigns/month with A/B testing</li>
                      <li>Retargeting for drop-day FOMO</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 bg-gray-50">
                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md">
                  Fuel the Frenzy
                </button>
              </div>
            </div>
            
            {/* Package 3: Hype Dynasty */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 flex flex-col">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-white rounded-full mb-4">
                  <Crown className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Hype Dynasty</h3>
                <p className="text-blue-100 font-medium italic mt-1">"Streetwear Domination, Full Throttle"</p>
              </div>
              
              <div className="p-6 flex-grow">
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center text-blue-500 font-medium">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Everything in Supreme Hype
                  </div>
                </div>
                
                <ul className="space-y-4">
                  <li>
                    <div className="flex items-start mb-2">
                      <Award className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-gray-800">VIP Loyalty Ecosystem</span>
                    </div>
                    <ul className="pl-7 space-y-1 text-gray-600 text-sm">
                      <li>Tiered rewards program (points, early access)</li>
                      <li>Custom "member-only" drop system</li>
                    </ul>
                  </li>
                  
                  <li>
                    <div className="flex items-start mb-2">
                      <ShoppingBag className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-gray-800">Private Label Production</span>
                    </div>
                    <ul className="pl-7 space-y-1 text-gray-600 text-sm">
                      <li>Design-to-sourcing for 1 product line</li>
                    </ul>
                  </li>
                  
                  <li>
                    <div className="flex items-start mb-2">
                      <MessageSquare className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-gray-800">Premium Content Engine</span>
                    </div>
                    <ul className="pl-7 space-y-1 text-gray-600 text-sm">
                      <li>15 posts/month + 3 viral Reels</li>
                      <li>3 ad campaigns with influencer collabs</li>
                    </ul>
                  </li>
                  
                  <li>
                    <div className="flex items-start mb-2">
                      <BarChart3 className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-gray-800">Hype Forecasting</span>
                    </div>
                    <ul className="pl-7 space-y-1 text-gray-600 text-sm">
                      <li>Monthly trend reports + competitor breakdowns</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 bg-gray-50">
                <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-colors">
                  Command the Culture
                </button>
              </div>
            </div>
          </div>
          
          {/* Add-Ons Section */}
          <div className="mt-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Tailor Your Hype</h3>
              <p className="text-gray-600">Customize your package with these powerful add-ons</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Custom App Development</h4>
                </div>
                <p className="text-gray-600 text-sm">Loyalty apps, drop alert systems</p>
                <div className="mt-4 flex justify-end">
                  <button className="flex items-center text-blue-600 font-medium text-sm">
                    <Plus className="w-4 h-4 mr-1" /> Add to Package
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Inventory Audit</h4>
                </div>
                <p className="text-gray-600 text-sm">Product line critique + buy/drop list</p>
                <div className="mt-4 flex justify-end">
                  <button className="flex items-center text-blue-600 font-medium text-sm">
                    <Plus className="w-4 h-4 mr-1" /> Add to Package
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Hype Calendar</h4>
                </div>
                <p className="text-gray-600 text-sm">Seasonal drop planning + event promo</p>
                <div className="mt-4 flex justify-end">
                  <button className="flex items-center text-blue-600 font-medium text-sm">
                    <Plus className="w-4 h-4 mr-1" /> Add to Package
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Box className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Full Packaging Suite</h4>
                </div>
                <p className="text-gray-600 text-sm">Tissue paper, sticker sheets, thank-you cards</p>
                <div className="mt-4 flex justify-end">
                  <button className="flex items-center text-blue-600 font-medium text-sm">
                    <Plus className="w-4 h-4 mr-1" /> Add to Package
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Key Messaging */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
            <p className="text-xl font-bold text-gray-800 mb-4">
              No cookie-cutter templates – your brand, your rules.
            </p>
            <p className="text-lg text-blue-700 font-medium mb-4">
              Your next drop could break the internet. Let's plan it.
            </p>
            <p className="text-lg italic">
              We'll tell you which pieces to burn 🔥 and which will sell out in 10 minutes.
            </p>
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
