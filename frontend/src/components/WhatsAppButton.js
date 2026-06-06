import React, { useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';

function WhatsAppButton() {
  const [isHovering, setIsHovering] = useState(false);

  const whatsappNumber = '919084260869'; // +91 90842 60869
  const whatsappMessage = encodeURIComponent(
    'Hi RAVARI! 👋 I would like to know more about your products.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* WhatsApp Button with Pulse Animation */}
      <button
        onClick={handleClick}
        className="flex items-center gap-3 bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl transition transform hover:scale-110 animate-pulse hover:animate-none cursor-pointer active:scale-95 border-none"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        title="Click to chat with us on WhatsApp"
        style={{
          pointerEvents: 'auto',
          backgroundColor: 'rgb(34, 197, 94)',
          backgroundImage: 'linear-gradient(to right, rgb(74, 222, 128), rgb(22, 163, 74))'
        }}
      >
        <FiMessageCircle className="text-2xl flex-shrink-0" />
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold opacity-90">Message us</span>
          <span className="text-sm font-bold">+91 90842 60869</span>
        </div>
      </button>

      {/* Pulse Ring Animation */}
      {!isHovering && (
        <>
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75 pointer-events-none"></div>
          <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-50 pointer-events-none"></div>
        </>
      )}
    </div>
  );
}

export default WhatsAppButton;
