import { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';

export default function SmsTemplatesNotification() {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm">
      {isMinimized ? (
        // Minimized icon view
        <button 
          onClick={toggleMinimize}
          className="bg-[#FF6B00] text-white p-3 rounded-full shadow-lg hover:bg-[#E05A00] transition-all duration-300 flex items-center justify-center animate-scale-up"
          aria-label="Open SMS templates notification"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      ) : (
        // Full notification view
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-[#00E0FF] animate-scale-up">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start">
              <span className="text-2xl mr-2">🔥</span>
              <div>
                <h3 className="font-bold text-white">Get Free SMS Templates for Your Next Drop</h3>
                <p className="text-gray-400 text-sm">Enter your info to receive exclusive templates</p>
              </div>
            </div>
            <button 
              onClick={toggleMinimize}
              className="text-gray-400 hover:text-white transition-colors ml-2"
              aria-label="Minimize notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            />
            <input 
              type="tel" 
              placeholder="Your Phone (for SMS)" 
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            />
            <button className="w-full py-2 bg-[#FF6B00] text-white font-bold rounded-md hover:bg-[#E05A00] transition-all duration-300">
              Send Me Templates
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
