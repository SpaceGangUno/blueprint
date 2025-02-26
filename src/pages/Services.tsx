import { useState } from 'react';
import { PenTool, Megaphone, Globe, Package2, Lightbulb, ArrowRight, Plus, Minus, Sparkles, Zap } from 'lucide-react';

export default function Services() {
  const [expandedService, setExpandedService] = useState<{category: string, service: number} | null>(null);

  // Function to toggle expanded service
  const toggleService = (categoryId: string, serviceIndex: number) => {
    if (expandedService?.category === categoryId && expandedService?.service === serviceIndex) {
      setExpandedService(null);
    } else {
      setExpandedService({ category: categoryId, service: serviceIndex });
    }
  };
  // Service categories
  const serviceCategories = [
    {
      id: 'branding',
      title: 'Branding That Stands Out',
      description: 'Create a memorable look and voice that customers love.',
      icon: <PenTool className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Logo & Visual Identity',
          description: 'Design or refresh your logo, colors, and style to look professional instantly.',
          features: [
            'Simple updates to your current branding',
            'Full brand kits for new businesses'
          ]
        },
        {
          title: 'Brand Personality',
          description: 'Define your vibe (fun, trustworthy, bold) so customers connect with you.',
          features: [
            'Help with taglines, social media voice, or packaging design'
          ]
        }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing That Works',
      description: 'Get new customers and keep them coming back.',
      icon: <Megaphone className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Hype Campaigns',
          description: 'Launch products/services with excitement.',
          features: [
            'Social media teasers',
            'Email announcements',
            'Limited-time discounts'
          ]
        },
        {
          title: 'Loyalty Programs',
          description: 'Reward repeat customers.',
          features: [
            'Refer-a-friend discounts',
            'VIP perks or points systems'
          ]
        },
        {
          title: 'Simple Ads',
          description: 'Run Facebook/Google ads that actually sell.',
          features: [
            'No confusing jargon—we set them up for you',
            'Track what\'s working'
          ]
        }
      ]
    },
    {
      id: 'digital',
      title: 'Digital Tools & Apps',
      description: 'Build easy-to-use websites, apps, and tools.',
      icon: <Globe className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Custom Websites',
          description: 'Mobile-friendly sites that let customers find, trust, and buy from you.',
          features: [
            'Edit text/images yourself',
            'Built-in booking/contact forms'
          ]
        },
        {
          title: 'Business Apps',
          description: 'Save time with tools like appointment reminders or loyalty apps.',
          features: [
            'Affordable monthly plans'
          ]
        },
        {
          title: 'Online Stores',
          description: 'Sell products/services securely.',
          features: [
            'Connect to social media or local pickup'
          ]
        }
      ]
    },
    {
      id: 'products',
      title: 'Products & Spaces',
      description: 'Create physical products or eye-catching spaces.',
      icon: <Package2 className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Product Design',
          description: 'Turn your idea into a real product.',
          features: [
            'Work with local manufacturers',
            'Eco-friendly options'
          ]
        },
        {
          title: 'Storefronts & Events',
          description: 'Design pop-up shops or booths that attract customers.',
          features: [
            'Budget-friendly setups'
          ]
        }
      ]
    },
    {
      id: 'guidance',
      title: 'Guidance & Planning',
      description: 'Get clear advice to make smart decisions.',
      icon: <Lightbulb className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
      services: [
        {
          title: 'Tech Roadmaps',
          description: 'Choose the right tools without overspending.',
          features: [
            'No confusing tech talk'
          ]
        },
        {
          title: 'Website Checkups',
          description: 'Fix issues that might turn customers away.',
          features: [
            'Make your site faster and phone-friendly'
          ]
        }
      ]
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-blue-600 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive digital solutions tailored to transform your business and drive innovation
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-400/10 animate-float"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 15}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-yellow-400 mr-2 animate-pulse" />
              <h2 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Our Services
              </h2>
              <Sparkles className="w-8 h-8 text-yellow-400 ml-2 animate-pulse" />
            </div>
            <div className="w-24 h-2 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Comprehensive digital solutions tailored to transform your business and drive innovation
            </p>
          </div>
          {serviceCategories.map((category) => (
            <div key={category.id} id={category.id} className="mb-20">
              <div className="lg:flex gap-8 items-center mb-12">
                {/* Category Image with Animation */}
                <div className="lg:w-2/5 mb-8 lg:mb-0">
                  <div className="relative rounded-xl overflow-hidden shadow-xl h-64 lg:h-96 transform transition-all duration-700 hover:scale-[1.02] group">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0 absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm">
                      {category.icon}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-500">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-y-[-5px]">
                        {category.title}
                      </h3>
                      <p className="text-gray-200 group-hover:translate-y-[-5px] transition-all duration-500 delay-100">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category Services */}
                <div className="lg:w-3/5">
                  <div className="space-y-6">
                    {category.services.map((service, serviceIndex) => (
                      <div 
                        key={`${category.id}-${serviceIndex}`}
                        className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 
                          border-l-4 border-blue-500 overflow-hidden
                          ${expandedService?.category === category.id && expandedService?.service === serviceIndex ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                          transform hover:-translate-y-1`}
                      >
                        <div 
                          className="p-6 cursor-pointer"
                          onClick={() => toggleService(category.id, serviceIndex)}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="text-xl font-semibold text-gray-900">{service.title}</h4>
                            <button className="text-blue-500 hover:text-blue-700 transition-colors">
                              {expandedService?.category === category.id && expandedService?.service === serviceIndex ? 
                                <Minus className="w-5 h-5" /> : 
                                <Plus className="w-5 h-5" />
                              }
                            </button>
                          </div>
                          <p className="text-gray-600 mt-2">{service.description}</p>
                        </div>
                        
                        {/* Expandable Features */}
                        <div 
                          className={`px-6 transition-all duration-500 ease-in-out overflow-hidden
                            ${expandedService?.category === category.id && expandedService?.service === serviceIndex ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                          <ul className="space-y-3 border-t border-gray-100 pt-4">
                            {service.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <ArrowRight className="w-4 h-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center mt-10">
                      <a 
                        href="/contact" 
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg 
                          hover:from-blue-700 hover:to-blue-800 transition-all duration-300 
                          shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Schedule a Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
