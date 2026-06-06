import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const whatsappNumber = '+919999999999'; // Replace with actual number
  const whatsappMessage = encodeURIComponent('Hi RAVARI! I would like to know more about your products.');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b-4 border-amber-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-4">📞 Get In Touch</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Contact RAVARI</h1>
          <p className="text-xl text-gray-700 font-semibold">We'd love to hear from you. Reach out with any questions or inquiries.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-8">Send us a Message</h2>
            {submitted && (
              <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 font-bold">
                ✅ Thank you! We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 bg-white font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 bg-white font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXXXXXXX"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your inquiry..."
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 bg-white font-semibold"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-lg font-black text-lg hover:shadow-2xl transition transform hover:scale-105"
              >
                ✉️ Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-8">Get in Touch</h2>

            <div className="space-y-6 mb-12">
              {/* Email */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <FiMail className="text-4xl text-amber-700 flex-shrink-0 mt-2" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Email</h3>
                    <a href="mailto:ravari.store@gmail.com" className="text-lg font-semibold text-amber-700 hover:text-orange-600">
                      ravari.store@gmail.com
                    </a>
                    <p className="text-sm text-gray-600 mt-2">We respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <FiPhone className="text-4xl text-amber-700 flex-shrink-0 mt-2" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Phone</h3>
                    <a href="tel:+919876543210" className="text-lg font-semibold text-amber-700 hover:text-orange-600">
                      +91 9876 543 210
                    </a>
                    <p className="text-sm text-gray-600 mt-2">Monday to Saturday, 10 AM - 6 PM</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <FiMapPin className="text-4xl text-amber-700 flex-shrink-0 mt-2" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Address</h3>
                    <p className="text-gray-700 font-semibold mb-2">
                      RAVARI Studios<br />
                      Artisan District<br />
                      New Delhi - 110001, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <FiClock className="text-4xl text-amber-700 flex-shrink-0 mt-2" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Business Hours</h3>
                    <div className="text-gray-700 font-semibold text-sm space-y-1">
                      <p>Monday - Saturday: 10:00 AM - 6:00 PM</p>
                      <p>Sunday: Closed</p>
                      <p className="text-amber-700 font-bold mt-2">Online Support: 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${whatsappNumber.replace('+', '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-black text-lg hover:shadow-2xl transition transform hover:scale-105 text-center"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 border-t-4 border-amber-200 pt-16">
          <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { q: 'What is your return policy?', a: 'We offer 10-day returns on all products in original condition with all tags attached.' },
              { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries worldwide. Shipping rates vary by location.' },
              { q: 'How do I care for my RAVARI product?', a: 'Each product comes with detailed care instructions. Generally, condition leather regularly and store in dust bag.' },
              { q: 'Can I customize my order?', a: 'Yes! We offer custom personalization services. Please contact us for details.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-3">{item.q}</h3>
                <p className="text-gray-700 font-semibold">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
