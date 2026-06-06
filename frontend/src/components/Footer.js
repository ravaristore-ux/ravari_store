import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-amber-50 to-orange-50 text-gray-800 mt-12 border-t-4 border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Brand & Contact */}
          <div>
            <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-orange-600 mb-3">
              🎨 RAVARI
            </h3>

            {/* Contact Info */}
            <div className="space-y-2 mb-4 text-xs font-semibold">
              <div className="flex items-center gap-2 text-gray-700">
                <FiPhone className="text-amber-700" />
                <a href="tel:+919084260869" className="hover:text-amber-700 transition">
                  +91 90842 60869
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FiMail className="text-amber-700" />
                <a href="mailto:Ravari.store@gmail.com" className="hover:text-amber-700 transition">
                  Ravari.store@gmail.com
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <h5 className="font-black text-amber-900 mb-2 uppercase text-xs tracking-widest">Follow</h5>
            <div className="flex gap-3 mb-4">
              <a href="https://www.instagram.com/ravari_store?igsh=MXNkdjBmZnFnMjAwcg==" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-orange-600 transition transform hover:scale-125 text-2xl" title="Instagram">
                <FiInstagram />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61585497611013" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-orange-600 transition transform hover:scale-125 text-2xl" title="Facebook">
                <FiFacebook />
              </a>
              <a href="https://www.linkedin.com/in/ravari-store-854b98406" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-orange-600 transition transform hover:scale-125 text-2xl" title="LinkedIn">
                <FiLinkedin />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-amber-900 font-black mb-3 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="text-xs space-y-2">
              <li>
                <Link to="/products" className="text-gray-700 hover:text-amber-700 transition font-semibold">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-amber-700 transition font-semibold">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-amber-900 font-black mb-3 text-sm uppercase tracking-wider">Support</h4>
            <ul className="text-xs space-y-2">
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-amber-700 transition font-semibold">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-700 hover:text-amber-700 transition font-semibold">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-amber-900 font-black mb-3 text-sm uppercase tracking-wider">Info</h4>
            <ul className="text-xs space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover:text-amber-700 transition font-semibold">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-amber-700 transition font-semibold">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-amber-200 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-700">
          <p className="font-semibold text-xs">
            &copy; {currentYear} <span className="text-amber-700 font-black">RAVARI</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
