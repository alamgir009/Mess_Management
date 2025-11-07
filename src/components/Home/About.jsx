import React from 'react';
import {
  FaUsers,
  FaLightbulb,
  FaAward,
  FaRocket,
  FaHeart,
  FaPaintBrush,
  FaEnvelope,
  FaPhoneAlt ,
  FaGlobe,
  FaShieldAlt,
  FaHandshake,
  FaServer,
  FaMobileAlt,
  FaCloud
} from "react-icons/fa";

export const About = () => {
  // Animated gradient border component inspired by Vercel
  const GradientBorder = ({ children, className = '' }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
      <div className="relative bg-black border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors duration-300">
        {children}
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-black text-gray-100'>
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .mesh-gradient {
          background: 
            radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.1) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.1) 0px, transparent 50%);
        }
      `}</style>

      {/* Hero Section */}
      <section className='relative overflow-hidden mesh-gradient pt-32 pb-20'>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]'></div>
        
        <div className='container mx-auto px-5 md:px-10 lg:px-20 relative'>
          <div className='max-w-5xl mx-auto text-center space-y-8'>
            <div className='inline-block'>
              <div className='px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-8'>
                Enterprise-Grade Meal Management Platform
              </div>
            </div>
            
            <h1 className='text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight'>
              <span className='block text-white'>About</span>
              <span className='block mt-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift'>
                UnitedMess
              </span>
            </h1>
            
            <p className='text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto'>
              Redefining meal management with intelligent automation and seamless experiences. 
              Built for scale, designed for simplicity.
            </p>
            
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-4'>
              <button className='group px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center gap-2'>
                Get Started
                <span className='group-hover:translate-x-1 transition-transform'>→</span>
              </button>
              <button className='px-6 py-3 border border-gray-700 rounded-lg font-medium hover:border-gray-600 hover:bg-gray-900/50 transition-all'>
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-24'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {[
            { value: "14.2K+", label: "Active Users", icon: FaUsers },
            { value: "29K+", label: "Meals Planned", icon: FaHeart },
            { value: "99.9%", label: "Uptime SLA", icon: FaShieldAlt },
            { value: "4.9/5", label: "User Rating", icon: FaAward }
          ].map((stat, index) => (
            <div
              key={index}
              className='group relative p-6 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all duration-300 bg-gradient-to-b from-gray-900/50 to-black'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all duration-500'></div>
              <div className='relative'>
                <stat.icon className='w-8 h-8 mb-4 text-gray-500 group-hover:text-gray-400 transition-colors' />
                <p className='text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'>{stat.value}</p>
                <p className='text-sm text-gray-500'>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-24'>
        <div className='text-center mb-16'>
          <div className='inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-400 mb-6'>
            Our Foundation
          </div>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
            Core Principles
          </h2>
          <p className='text-lg text-gray-400 max-w-2xl mx-auto'>
            The values that drive every decision we make
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            {
              icon: FaLightbulb,
              title: "Innovation First",
              content: "Constantly pushing the boundaries of what's possible in meal management technology.",
              gradient: "from-cyan-500/10 to-blue-500/10",
              iconColor: "text-cyan-400"
            },
            {
              icon: FaHandshake,
              title: "Trust & Transparency",
              content: "Building lasting relationships through honest practices and open communication.",
              gradient: "from-purple-500/10 to-pink-500/10",
              iconColor: "text-purple-400"
            },
            {
              icon: FaGlobe,
              title: "Global Scale",
              content: "Designed for diverse cultures and cuisines, celebrating culinary traditions worldwide.",
              gradient: "from-pink-500/10 to-orange-500/10",
              iconColor: "text-pink-400"
            }
          ].map((item, index) => (
            <GradientBorder key={index}>
              <div className={`p-8 h-full bg-gradient-to-br ${item.gradient}`}>
                <item.icon className={`w-12 h-12 mb-6 ${item.iconColor}`} />
                <h3 className='text-xl font-bold mb-3 text-white'>{item.title}</h3>
                <p className='text-gray-400 leading-relaxed'>{item.content}</p>
              </div>
            </GradientBorder>
          ))}
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-24'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div>
            <div className='inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-6'>
              Technology
            </div>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 text-white'>
              Built for Performance
            </h2>
            <p className='text-lg text-gray-400 mb-8 leading-relaxed'>
              Enterprise-grade infrastructure powering seamless experiences across the globe.
            </p>
            
            <div className='space-y-4 mb-8'>
              {[
                { label: "AI-Powered Recommendations", detail: "Machine learning algorithms" },
                { label: "Real-Time Synchronization", detail: "Sub-100ms latency" },
                { label: "Predictive Analytics", detail: "Advanced forecasting models" },
                { label: "Multi-Platform Support", detail: "iOS, Android, Web" },
                { label: "Enterprise Security", detail: "SOC 2 Type II certified" }
              ].map((tech, index) => (
                <div key={index} className='flex items-start group'>
                  <div className='w-1.5 h-1.5 mt-2 mr-3 rounded-full bg-cyan-400 group-hover:bg-cyan-300 transition-colors'></div>
                  <div>
                    <span className='text-white font-medium'>{tech.label}</span>
                    <span className='text-gray-500 text-sm ml-2'>· {tech.detail}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className='flex flex-wrap gap-6 pt-4'>
              <div className='flex items-center gap-2'>
                <FaServer className='w-5 h-5 text-gray-500' />
                <span className='text-gray-400 text-sm'>12 Global Data Centers</span>
              </div>
              <div className='flex items-center gap-2'>
                <FaCloud className='w-5 h-5 text-gray-500' />
                <span className='text-gray-400 text-sm'>AWS Infrastructure</span>
              </div>
            </div>
          </div>

          <div>
            <GradientBorder>
              <div className='p-8'>
                <h3 className='text-xl font-bold mb-6 text-white'>Platform Features</h3>
                <div className='space-y-4'>
                  {[
                    {
                      icon: FaMobileAlt,
                      title: "Cross-Platform Access",
                      desc: "Native apps for iOS and Android with real-time cloud sync."
                    },
                    {
                      icon: FaShieldAlt,
                      title: "Enterprise Security",
                      desc: "End-to-end encryption, GDPR compliant, and SOC 2 certified."
                    },
                    {
                      icon: FaRocket,
                      title: "Lightning Fast",
                      desc: "Edge-optimized delivery with 99.9% uptime guarantee."
                    }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className='group flex items-start gap-4 p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-all bg-gradient-to-r from-gray-900/50 to-transparent'
                    >
                      <div className='mt-1'>
                        <feature.icon className='w-6 h-6 text-gray-500 group-hover:text-gray-400 transition-colors' />
                      </div>
                      <div>
                        <h4 className='text-base font-semibold text-white mb-1'>{feature.title}</h4>
                        <p className='text-sm text-gray-400 leading-relaxed'>{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GradientBorder>
          </div>
        </div>
      </section>

      {/* System Status Section */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-24'>
        <div className='text-center mb-16'>
          <div className='inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-sm text-green-400 mb-6'>
            Live Status
          </div>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
            System Performance
          </h2>
          <p className='text-lg text-gray-400 max-w-2xl mx-auto'>
            Real-time metrics from our global infrastructure
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            {
              title: "API Response",
              subtitle: "Average latency",
              status: "Operational",
              statusColor: "green",
              metric: "87ms",
              percentage: 94,
              detail: "99.8% uptime"
            },
            {
              title: "Database",
              subtitle: "Query performance",
              status: "Optimal",
              statusColor: "green",
              metric: "3.8ms",
              percentage: 96,
              detail: "99.2% cache hit"
            },
            {
              title: "Edge Network",
              subtitle: "CDN performance",
              status: "Healthy",
              statusColor: "green",
              metric: "12ms",
              percentage: 98,
              detail: "Global coverage"
            }
          ].map((item, index) => (
            <GradientBorder key={index}>
              <div className='p-6'>
                <div className='flex justify-between items-start mb-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-white mb-1'>{item.title}</h3>
                    <p className='text-sm text-gray-500'>{item.subtitle}</p>
                  </div>
                  <div className={`px-3 py-1 bg-${item.statusColor}-500/10 border border-${item.statusColor}-500/20 text-${item.statusColor}-400 rounded-full text-xs font-medium`}>
                    {item.status}
                  </div>
                </div>
                
                <div className='relative h-2 bg-gray-800 rounded-full overflow-hidden mb-3'>
                  <div 
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r from-${item.statusColor}-500 to-${item.statusColor}-400 rounded-full transition-all duration-1000`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                
                <div className='flex justify-between text-sm'>
                  <span className='text-white font-medium'>{item.metric}</span>
                  <span className='text-gray-500'>{item.detail}</span>
                </div>
              </div>
            </GradientBorder>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-24'>
        <div className='relative overflow-hidden rounded-3xl border border-gray-800'>
          <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10'></div>
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:3rem_3rem]'></div>
          
          <div className='relative p-12 md:p-16 text-center'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 text-white'>
              Ready to Get Started?
            </h2>
            <p className='text-lg text-gray-400 mb-8 max-w-2xl mx-auto'>
              Join thousands of teams already using UnitedMess to streamline their meal management.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='group px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-2'>
                Start Free Trial
                <span className='group-hover:translate-x-1 transition-transform'>→</span>
              </button>
              <button className='px-8 py-4 border border-gray-700 rounded-lg font-medium hover:border-gray-600 hover:bg-gray-900/50 transition-all'>
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className='container mx-auto px-5 md:px-10 lg:px-20 py-24 pb-32'>
        <div className='text-center mb-16'>
          <div className='inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-6'>
            Get in Touch
          </div>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
            Contact Us
          </h2>
          <p className='text-lg text-gray-400 max-w-2xl mx-auto'>
            Our team is here to help with any questions or support needs
          </p>
        </div>

        <div className='max-w-5xl mx-auto'>
          <GradientBorder>
            <div className='p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12'>
              <div>
                <h3 className='text-xl font-bold mb-6 text-white'>Get Support</h3>
                <div className='space-y-6'>
                  <div className='group'>
                    <div className='flex items-center gap-3 mb-2'>
                      <FaEnvelope className='w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors' />
                      <span className='text-sm text-gray-500'>Email</span>
                    </div>
                    <a href="mailto:unitedmess96@gmail.com" className='text-white hover:text-cyan-400 transition-colors pl-8'>
                      unitedmess96@gmail.com
                    </a>
                  </div>
                  
                  <div className='group'>
                    <div className='flex items-center gap-3 mb-2'>
                      <FaPhoneAlt  className='w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors' />
                      <span className='text-sm text-gray-500'>Phone</span>
                    </div>
                    <a href="tel:+18005551234" className='text-white hover:text-cyan-400 transition-colors pl-8'>
                      +1 (800) 555-1234
                    </a>
                  </div>
                  
                  <div className='group'>
                    <div className='flex items-center gap-3 mb-2'>
                      <FaMobileAlt className='w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors' />
                      <span className='text-sm text-gray-500'>In-App Support</span>
                    </div>
                    <p className='text-white pl-8'>Available 24/7 in your dashboard</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-xl font-bold mb-6 text-white'>Resources</h3>
                <div className='space-y-4'>
                  {[
                    { label: "API Documentation", url: "developer.unitedmess.com" },
                    { label: "System Status", url: "status.unitedmess.com" },
                    { label: "Security Portal", url: "security.unitedmess.com" },
                    { label: "Knowledge Base", url: "help.unitedmess.com" }
                  ].map((link, index) => (
                    <div key={index} className='group'>
                      <p className='text-sm text-gray-500 mb-1'>{link.label}</p>
                      <a href="#" className='text-cyan-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2'>
                        {link.url}
                        <span className='group-hover:translate-x-1 transition-transform'>→</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GradientBorder>
        </div>
      </section>
    </div>
  );
}