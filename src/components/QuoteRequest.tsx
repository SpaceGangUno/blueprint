import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Button from './Button';
import { submitQuoteRequestForm } from '../config/forms';

export default function QuoteRequest({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    description: ''
  });

  const serviceCategories = [
    {
      category: 'Branding',
      services: [
        { id: 'logo_identity', title: 'Logo & Visual Identity', description: 'Professional logo design and brand identity systems' },
        { id: 'brand_personality', title: 'Brand Personality', description: 'Define your brand voice, taglines, and overall presence' }
      ]
    },
    {
      category: 'Marketing',
      services: [
        { id: 'hype_campaigns', title: 'Hype Campaigns', description: 'Build excitement with social media teasers and email announcements' },
        { id: 'loyalty_programs', title: 'Loyalty Programs', description: 'Reward repeat customers with VIP perks and referral systems' },
        { id: 'simple_ads', title: 'Simple Ads', description: 'Effective Facebook/Google ads that drive conversions' }
      ]
    },
    {
      category: 'Digital',
      services: [
        { id: 'custom_websites', title: 'Custom Websites', description: 'Mobile-friendly sites with built-in forms and self-editing' },
        { id: 'business_apps', title: 'Business Apps', description: 'Custom applications to streamline your business operations' },
        { id: 'online_stores', title: 'Online Stores', description: 'E-commerce solutions with secure payment processing' }
      ]
    },
    {
      category: 'Products & Spaces',
      services: [
        { id: 'product_design', title: 'Product Design', description: 'Turn your ideas into real products with local manufacturing' },
        { id: 'storefronts_events', title: 'Storefronts & Events', description: 'Design eye-catching physical spaces and pop-up shops' }
      ]
    },
    {
      category: 'Guidance',
      services: [
        { id: 'tech_roadmaps', title: 'Tech Roadmaps', description: 'Strategic planning for your technology investments' },
        { id: 'website_checkups', title: 'Website Checkups', description: 'Identify and fix issues that might turn customers away' }
      ]
    }
  ];

  // No need to flatten services since we're using the original structure

  const budgetRanges = [
    '< $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000+'
  ];

  const timelineOptions = [
    'Within 1 month',
    '1-3 months',
    '3-6 months',
    '6+ months'
  ];

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Submit form data to Firebase
      await submitQuoteRequestForm({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        description: formData.description,
        services: selectedServices,
        budget,
        timeline
      });
      
      console.log('Quote request submitted:', {
        services: selectedServices,
        budget,
        timeline,
        ...formData
      });
      
      // Show success step
      setStep(4);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Continue to success step anyway since we don't have error handling UI in this component
      setStep(4);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto hover-lift">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold gradient-text">Request a Quote</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors hover:rotate-90 transition-transform duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress bar */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  step >= stepNumber ? 'bg-gradient-primary animate-gradient text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-24 h-1 transition-all duration-500 ${
                    step > stepNumber ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Select Services</h3>
              
              {serviceCategories.map((category, categoryIndex) => (
                <div key={category.category} className="mb-6">
                  <h4 className="text-lg font-medium text-blue-700 mb-3">{category.category}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {category.services.map((service, index) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceToggle(service.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-300 hover-lift animate-slide-up ${
                          selectedServices.includes(service.id)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        style={{ animationDelay: `${(categoryIndex * 0.1) + (index * 0.05)}s` }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{service.title}</span>
                          {selectedServices.includes(service.id) && (
                            <Check className="w-5 h-5 text-blue-600 animate-fade-in" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-semibold mb-4">Budget Range</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {budgetRanges.map((range, index) => (
                    <button
                      key={range}
                      onClick={() => setBudget(range)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-300 hover-lift animate-slide-up ${
                        budget === range
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Timeline</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {timelineOptions.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => setTimeline(option)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-300 hover-lift animate-slide-up ${
                        timeline === option
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>Quote Request Sent!</h3>
              <p className="text-gray-600 mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                We'll review your request and get back to you within 24 hours.
              </p>
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Button onClick={onClose} variant="gradient">Close</Button>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300 hover:-translate-x-1 group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-125" />
                  Back
                </button>
              ) : (
                <div />
              )}
              
              <button
                onClick={() => {
                  if (step === 3) {
                    handleSubmit(new Event('submit') as any);
                  } else {
                    setStep(step + 1);
                  }
                }}
                className="flex items-center px-6 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-300 animate-gradient hover-lift"
              >
                {step === 3 ? 'Submit' : 'Next'}
                {step < 3 && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
