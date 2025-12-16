import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  logoUrl?: string;
  flagUrl?: string;
  marqueeText?: string;
  panchayatName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ logoUrl, flagUrl, marqueeText, panchayatName }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Meetings (Sabha)', path: '/meetings' },
    { name: 'Schemes', path: '/schemes' },
    { name: 'Tax Payment', path: '/tax' },
    { name: 'Complaints', path: '/complaint' },
    { name: 'News/Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }, 
  ];

  return (
    <nav className="bg-gov-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 md:gap-4">
            {/* Panchayat Logo */}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-gov-primary font-bold overflow-hidden p-1 shadow-md flex-shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <i className="fas fa-landmark"></i>
              )}
            </div>

            {/* Waving Indian Flag (Dynamic) */}
            <div className="h-8 w-12 md:h-10 md:w-16 rounded overflow-hidden flex-shrink-0 border border-white/20 shadow-sm relative bg-orange-50">
                <img 
                    src={flagUrl || "https://media.giphy.com/media/l3vRlT2k2L35Cnn5C/giphy.gif"}
                    onError={(e) => {
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg";
                    }}
                    alt="India Flag" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
              <h1 className="text-lg md:text-3xl font-bold leading-tight tracking-wide">{panchayatName || "ग्रामपंचायत"}</h1>
              <span className="text-[8px] md:text-xs text-gov-accent font-bold uppercase tracking-wider">
                पंचायत समिती कुरखेडा | जिल्हा परिषद गडचिरोली
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded transition-colors text-sm font-medium ${
                  location.pathname === link.path ? 'bg-gov-secondary text-white' : 'hover:bg-blue-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button - Admin Link Removed */}
          <div className="flex items-center space-x-3">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white text-xl p-2">
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-blue-900 border-t border-blue-800">
           {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 border-b border-blue-800 hover:bg-blue-800"
              >
                {link.name}
              </Link>
            ))}
        </div>
      )}

      {/* Marquee */}
      <div className="bg-gov-light text-gov-primary text-sm py-1 border-b border-gray-200">
        <div className="container mx-auto px-4 flex">
          <span className="bg-gov-secondary text-white px-2 py-0.5 text-xs font-bold mr-2 rounded animate-pulse">NOTICE</span>
          <div className="marquee-container flex-1 overflow-hidden">
            <div className="marquee-content font-medium">
              {marqueeText || "अधिकृत पोर्टलवर आपले स्वागत आहे | आपले कर वेळेवर भरा | ग्रामसभेत सहभाग नोंदवा."}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};