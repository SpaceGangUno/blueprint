import { Code, Palette, Briefcase, Lightbulb, Layers, Users, LineChart, Rocket } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Project Consulting',
      description: 'Strategic guidance and expert consultation for your digital initiatives. We help transform your ideas into actionable plans.',
      features: [
        'Project scoping and planning',
        'Technical architecture design',
        'Risk assessment and mitigation',
        'Resource optimization'
      ]
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Creative Design',
      description: 'Innovative design solutions that capture your brand\'s essence and create meaningful user experiences.',
      features: [
        'UI/UX design',
        'Brand identity development',
        'Design systems',
        'Interactive prototypes'
      ]
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Tech Integration',
      description: 'Seamless integration of cutting-edge technology to power your digital presence and operations.',
      features: [
        'Custom software development',
        'API integration',
        'Cloud solutions',
        'Legacy system modernization'
      ]
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Digital Innovation',
      description: 'Forward-thinking solutions that keep you ahead in the digital landscape and drive business growth.',
      features: [
        'Digital transformation',
        'Innovation workshops',
        'Emerging tech adoption',
        'Process automation'
      ]
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: 'Platform Development',
      description: 'Building scalable platforms that serve as the foundation for your digital success.',
      features: [
        'Web applications',
        'Mobile apps',
        'E-commerce solutions',
        'Content management systems'
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Augmentation',
      description: 'Enhance your team with our skilled professionals to accelerate project delivery.',
      features: [
        'Technical expertise',
        'Agile development',
        'Quality assurance',
        'DevOps practices'
      ]
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: 'Analytics & Optimization',
      description: 'Data-driven insights and optimization strategies to improve performance and ROI.',
      features: [
        'Performance monitoring',
        'User behavior analysis',
        'Conversion optimization',
        'SEO enhancement'
      ]
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Launch & Growth',
      description: 'Comprehensive support for successful product launches and sustainable growth.',
      features: [
        'Launch strategy',
        'Market penetration',
        'Scaling solutions',
        'Growth optimization'
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

      {/* Services Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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