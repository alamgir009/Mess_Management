import React from 'react';
import {
  FaUsers,
  FaLightbulb,
  FaAward,
  FaRocket,
  FaHeart,
  FaPaintBrush,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaShieldAlt,
  FaHandshake,
  FaServer,
  FaMobileAlt,
  FaCloud
} from "react-icons/fa";

export const About = () => {
  // Glowing border animation component
  const GlowBorder = ({ children, colorClass = 'border-cyan-400' }) => (
    <div className={`relative group p-0.5 rounded-xl ${colorClass}`}>
      <div className="absolute inset-0 bg-current rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>
      <div className="relative bg-gray-900/80 backdrop-blur-md rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-900 via-indigo-900 to-green-700 text-gray-100 pt-20'>
      {/* Hero Section */}
      <section classNamePulseIdling='container mx-auto px-5 md:px-10 lg:px-20 py-16'>

        <div className='max-w-5xl mx-auto text-center space-y-8 p-10'>
          <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 animate-gradient-x'>
            About UnitedMess
          </h1>
          <p className='text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-4xl mx-auto'>
            Pioneering the future of meal management through innovation and passion. We combine culinary excellence with cutting-edge technology to transform your dining experience.
          </p>
          <div className='flex justify-center mt-8'>
            <button className='px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all'>
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-16'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {[
            { value: "14.2K", label: "Active Users", icon: FaUsers, color: "text-blue-400" },
            { value: "29K", label: "Meals Planned", icon: FaHeart, color: "text-pink-400" },
            { value: "98%", label: "Uptime", icon: FaShieldAlt, color: "text-amber-400" },
            { value: "4.9★", label: "Rating", icon: FaAward, color: "text-emerald-400" }
          ].map((stat, index) => (
            <GlowBorder key={index} colorClass={`border-${stat.color.split('-')[1]}-400`}>
              <div className='p-6 text-center'>
                <stat.icon className={`w-10 h-10 mx-auto mb-4 ${stat.color}`} />
                <p className='text-4xl font-bold mb-2'>{stat.value}</p>
                <p className='text-gray-400'>{stat.label}</p>
              </div>
            </GlowBorder>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-16'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400'>
            Our Core Principles
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            The foundation of everything we do at UnitedMess
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            {
              icon: FaLightbulb,
              title: "Innovation",
              content: "We constantly push boundaries in meal management technology to deliver groundbreaking solutions.",
              color: "border-blue-400"
            },
            {
              icon: FaHandshake,
              title: "Integrity",
              content: "Honest, transparent practices form the backbone of all our operations and relationships.",
              color: "border-emerald-400"
            },
            {
              icon: FaGlobe,
              title: "Global Vision",
              content: "Designed for diverse palates worldwide, celebrating culinary traditions across cultures.",
              color: "border-purple-400"
            }
          ].map((item, index) => (
            <GlowBorder key={index} colorClass={item.color}>
              <div className='p-8 h-full'>
                <item.icon className={`w-12 h-12 mb-6 ${item.color.replace('border', 'text')}`} />
                <h3 className='text-2xl font-bold mb-4 text-gray-100'>{item.title}</h3>
                <p className='text-gray-300 font-light'>{item.content}</p>
              </div>
            </GlowBorder>
          ))}
        </div>
      </section>

      {/* Technology Features Section */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-20'>
        <div className='flex flex-col md:flex-row gap-12 items-center'>
          <div className='md:w-1/2'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400'>
              Our Technology Features
            </h2>
            <p className='text-xl text-gray-300 mb-8'>
              Powered by cutting-edge innovations to deliver seamless performance
            </p>
            <ul className='space-y-4 mb-8'>
              {[
                "AI-powered meal recommendations",
                "Real-time inventory tracking",
                "Predictive analytics engine",
                "Cross-platform synchronization",
                "Enterprise-grade security"
              ].map((tech, index) => (
                <li key={index} className='flex items-start'>
                  <div className='w-2 h-2 mt-2 mr-3 rounded-full bg-emerald-400'></div>
                  <span className='text-gray-300'>{tech}</span>
                </li>
              ))}
            </ul>
            <div className='flex space-x-4'>
              <div className='flex items-center'>
                <FaServer className='w-6 h-6 text-blue-400 mr-2' />
                <span className='text-gray-400'>12 Data Centers</span>
              </div>
              <div className='flex items-center'>
                <FaCloud className='w-6 h-6 text-cyan-400 mr-2' />
                <span className='text-gray-400'>AWS Infrastructure</span>
              </div>
            </div>
          </div>
          <div className='md:w-1/2'>
            <GlowBorder colorClass="border-emerald-400">
              <div className='p-6 bg-gray-800/50 rounded-xl'>
                <h3 className='text-xl font-semibold mb-6'>Key Features</h3>
                <div className='grid grid-cols-1 gap-4'>
                  {[
                    {
                      icon: FaMobileAlt,
                      title: "Mobile Accessibility",
                      desc: "Access UnitedMess on iOS and Android with real-time sync."
                    },
                    {
                      icon: FaShieldAlt,
                      title: "Data Security",
                      desc: "End-to-end encryption and GDPR-compliant practices."
                    },
                    {
                      icon: FaRocket,
                      title: "Performance",
                      desc: "Ultra-low latency with 99.9% uptime across global servers."
                    }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className='flex items-start p-4 rounded-lg bg-gray-900/50 hover:bg-gray-900/70 transition-all'
                    >
                      <feature.icon className='w-8 h-8 text-emerald-400 mr-4' />
                      <div>
                        <h4 className='text-lg font-semibold text-gray-100'>{feature.title}</h4>
                        <p className='text-gray-400 text-sm'>{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlowBorder>
          </div>
        </div>
      </section>

      {/* Real-time System Status */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-20'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400'>
            System Status
          </h2>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
            Current platform performance metrics
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <GlowBorder colorClass="border-green-400">
            <div className='p-6'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-xl font-semibold mb-2'>API Response</h3>
                  <p className='text-gray-400'>Average latency</p>
                </div>
                <div className='px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm'>Optimal</div>
              </div>
              <div className='mt-6'>
                <div className='h-2 bg-gray-700 rounded-full overflow-hidden'>
                  <div className='h-full bg-green-400' style={{ width: '92%' }}></div>
                </div>
                <div className='flex justify-between mt-2 text-sm text-gray-400'>
                  <span>92ms</span>
                  <span>99.2% uptime</span>
                </div>
              </div>
            </div>
          </GlowBorder>

          <GlowBorder colorClass="border-amber-400">
            <div className='p-6'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-xl font-semibold mb-2'>Database</h3>
                  <p className='text-gray-400'>Query performance</p>
                </div>
                <div className='px-3 py-1 bg-amber-400/20 text-amber-400 rounded-full text-sm'>Stable</div>
              </div>
              <div className='mt-6'>
                <div className='h-2 bg-gray-700 rounded-full overflow-hidden'>
                  <div className='h-full bg-amber-400' style={{ width: '87%' }}></div>
                </div>
                <div className='flex justify-between mt-2 text-sm text-gray-400'>
                  <span>4.2ms</span>
                  <span>98.7% success</span>
                </div>
              </div>
            </div>
          </GlowBorder>

          <GlowBorder colorClass="border-blue-400">
            <div className='p-6'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-xl font-semibold mb-2'>Mobile App</h3>
                  <p className='text-gray-400'>User sessions</p>
                </div>
                <div className='px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-sm'>Growing</div>
              </div>
              <div className='mt-6'>
                <div className='h-2 bg-gray-700 rounded-full overflow-hidden'>
                  <div className='h-full bg-blue-400' style={{ width: '76%' }}></div>
                </div>
                <div className='flex justify-between mt-2 text-sm text-gray-400'>
                  <span>8.2K active</span>
                  <span>+12% this week</span>
                </div>
              </div>
            </div>
          </GlowBorder>
        </div>
      </section>

      {/* CTA Section */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-20'>
        <GlowBorder colorClass="border-cyan-400">
          <div className='p-12 text-center bg-gradient-to-br from-gray-900/80 to-cyan-900/20 rounded-xl'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300'>
              Ready to Transform Your Meal Experience?
            </h2>
            <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
              Join thousands of satisfied users revolutionizing their culinary routines with UnitedMess.
            </p>
            <button className='px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all'>
              Get Started Now
            </button>
          </div>
        </GlowBorder>
      </section>

      {/* Contact Section */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-20'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400'>
            Contact Our Team
          </h2>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
            Have questions? Our support team is here to help.
          </p>
        </div>

        <div className='max-w-4xl mx-auto'>
          <GlowBorder colorClass="border-blue-400">
            <div className='p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <h3 className='text-2xl font-bold mb-6'>Support Channels</h3>
                <div className='space-y-6'>
                  <div className='flex items-start'>
                    <FaEnvelope className='w-5 h-5 mt-1 mr-4 text-blue-400' />
                    <div>
                      <p className='text-gray-400'>Email Support</p>
                      <a href="mailto:unitedmess96@gmail.com" className='text-gray-300 hover:text-blue-400 transition-colors'>
                        unitedmess96@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className='flex items-start'>
                    <FaPhone className='w-5 h-5 mt-1 mr-4 text-blue-400' />
                    <div>
                      <p className='text-gray-400'>Phone Support</p>
                      <a href="tel:+18005551234" className='text-gray-300 hover:text-blue-400 transition-colors'>
                        +1 (800) 555-1234
                      </a>
                    </div>
                  </div>
                  <div className='flex items-start'>
                    <FaMobileAlt className='w-5 h-5 mt-1 mr-4 text-blue-400' />
                    <div>
                      <p className='text-gray-400'>In-App Support</p>
                      <p className='text-gray-300'>Available 24/7 in your account</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-2xl font-bold mb-6'>Technical Information</h3>
                <div className='space-y-4'>
                  <div>
                    <p className='text-gray-400'>API Documentation</p>
                    <a href="#" className='text-blue-400 hover:underline'>developer.unitedmess.com</a>
                  </div>
                  <div>
                    <p className='text-gray-400'>System Status</p>
                    <a href="#" className='text-blue-400 hover:underline'>status.unitedmess.com</a>
                  </div>
                  <div>
                    <p className='text-gray-400'>Security</p>
                    <a href="#" className='text-blue-400 hover:underline'>security.unitedmess.com</a>
                  </div>
                </div>
              </div>
            </div>
          </GlowBorder>
        </div>
      </section>
    </div>
  );
}