import { PenTool, Megaphone, Globe, Package2, Lightbulb } from 'lucide-react';

export default function Services() {
  // Service categories
  const serviceCategories = [
    {
      id: 'branding',
      title: 'Branding That Stands Out',
      description: 'Create a memorable look and voice that customers love.',
      icon: <PenTool className="w-8 h-8" />,
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {serviceCategories.map((category) => (
            <div key={category.id} id={category.id} className="mb-20">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                  <p className="text-gray-600 mt-1">{category.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {category.services.map((service, serviceIndex) => (
                  <div
                    key={`${category.id}-${serviceIndex}`}
                    className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-gray-700">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Let's discuss how our services can help you achieve your digital goals
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Schedule a Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
