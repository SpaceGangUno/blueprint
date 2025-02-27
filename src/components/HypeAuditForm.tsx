import { useState } from 'react';
import { X, ArrowRight, Check, Instagram, Globe, MessageSquare, Mail, Phone, Store } from 'lucide-react';
import Button from './Button';
import Input from './Input';

export default function HypeAuditForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    phone: '',
    instagramHandle: '',
    tiktokHandle: '',
    website: '',
    currentChallenges: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.storeName.trim()) newErrors.storeName = 'Store Name is required';
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto hover-lift animate-scale-up">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-blue-700/10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Get Your Free Hype Audit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors hover:rotate-90 transition-transform duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress bar */}
          <div className="flex justify-between mb-8 px-2">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                    step >= stepNumber 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white scale-110 shadow-lg' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-full h-1 transition-all duration-500 ${
                    step > stepNumber ? 'bg-gradient-to-r from-blue-500 to-blue-700' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white mr-2">
                  <Store className="w-4 h-4" />
                </span>
                Your Store
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <Store className="w-5 h-5" />
                  </div>
                  <Input
                    label="Store Name"
                    id="storeName"
                    name="storeName"
                    type="text"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    error={errors.storeName}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white mr-2">
                  <Globe className="w-4 h-4" />
                </span>
                Your Digital Presence
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <Instagram className="w-5 h-5" />
                  </div>
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
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                  <Input
                    label="TikTok Handle"
                    id="tiktokHandle"
                    name="tiktokHandle"
                    type="text"
                    placeholder="@yourbrand"
                    value={formData.tiktokHandle}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <Globe className="w-5 h-5" />
                  </div>
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
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-9 text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <Input
                    label="Phone"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    required
                    className="pl-10"
                  />
                </div>
                
                <div className="group">
                  <label htmlFor="currentChallenges" className="block text-sm font-medium text-gray-700 transition-colors duration-300 group-focus-within:text-blue-600 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
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
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-blue-700 group-focus-within:w-full transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow shadow-xl">
                <Check className="w-12 h-12 text-white animate-bounce-slow" />
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <svg className="w-64 h-64 text-[#FF6B00]" viewBox="0 0 100 100" fill="none">
                    <path d="M50 0 L95 25 L95 75 L50 100 L5 75 L5 25 Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  Audit Request Received!
                </h3>
                <p className="text-gray-600 mb-8 animate-slide-up text-lg" style={{ animationDelay: '0.3s' }}>
                  Our team will analyze your digital presence and get back to you within 48 hours with your personalized hype audit.
                </p>
                <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg blur-md animate-pulse-slow"></div>
                    <Button onClick={onClose} variant="gradient" className="relative">Close</Button>
                  </div>
                </div>
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
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center">
                  {step === 2 ? 'Submit' : 'Next'}
                  {step < 2 && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
