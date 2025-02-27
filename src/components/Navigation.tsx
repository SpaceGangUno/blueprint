import { Menu, X, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-800/95 backdrop-blur-md shadow-lg' 
        : 'bg-gray-800 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center animate-gradient">
                <span className="text-gray-900 font-bold">BS</span>
              </div>
              <span className="font-semibold text-lg sm:text-xl gradient-text animate-snake">
                <span>B</span>
                <span>l</span>
                <span>u</span>
                <span>e</span>
                <span>p</span>
                <span>r</span>
                <span>i</span>
                <span>n</span>
                <span>t</span>
                <span> </span>
                <span>S</span>
                <span>t</span>
                <span>u</span>
                <span>d</span>
                <span>i</span>
                <span>o</span>
                <span>s</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link to="/services" className="text-gray-200 hover:text-white font-medium transition-colors relative group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-gray-200 hover:text-white font-medium transition-colors relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/login" 
              className="inline-flex items-center px-3 py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:shadow-lg transition-all duration-300 animate-gradient hover-lift"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Client Portal
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-gray-700 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
            <span className="font-semibold text-lg gradient-text animate-snake">
              <span>M</span>
              <span>e</span>
              <span>n</span>
              <span>u</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="px-2 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <Link
              to="/services"
              className="block w-full text-left px-4 py-3 text-base sm:text-lg text-gray-800 hover:text-black font-medium hover:bg-gray-50 rounded-lg transition-all duration-300 hover-lift"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="block w-full text-left px-4 py-3 text-base sm:text-lg text-gray-800 hover:text-black font-medium hover:bg-gray-50 rounded-lg transition-all duration-300 hover-lift"
            >
              Contact
            </Link>
            <div className="px-4 pt-4">
              <Link
                to="/login"
                className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:shadow-lg transition-all duration-300 animate-gradient"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
