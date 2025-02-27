import { useState } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import Button from './Button';
import Input from './Input';

export default function HypeAuditForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    instagramHandle: '',
    tiktokHandle: '',
    website: '',
    storeLocation: '',
    primaryAudience: '',
    currentChallenges: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    }
    
    if (step === 2) {
      if (!formData.instagramHandle.trim()) newErrors.instagramHandle = 'Instagram handle is required';
      if (!formData.website.trim()) newErrors.website = 'Website is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    // Here you would typically send the data to your backend
    console.log('Submitting hype audit request:', formData);
    
    // Show success step
    setStep(3);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto hover-lift">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold gradient-text">Get Your Free Hype Audit</h2>
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
                  <div className={`w-full h-1 transition-all duration-500 ${
                    step > stepNumber ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Your Information</h3>
              <div className="space-y-4">
                <Input
                  label="Name"
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                />
                
                <Input
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                />
                
                <Input
                  label="Phone"
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  required
                />
                
                <Input
                  label="Company/Brand Name"
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Your Digital Presence</h3>
              <div className="space-y-4">
                <Input
                  label="Instagram Handle"
                  id="instagramHandle"
                  name="instagramHandle"
                  type="text"
                  placeholder="@yourbrand"
                  value={formData.instagramHandle}
                  onChange={handleInputChange}
                  error={errors.instagramHandle}
                  required
                />
                
                <Input
                  label="TikTok Handle"
                  id="tiktokHandle"
                  name="tiktokHandle"
                  type="text"
                  placeholder="@yourbrand"
                  value={formData.tiktokHandle}
                  onChange={handleInputChange}
                />
                
                <Input
                  label="Website URL"
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://yourbrand.com"
                  value={formData.website}
                  onChange={handleInputChange}
                  error={errors.website}
                  required
                />
                
                <Input
                  label="Store Location (if applicable)"
                  id="storeLocation"
                  name="storeLocation"
                  type="text"
                  value={formData.storeLocation}
                  onChange={handleInputChange}
                />
                
                <div className="group">
                  <label htmlFor="primaryAudience" className="block text-sm font-medium text-gray-700 transition-colors duration-300 group-focus-within:text-blue-600">
                    Primary Audience
                  </label>
                  <div className="mt-1 relative">
                    <textarea
                      id="primaryAudience"
                      name="primaryAudience"
                      rows={2}
                      value={formData.primaryAudience}
                      onChange={handleInputChange}
                      placeholder="Describe your target audience"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300"
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 group-focus-within:w-full transition-all duration-300"></div>
                  </div>
                </div>
                
                <div className="group">
                  <label htmlFor="currentChallenges" className="block text-sm font-medium text-gray-700 transition-colors duration-300 group-focus-within:text-blue-600">
                    Current Marketing Challenges
                  </label>
                  <div className="mt-1 relative">
                    <textarea
                      id="currentChallenges"
                      name="currentChallenges"
                      rows={3}
                      value={formData.currentChallenges}
                      onChange={handleInputChange}
                      placeholder="What are your biggest marketing challenges right now?"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300"
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 group-focus-within:w-full transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>Audit Request Received!</h3>
              <p className="text-gray-600 mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                Our team will analyze your digital presence and get back to you within 48 hours with your personalized hype audit.
              </p>
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Button onClick={onClose} variant="gradient">Close</Button>
              </div>
            </div>
          )}

          {step < 3 && (
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300 hover:-translate-x-1 group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-125 rotate-180" />
                  Back
                </button>
              ) : (
                <div />
              )}
              
              <button
                onClick={step === 2 ? handleSubmit : nextStep}
                className="flex items-center px-6 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-300 animate-gradient hover-lift"
              >
                {step === 2 ? 'Submit' : 'Next'}
                {step < 2 && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
