import { useState } from 'react';
import { Send, Smile, Frown, Meh, Star, Coffee, Heart, Music, Sun, Moon } from 'lucide-react';

export default function Contact() {
  const [mood, setMood] = useState<string>('');
  const [excitement, setExcitement] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    preferredTime: 'morning',
    communicationStyle: 'email',
    projectType: ''
  });

  const moods = [
    { icon: Smile, label: 'Excited', color: 'text-green-500' },
    { icon: Meh, label: 'Curious', color: 'text-blue-500' },
    { icon: Frown, label: 'Uncertain', color: 'text-yellow-500' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Handle form submission
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-2xl mx-auto px-4 py-32 text-center">
          <div className="animate-bounce mb-8">
            <Heart className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Message Sent with Love! ❤️</h2>
          <p className="text-gray-600 mb-8">We'll get back to you faster than a caffeinated developer can type!</p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="relative">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.1
              }}
            >
              {i % 2 === 0 ? <Star className="w-8 h-8" /> : <Coffee className="w-8 h-8" />}
            </div>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Let's Create Something Amazing
            </h1>
            <p className="text-xl text-gray-600">
              Don't be shy, we're just as excited to hear from you!
            </p>
          </div>

          {/* Mood Selector */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-[1.02] transition-all">
            <h2 className="text-2xl font-semibold mb-6 text-center">How are you feeling today?</h2>
            <div className="flex justify-center gap-8">
              {moods.map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  onClick={() => setMood(label)}
                  className={`group flex flex-col items-center p-4 rounded-xl transition-all ${
                    mood === label ? 'bg-blue-50 scale-110' : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-12 h-12 mb-2 ${color} ${
                    mood === label ? 'animate-bounce' : ''
                  }`} />
                  <span className="text-gray-600">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Excitement Level */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-[1.02] transition-all">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              How excited are you about your project?
            </h2>
            <div className="flex justify-center gap-4">
              {[...Array(5)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setExcitement(index + 1)}
                  className={`transform transition-all ${
                    index < excitement ? 'scale-125' : 'opacity-50 hover:opacity-75'
                  }`}
                >
                  <Star className={`w-8 h-8 ${
                    index < excitement ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              {/* Name Input */}
              <div className="group">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-all"
                  placeholder="Your Name"
                />
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-all"
                  placeholder="Your Email"
                />
              </div>

              {/* Time Preference */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, preferredTime: 'morning' })}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    form.preferredTime === 'morning'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <Sun className="w-5 h-5" />
                  Morning Person
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, preferredTime: 'night' })}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    form.preferredTime === 'night'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  Night Owl
                </button>
              </div>

              {/* Communication Style */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, communicationStyle: 'email' })}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    form.communicationStyle === 'email'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, communicationStyle: 'call' })}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    form.communicationStyle === 'call'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <Music className="w-5 h-5" />
                  Video Call
                </button>
              </div>

              {/* Message Input */}
              <div>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-all min-h-[150px] resize-none"
                  placeholder="Tell us about your dream project... Be as creative as you want!"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}