import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  toggleMenu: () => void;
  links: { href: string; label: string }[];
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, toggleMenu, links }) => {
  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/90 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <nav className="space-y-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-2xl font-bold text-white hover:text-[#FF6B00] transition-colors"
                onClick={toggleMenu}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
