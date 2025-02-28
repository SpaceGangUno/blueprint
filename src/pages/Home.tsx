import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import QuoteRequest from '../components/QuoteRequest';
import HypeAuditForm from '../components/HypeAuditForm';

export default function Home() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showHypeAuditForm, setShowHypeAuditForm] = useState(false);

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
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-[#1E0B2C]" />
          
          {/* Urban texture overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-10"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              Turn Limited Drops into 
              <span className="text-[#FF6B00] ml-2 sm:ml-4 block sm:inline">
                Long Lines
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed">
              Streetwear marketing that fuels FOMO, community, and in-store hype.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setShowHypeAuditForm(true)}
                className="inline-block px-8 py-4 bg-[#FF6B00] text-white font-bold rounded-lg hover:bg-[#E05A00] transition-all duration-300 shadow-lg hover:shadow-[#FF6B00]/20 hover:-translate-y-1"
              >
                Get Your Free Hype Audit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Grid Section */}
      <section className="py-20 bg-black text-white relative">
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
      <section className="py-20 bg-gradient-to-b from-black to-[#1E0B2C] text-white">
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
      <section className="py-20 bg-gradient-to-b from-black to-[#1E0B2C] text-white">
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

      {showQuoteModal && (
        <QuoteRequest isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} />
      )}

      {showHypeAuditForm && (
        <HypeAuditForm isOpen={showHypeAuditForm} onClose={() => setShowHypeAuditForm(false)} />
      )}
    </div>
  );
}
