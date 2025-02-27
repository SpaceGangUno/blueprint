import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black/90 to-[#1E0B2C] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-[#00E0FF]/10 animate-float"
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
      
      <Link 
        to="/" 
        className="absolute top-8 left-8 text-gray-300 hover:text-white flex items-center gap-2 transition-all duration-300 hover:-translate-x-1 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" />
        <span>Back to home</span>
      </Link>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in">
        <div className="w-12 h-12 bg-[#FF6B00] rounded-xl flex items-center justify-center mx-auto shadow-lg">
          <span className="text-white font-bold text-xl">BS</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">{title}</h2>
        <p className="mt-2 text-center text-sm text-gray-300">{subtitle}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-gray-900 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 hover-lift border border-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
}
