import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' }
  ];

  const serviceLinks = [
    { label: 'Project Consulting', href: '/services#consulting' },
    { label: 'Creative Design', href: '/services#design' },
    { label: 'Tech Integration', href: '/services#tech' },
    { label: 'Digital Innovation', href: '/services#innovation' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">BS</span>
              </div>
              <span className="text-white font-semibold text-lg">Blueprint Studios</span>
            </div>
            <p className="text-gray-400">
              Transforming ideas into exceptional digital experiences through innovation and expertise.
            </p>
            <div className="space-y-4">
              <a 
                href="mailto:contact@blueprintstudios.com" 
                className="flex items-center hover:text-blue-400 transition-colors text-sm"
              >
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                contact@blueprintstudios.com
              </a>
              <a 
                href="tel:+1-929-413-2940" 
                className="flex items-center hover:text-blue-400 transition-colors text-sm"
              >
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                (929) 413-2940
              </a>
              <div className="flex items-start text-sm">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>85 Broad Street<br />New York, NY 10004</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="flex items-center hover:text-blue-400 transition-colors group text-sm"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Services</h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="flex items-center hover:text-blue-400 transition-colors group text-sm"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Stay Updated</h3>
            <p className="text-gray-400 text-sm">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-400 transition-colors p-2">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors p-2">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors p-2">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors p-2">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="hover:text-blue-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-400">
            © {currentYear} Blueprint Studios. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}