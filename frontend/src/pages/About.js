import React from 'react';
import { FiAward, FiHeart, FiGlobe, FiUsers } from 'react-icons/fi';

function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b-4 border-amber-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-4">🎨 Our Heritage</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">About RAVARI</h1>
          <p className="text-xl text-gray-700 font-semibold max-w-3xl">Crafting Luxury Leather Goods with Passion, Precision, and Pride Since 2012</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-700 mb-4 font-semibold leading-relaxed">
              Founded in 2012, RAVARI emerged from a passion for creating exceptional leather goods that transcend trends. We are dedicated to the art of handcraftsmanship, combining traditional techniques with modern design sensibilities.
            </p>
            <p className="text-lg text-gray-700 mb-4 font-semibold leading-relaxed">
              Every piece in our collection is meticulously handcrafted by skilled artisans who understand that luxury is not just about aesthetics—it's about durability, functionality, and the story behind each creation.
            </p>
            <p className="text-lg text-gray-700 font-semibold leading-relaxed">
              Our commitment to excellence has earned us a loyal following of discerning customers who appreciate the finer things in life and understand the value of authentic craftsmanship.
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl border-4 border-amber-200 p-8 text-center">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600 mb-4">
              12 Years
            </div>
            <p className="text-xl font-bold text-gray-900">Of Exceptional Craftsmanship</p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
              <FiAward className="text-5xl text-amber-700 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-700 font-semibold">We never compromise on quality, sourcing only the finest materials for our creations.</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
              <FiHeart className="text-5xl text-amber-700 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Passion Driven</h3>
              <p className="text-gray-700 font-semibold">Our artisans pour heart and soul into every product, creating with unwavering dedication.</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
              <FiGlobe className="text-5xl text-amber-700 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-700 font-semibold">We believe in ethical sourcing and environmentally responsible manufacturing practices.</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
              <FiUsers className="text-5xl text-amber-700 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-700 font-semibold">Your satisfaction is our highest priority, backed by exceptional customer service.</p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-white mb-3">12+</div>
              <p className="text-xl text-amber-100 font-bold">Years in Business</p>
            </div>
            <div className="text-center border-l-2 border-r-2 border-amber-200">
              <div className="text-5xl font-black text-white mb-3">10,000+</div>
              <p className="text-xl text-amber-100 font-bold">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-white mb-3">100%</div>
              <p className="text-xl text-amber-100 font-bold">Handcrafted</p>
            </div>
            <div className="text-center border-l-2 border-amber-200">
              <div className="text-5xl font-black text-white mb-3">50+</div>
              <p className="text-xl text-amber-100 font-bold">Artisan Partners</p>
            </div>
          </div>
        </div>

        {/* Our Process */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">Our Crafting Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', name: 'Design', desc: 'Conceptualization & Sketching' },
              { step: '02', name: 'Material Selection', desc: 'Sourcing Premium Leather' },
              { step: '03', name: 'Cutting', desc: 'Precision Pattern Cutting' },
              { step: '04', name: 'Assembly', desc: 'Hand Stitching & Construction' },
              { step: '05', name: 'Finishing', desc: 'Quality Check & Polish' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 border-3 border-amber-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-black text-amber-700">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 font-semibold">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose RAVARI */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-8">Why Choose RAVARI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div>
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-700 font-semibold">Sourced from the finest tanneries with rigorous quality control at every stage.</p>
            </div>
            <div>
              <div className="text-5xl mb-4">♾️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Lifetime Value</h3>
              <p className="text-gray-700 font-semibold">Our products are built to last generations with proper care and maintenance.</p>
            </div>
            <div>
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Exceptional Service</h3>
              <p className="text-gray-700 font-semibold">Dedicated support before, during, and after your purchase experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
