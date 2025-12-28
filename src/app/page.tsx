"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from "@/components/global/NavBar";
import { HiOutlineUserGroup, HiOutlineCog, HiOutlineSpeakerphone, HiOutlineSupport } from "react-icons/hi";
import ScrollFadeInSection from '@/components/common/ScrollFadeInSection';
import { CheckCircleIcon, CheckIcon, Zap, Shield, TrendingUp, Building2 } from 'lucide-react';
import DemoModal from '@/components/common/DemoModal';

interface HeroProps {
  onBookDemo: () => void;
}

const StickyCTA: React.FC<HeroProps> = ({ onBookDemo }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 border-t border-slate-700 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="hidden md:block">
            <p className="text-sm text-slate-300">Ready to eliminate manual work?</p>
          </div>
          <button
            onClick={onBookDemo}
            className="w-full md:w-auto inline-block px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all duration-300"
          >
            Book a Systems Audit
          </button>
        </div>
      </div>
    </div>
  );
};

const HeroSection: React.FC<HeroProps> = ({ onBookDemo }) => {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] sm:w-[150%] sm:h-[150%] lg:w-[100%] lg:h-[100%] rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollFadeInSection>
          <div className="inline-block px-6 py-3 mb-6 bg-gradient-to-r from-primary via-primary/90 to-primary border-2 border-primary shadow-lg shadow-primary/50 rounded-full backdrop-blur-sm">
            <p className="text-xs font-bold text-slate-50 tracking-widest uppercase">Managed Automation for Scalable Businesses</p>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-50 tracking-tighter">
            <span className="block">Stop Managing Tasks.</span>
            <span className="block text-primary">Let Systems Run Your Business.</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
            We design, run, and maintain automations so founders never touch tools, workflows, or fixes.
          </p>
          <p className="mt-3 max-w-2xl mx-auto text-base text-slate-400">
            If something breaks, we fix it before you even notice — you never touch tools or workflows.
          </p>
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="relative bg-slate-900/80 border-2 border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-xl"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="text-2xl font-bold text-primary mb-1">20+ hrs</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Reclaimed Weekly</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="text-2xl font-bold text-primary mb-1">10M+</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Events/Month</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Uptime</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-center space-x-3 text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span>Runs Without You</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span>No Manual Work</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>Self-Monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              onClick={onBookDemo}
              className="inline-block px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary"
            >
              Book a Systems Audit
            </button>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm text-slate-400">No commitment. No credit card.</p>
              <p className="text-xs font-semibold text-primary">Only 2 spots remaining for January Founding Partners.</p>
            </div>
          </div>
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

const LightSocialProof: React.FC = () => {
  return (
    <div className="text-center py-8 border-y border-slate-700/50 bg-slate-900/30">
      <p className="text-base text-slate-300 font-medium mb-2">
        Founder-built systems running in production • No templates • No outsourcing
      </p>
      <p className="text-sm text-slate-400 mb-3">
        Processing 10M+ events/month • AI/ML models deployed across workflows • 99.9% uptime
      </p>
      <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500">
        <span>Node-based execution platform</span>
        <span>•</span>
        <span>API, browser, AI/ML, data processing</span>
        <span>•</span>
        <span>Enterprise-grade infrastructure</span>
      </div>
    </div>
  );
};

const QuickLinks: React.FC = () => {
  return (
    <section className="py-8 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              const element = document.getElementById('workflow-example');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 text-sm text-slate-300 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors"
          >
            How it works in 60 seconds
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('workflow-example');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 text-sm text-slate-300 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Skip to a real example
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('what-we-handle');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 text-sm text-slate-300 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors"
          >
            What we handle vs what you don't
          </button>
        </div>
      </div>
    </section>
  );
};

const DailyLifeFit: React.FC = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">
            Where TheOneEye Works in Your Business
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            We replace the manual work you do every day with systems that run automatically.
          </p>
        </ScrollFadeInSection>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ScrollFadeInSection>
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
              <p className="text-slate-300 font-medium">AI-powered lead scoring & routing</p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
              <p className="text-slate-300 font-medium">Data processing & transformation</p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
              <p className="text-slate-300 font-medium">Decision logic & conditional flows</p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
              <p className="text-slate-300 font-medium">API integrations & web automation</p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
              <p className="text-slate-300 font-medium">ML classification & extraction</p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
              <p className="text-slate-300 font-medium">Validation & quality checks</p>
            </div>
          </ScrollFadeInSection>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollFadeInSection>
            <div className="p-6 bg-red-900/10 border-2 border-red-800/50 rounded-xl">
              <h3 className="text-xl font-bold text-red-400 mb-4">Before</h3>
              <p className="text-slate-300">Leads checked once a day</p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-6 bg-green-900/10 border-2 border-green-800/50 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">After</h3>
              <p className="text-slate-300">Leads followed up in 60 seconds</p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-6 bg-red-900/10 border-2 border-red-800/50 rounded-xl">
              <h3 className="text-xl font-bold text-red-400 mb-4">Before</h3>
              <p className="text-slate-300">Ops depends on one person</p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-6 bg-green-900/10 border-2 border-green-800/50 rounded-xl">
              <h3 className="text-xl font-bold text-green-400 mb-4">After</h3>
              <p className="text-slate-300">Ops runs even if they're offline</p>
            </div>
          </ScrollFadeInSection>
        </div>
        <ScrollFadeInSection className="mt-10 text-center">
          <button
            onClick={() => {
              const element = document.getElementById('workflow-example');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block px-6 py-3 text-base font-semibold text-slate-50 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Learn More
          </button>
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

const Process: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Systemic Leak Detection',
      description: 'This removes hidden costs draining your revenue. We find what\'s wasting your money.'
    },
    {
      number: '02',
      title: 'System Design',
      description: 'This removes fragile connections that break. We build systems that don\'t break.'
    },
    {
      number: '03',
      title: 'Seamless Integration',
      description: 'This removes disruption to your business. Everything keeps running while we integrate.'
    },
    {
      number: '04',
      title: 'Guaranteed Outcomes',
      description: 'This removes uncertainty. You get measurable results with 99.9% uptime.'
    }
  ];

  return (
    <section id="process" className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">How We Build Your Systems</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            A proven framework that scales your operations without adding headcount.
          </p>
        </ScrollFadeInSection>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ScrollFadeInSection key={index}>
              <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 h-full text-center hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <span className="text-5xl font-extrabold text-primary">{step.number}</span>
                <h3 className="mt-4 text-xl font-bold text-slate-50">{step.title}</h3>
                <p className="mt-2 text-slate-400">
                  {step.description}
                </p>
              </div>
            </ScrollFadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const OwnershipSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">We Own the Outcome</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            This is the most important part. TheOneEye owns the failure—you don't.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 max-w-4xl mx-auto">
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl">
              <div className="space-y-6 text-slate-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-50 mb-2">Every Workflow Has a Designated Owner</h3>
                    <p>Every system has a designated owner within our team who monitors and maintains it continuously.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-50 mb-2">We Fix It Before You Notice</h3>
                    <p>When a workflow fails or behaves unexpectedly, the responsible person is notified immediately. The team investigates and fixes the issue—you're not expected to debug, retry, or monitor.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-50 mb-2">You Are Not the Emergency Contact</h3>
                    <p>Automated notification and escalation systems ensure accountability at the human level. You focus on strategy—we handle the systems.</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollFadeInSection>
        </div>
      </div>
    </section>
  );
};

const Services: React.FC = () => {

  const services = [
      { 
        icon: <HiOutlineUserGroup className="text-3xl" />, 
        title: "Reclaim 20+ Hours Weekly", 
        description: "Eliminate manual lead entry and missed follow-ups. Every lead is captured, AI-qualified, and routed automatically—reclaim time for strategy." 
      },
      { 
        icon: <HiOutlineCog className="text-3xl" />, 
        title: "Scale Revenue Without Headcount", 
        description: "Remove human bottlenecks in data sync, approvals, and reporting. Operations scale automatically—no hiring needed." 
      },
      { 
        icon: <HiOutlineSpeakerphone className="text-3xl" />, 
        title: "AI-Powered Decision Making", 
        description: "Use AI/ML for predictive scoring, classification, and intelligent routing. Make data-driven decisions automatically—no manual analysis." 
      },
      { 
        icon: <HiOutlineSupport className="text-3xl" />, 
        title: "Eliminate Human Error", 
        description: "Automated processing, validation, and quality checks. Reduce errors in lead processing, data entry, and workflows—zero manual mistakes." 
      }
  ];

  return (
      <section id="services" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollFadeInSection className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">What We Execute</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
                      Our node-based platform handles API calls, browser automation, AI/ML inference, data processing, and decision logic—ensuring outcomes, not just connections.
                  </p>
              </ScrollFadeInSection>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {services.map((service, index) => (
                      <ScrollFadeInSection key={index}>
                          <div className="flex items-start space-x-6 p-6 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
                              <div className="flex-shrink-0 bg-primary/10 text-primary p-4 rounded-lg">
                                  {service.icon}
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-slate-50">{service.title}</h3>
                                  <p className="mt-1 text-slate-400">{service.description}</p>
                              </div>
                          </div>
                      </ScrollFadeInSection>
                  ))}
              </div>
          </div>
      </section>
  );
};

const PlatformAuthority: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">Powered by Enterprise-Grade Infrastructure</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            This means you don't have to worry about unreliable tools. We use OpenAI and Anthropic—industry-standard power, not experimental tech.
          </p>
          <p className="mt-2 max-w-2xl mx-auto text-base text-slate-400 italic">
            We aren't building this in your basement with "no-name" tools.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 md:gap-12">
          <div className="px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <span className="text-xl font-semibold text-slate-300">OpenAI</span>
          </div>
          <div className="px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <span className="text-xl font-semibold text-slate-300">Anthropic</span>
          </div>
          <div className="px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <span className="text-xl font-semibold text-slate-300">Make.com</span>
          </div>
          <div className="px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <span className="text-xl font-semibold text-slate-300">Pinecone</span>
          </div>
        </div>
        <ScrollFadeInSection className="mt-8 text-center">
          <p className="text-slate-400 italic">
            Certified Architects of enterprise-grade automation infrastructure
          </p>
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

const SimpleWorkflowExample: React.FC<HeroProps> = ({ onBookDemo }) => {
  return (
    <section id="workflow-example" className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">How It Works: A Simple Example</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Here's what happens when a lead comes in—using AI/ML, data processing, and decision logic, automatically.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 max-w-5xl mx-auto">
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-slate-300">
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">1</div>
                  <p className="font-semibold text-sm">Lead Captured</p>
                  <p className="text-xs text-slate-400 mt-1">API/Browser</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">2</div>
                  <p className="font-semibold text-sm">AI Scoring</p>
                  <p className="text-xs text-slate-400 mt-1">ML Model</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">3</div>
                  <p className="font-semibold text-sm">Decision Logic</p>
                  <p className="text-xs text-slate-400 mt-1">Route/Filter</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">4</div>
                  <p className="font-semibold text-sm">Data Processed</p>
                  <p className="text-xs text-slate-400 mt-1">Transform</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">5</div>
                  <p className="font-semibold text-sm">CRM Updated</p>
                  <p className="text-xs text-slate-400 mt-1">API Sync</p>
                </div>
              </div>
              <p className="mt-6 text-center text-sm text-slate-400 italic">
                This workflow combines API calls, AI/ML inference, data processing, and decision logic—all running autonomously with monitoring and self-healing.
              </p>
            </div>
          </ScrollFadeInSection>
        </div>
        <ScrollFadeInSection className="mt-10 text-center">
          <button
            onClick={onBookDemo}
            className="inline-block px-6 py-3 text-base font-semibold text-slate-50 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Learn More
          </button>
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

const CostOfDoingNothing: React.FC<HeroProps> = ({ onBookDemo }) => {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">The Cost of Doing Nothing</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-300">
            Most businesses are built on <strong className="text-red-400">manual work done by people</strong>—fragile processes held together by stressed employees. We replace that with <strong className="text-primary">systems that run without you</strong>.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
              <div className="text-3xl font-bold text-primary mb-2">$31,250</div>
              <div className="text-slate-400 text-sm mb-3">Annual Leadership Drag</div>
              <p className="text-slate-300 text-sm">CEO at $250k/year spending 5 hours/week on admin = wasted executive salary</p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
              <div className="text-3xl font-bold text-primary mb-2">$10k–$50k</div>
              <div className="text-slate-400 text-sm mb-3">Monthly Revenue Leakage</div>
              <p className="text-slate-300 text-sm">Manual errors, delayed responses, and missed opportunities compound daily</p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
              <div className="text-3xl font-bold text-primary mb-2">30%</div>
              <div className="text-slate-400 text-sm mb-3">Margin Compression Risk</div>
              <p className="text-slate-300 text-sm">Gartner: Companies without AI-led ops face margin compression by 2026</p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <div className="text-slate-400 text-sm mb-3">Opportunity Cost</div>
              <p className="text-slate-300 text-sm">Your best minds stuck on repetitive tasks instead of growth strategy</p>
            </div>
          </ScrollFadeInSection>
        </div>
        <ScrollFadeInSection className="mt-10 text-center">
          <button
            onClick={onBookDemo}
            className="inline-block px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300"
          >
            Book a Systems Audit
          </button>
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

const SystemStressTest: React.FC<HeroProps> = ({ onBookDemo }) => {
  const fracturePoints = [
    {
      title: "Lead Lag",
      description: "This removes the delay between when a lead comes in and when they get a response. No more checking leads once a day—they're followed up in 60 seconds.",
      impact: "48-hour response time → 0% conversion. Our system responds the moment they accept."
    },
    {
      title: "Manual Data Entry",
      description: "This removes manual typing into your CRM. No more typos, no more lost deals from data errors.",
      impact: "5% error rate → $50k in lost revenue. Eliminated."
    },
    {
      title: "Hero Dependency",
      description: "This removes your business breaking when one person is unavailable. Systems run the same whether your star employee is there or on vacation.",
      impact: "Single point of failure → business risk. Eliminated."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">The 3 Fracture Points We Fix First</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-300">
            We've audited dozens of workflows. Here are the 3 "Fracture Points" that are killing your margins right now.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {fracturePoints.map((point, index) => (
            <ScrollFadeInSection key={index}>
              <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
                <div className="text-2xl font-bold text-primary mb-2">{point.title}</div>
                <p className="text-slate-300 mt-2">{point.description}</p>
                <div className="mt-4 p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
                  <p className="text-sm text-red-300 font-semibold">{point.impact}</p>
                </div>
              </div>
            </ScrollFadeInSection>
          ))}
        </div>
        <ScrollFadeInSection className="mt-10 text-center">
          <button
            onClick={onBookDemo}
            className="inline-block px-6 py-3 text-base font-semibold text-slate-50 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Learn More
          </button>
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

const BeforeAfter: React.FC = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">The Hero Culture vs. The Automated System</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            You don't buy automation—you buy peace of mind and a sellable business.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScrollFadeInSection>
            <div className="p-8 bg-red-900/10 border-2 border-red-800/50 rounded-xl h-full flex flex-col">
              <h3 className="text-2xl font-bold text-red-400 mb-4">The Hero Culture</h3>
              <ul className="space-y-3 text-slate-300 flex-grow">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>One person works late to fix mistakes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Manual entry → errors → slow responses → lost revenue</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Business breaks when key person is unavailable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Unpredictable, depends on one person</span>
                </li>
              </ul>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-green-900/10 border-2 border-green-800/50 rounded-xl h-full flex flex-col">
              <h3 className="text-2xl font-bold text-green-400 mb-4">The Automated System</h3>
              <ul className="space-y-3 text-slate-300 flex-grow">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Runs the same whether top performer is there or on vacation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Automated triage → instant response → booked meeting → zero manual work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Predictable, reliable, independent of one person</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Your business runs without you—truly sellable</span>
                </li>
              </ul>
            </div>
          </ScrollFadeInSection>
        </div>
          </div>
      </section>
  );
};



const Benefits: React.FC = () => {
  const whyChooseUs = [
      { icon: <Zap className="w-6 h-6" />, title: "Eliminate the Human Bottleneck", description: "You no longer need people for repetitive tasks. Your team focuses on strategy, not data entry." },
      { icon: <Shield className="w-6 h-6" />, title: "Guaranteed Outcomes", description: "You no longer need to guess if automation works. 99.9% uptime with measurable ROI." },
      { icon: <TrendingUp className="w-6 h-6" />, title: "Self-Healing Systems", description: "You no longer need to fix broken workflows. Systems repair themselves automatically." },
      { icon: <Building2 className="w-6 h-6" />, title: "Systems That Don't Break", description: "You no longer need to worry about fragile connections. We build systems that scale reliably." }
  ];

  const businessBenefits = [
      "You no longer spend 20+ hours/week on admin—reclaim that time for growth.",
      "You no longer lose revenue to manual errors—systems eliminate mistakes.",
      "You no longer need to hire more people as you grow—operations scale automatically.",
      "You no longer worry about downtime—99.9% uptime guarantees consistent revenue.",
      "You no longer need to be present for operations—your business runs independently."
  ];

  return (
      <section id="benefits" className="py-20 md:py-28 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <ScrollFadeInSection>
                      <div>
                          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">What You No Longer Need to Do</h2>
                          <p className="mt-4 text-lg text-slate-300">This removes repetitive work from your day. Your team focuses on growth, not manual tasks.</p>
                          <div className="mt-8 space-y-6">
                              {whyChooseUs.map((item, index) => (
                                  <div key={index} className="flex items-start space-x-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                                      <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg">
                                          {item.icon}
                                      </div>
                                      <div>
                                      <h3 className="font-semibold text-primary">{item.title}</h3>
                                      <p className="text-slate-400">{item.description}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </ScrollFadeInSection>

                  <ScrollFadeInSection>
                      <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg">
                          <h3 className="text-2xl font-bold text-slate-50">Financial Impact</h3>
                          <ul className="mt-6 space-y-4">
                              {businessBenefits.map((benefit, index) => (
                                  <li key={index} className="flex items-start space-x-3">
                                      <div className="flex-shrink-0 pt-1"><CheckCircleIcon /></div>
                                      <span className="text-slate-300 text-lg">{benefit}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </ScrollFadeInSection>
              </div>
          </div>
      </section>
  );
};

const ROIBlueprint: React.FC = () => {
  return (
    <section id="roi-blueprint" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">Real Examples: What This Eliminates</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Here's what gets removed from your daily work—with real numbers.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 max-w-4xl mx-auto space-y-8">
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl">
              <h3 className="text-2xl font-bold text-primary mb-4">Example: LinkedIn Prospecting</h3>
              <div className="space-y-4 text-slate-300">
                <p>
                  <strong className="text-slate-50">This eliminates:</strong> Manual LinkedIn prospecting. While competitors click through profiles, your system filters 1,000 prospects and sends 50 targeted requests automatically.
                </p>
                <p>
                  <strong className="text-slate-50">The math:</strong> A human takes 4 minutes per lead. At 100 leads/day, that's 6.6 hours of manual work. Eliminated.
                </p>
              </div>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl">
              <h3 className="text-2xl font-bold text-primary mb-4">Example: Real Estate Lead Processing</h3>
              <div className="space-y-4 text-slate-300">
                <p>
                  <strong className="text-slate-50">This eliminates:</strong> Manual lead processing. Handles 500 leads/day with 0% human input.
                </p>
                <p>
                  <strong className="text-slate-50">The math:</strong> Saves $12,000/month by removing the need for a full-time admin.
                </p>
              </div>
            </div>
          </ScrollFadeInSection>
          <p className="text-center text-slate-400 italic">
            These are real systems running in production—removing manual work every day.
          </p>
        </div>
      </div>
    </section>
  );
};

const SoftCtaSection: React.FC<HeroProps> = ({ onBookDemo }) => {
  return (
    <section className="py-16 bg-slate-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollFadeInSection>
          <button
            onClick={onBookDemo}
            className="inline-block px-8 py-4 text-lg font-semibold text-slate-50 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Book a Systems Audit
          </button>
          <p className="mt-3 text-sm text-slate-400">
            Takes 2 minutes. No commitment.
          </p>
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

const SevenDaySprint: React.FC<HeroProps> = ({ onBookDemo }) => {
  return (
    <section className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">The 7-Day Proof-of-Concept Sprint</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Your First Engine is on Us.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 max-w-3xl mx-auto">
          <ScrollFadeInSection>
            <div className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/50 rounded-xl">
              <div className="space-y-4 text-slate-300">
                <p className="text-lg text-center">
                  <strong className="text-slate-50">We don't do slide decks. We build real systems.</strong>
                </p>
                <p className="text-center">
                  Give us your most painful manual workflow. In 7 days, we'll show you it running automatically—at our expense.
                </p>
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-50 font-semibold mb-2">The 7-Day Sprint:</p>
                  <ul className="space-y-2 text-slate-300">
                    <li>✓ We automate your first bottleneck in 7 days</li>
                    <li>✓ No fee. No commitment.</li>
                    <li>✓ You see the ROI before investing</li>
                  </ul>
                </div>
                <div className="mt-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
                  <p className="text-sm text-red-300 font-semibold text-center">
                    ⚠️ For companies that can reclaim 500+ hours/year. 30 minutes with your Ops Lead to find the biggest impact.
                  </p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <button
                  onClick={onBookDemo}
                  className="inline-block px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Apply for the 7-Day Sprint
                </button>
                <p className="mt-3 text-sm text-slate-400">No commitment. No credit card.</p>
              </div>
            </div>
          </ScrollFadeInSection>
        </div>
      </div>
    </section>
  );
};

const FoundingPartner: React.FC<HeroProps> = ({ onBookDemo }) => {
  return (
    <section className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">The Founding Partner Program</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Because we are currently selecting our first 5 foundational partners for 2024, you aren't getting a junior account manager.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 max-w-3xl mx-auto">
          <ScrollFadeInSection>
            <div className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/50 rounded-xl">
              <div className="text-center mb-6">
                <div className="inline-block px-6 py-2 bg-primary/20 border border-primary/50 rounded-full">
                  <span className="text-2xl font-bold text-primary">3 of 5 spots remaining</span>
                </div>
              </div>
              <div className="space-y-4 text-slate-300">
                <p className="text-lg text-center">
                  <strong className="text-slate-50">You are getting the Founders—the architects themselves—building your system.</strong>
                </p>
                <p className="text-center">
                  Once we hit capacity, the price triples and the access decreases. This is your opportunity to work directly with the team that designed the protocol.
                </p>
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-50 font-semibold mb-2">Founding Partner Benefits:</p>
                  <ul className="space-y-2 text-slate-300">
                    <li>✓ Direct access to founders and architects</li>
                    <li>✓ Custom system design (not template-based)</li>
                    <li>✓ Locked-in pricing (no future increases)</li>
                    <li>✓ Priority support and optimization</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center">
                <button
                  onClick={onBookDemo}
                  className="inline-block px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Reserve Your Founding Partner Spot
                </button>
                <p className="mt-3 text-sm text-slate-400">No commitment. No credit card.</p>
              </div>
            </div>
          </ScrollFadeInSection>
        </div>
      </div>
    </section>
  );
};

const RiskReversal: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">Foundational Guarantee</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            We don't leave until your team is 100% autonomous on the new system.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
              <h3 className="text-xl font-bold text-primary mb-3">Zero-Downtime Commitment</h3>
              <p className="text-slate-300 mb-3">
                We deploy with zero disruption to your existing operations. Your business continues running while we integrate—no downtime, no risk.
              </p>
              <div className="p-3 bg-green-900/20 border border-green-800/50 rounded-lg">
                <p className="text-sm text-green-300 font-semibold">Impact: $0 revenue loss during integration vs. typical 2-3 day downtime</p>
              </div>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
              <h3 className="text-xl font-bold text-primary mb-3">No Vendor Lock-In + Data Ownership</h3>
              <p className="text-slate-300 mb-3">
                You own everything. Every automation comes with complete documentation. If you leave, you take the keys, the manual, and all your data.
              </p>
              <div className="p-3 bg-green-900/20 border border-green-800/50 rounded-lg">
                <p className="text-sm text-green-300 font-semibold">Impact: No migration costs, no data loss, full system portability</p>
              </div>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
              <h3 className="text-xl font-bold text-primary mb-3">Systems That Don't Break</h3>
              <p className="text-slate-300 mb-3">
                This removes worry about fragile connections. We build systems that adapt when tools change—no breaking, no fixing needed.
              </p>
              <div className="p-3 bg-green-900/20 border border-green-800/50 rounded-lg">
                <p className="text-sm text-green-300 font-semibold">Impact: 99.9% uptime = $50k+ saved annually vs. typical 5% failure rate</p>
              </div>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
              <h3 className="text-xl font-bold text-primary mb-3">Ongoing Optimization</h3>
              <p className="text-slate-300 mb-3">
                We don't just deploy and disappear. We monitor, optimize, and improve your systems continuously—included in your partnership.
              </p>
              <div className="p-3 bg-green-900/20 border border-green-800/50 rounded-lg">
                <p className="text-sm text-green-300 font-semibold">Impact: 20-30% efficiency gains over time through continuous improvement</p>
              </div>
            </div>
          </ScrollFadeInSection>
        </div>
        <ScrollFadeInSection className="mt-12 max-w-3xl mx-auto">
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
            <h3 className="text-lg font-bold text-primary mb-3">Real Example: Real Estate Lead Processing</h3>
            <p className="text-slate-300 text-sm mb-2">
              <strong>Challenge:</strong> Manual processing of 500 leads/day with 5% error rate costing $12k/month in admin time.
            </p>
            <p className="text-slate-300 text-sm mb-2">
              <strong>Solution:</strong> Automated AI-powered classification, data extraction, and routing with validation checks.
            </p>
            <p className="text-slate-300 text-sm">
              <strong>Result:</strong> 0% error rate, $12k/month saved, 100% automated—system runs 24/7 without human input.
            </p>
          </div>
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

const ConsultantVsVendor: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">Consultant vs. Vendor: Why We're Not Another SaaS</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Zapier is a tool you configure. We build systems that run. Tools break when apps change; our systems adapt automatically.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollFadeInSection>
              <div className="p-8 bg-red-900/10 border-2 border-red-800/50 rounded-xl h-full flex flex-col">
                <h3 className="text-2xl font-bold text-red-400 mb-4">The $500 Zapier Setup</h3>
                <ul className="space-y-3 text-slate-300 flex-grow">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span><strong>Tool-based:</strong> Connects apps, breaks when apps change</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span><strong>Amateur setup:</strong> No error handling, no self-healing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span><strong>Maintenance trap:</strong> Most break within 30 days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span><strong>One-time setup:</strong> No optimization, no improvement</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-300">Cost: $500 upfront + ongoing breakage</p>
                </div>
              </div>
            </ScrollFadeInSection>
            <ScrollFadeInSection>
              <div className="p-8 bg-green-900/10 border-2 border-green-800/50 rounded-xl h-full flex flex-col">
                <h3 className="text-2xl font-bold text-green-400 mb-4">The OneEye Engine</h3>
                <ul className="space-y-3 text-slate-300 flex-grow">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Self-healing:</strong> Systems adapt when tools change</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Error handling:</strong> Systems repair themselves</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Zero maintenance:</strong> You don't fix anything</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Ongoing improvement:</strong> We optimize continuously</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-300">ROI: $12k+ monthly savings, zero breakage</p>
                </div>
              </div>
            </ScrollFadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
};


const WhatWeHandleVsYouDont: React.FC<HeroProps> = ({ onBookDemo }) => {
  return (
    <section id="what-we-handle" className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">
            What We Handle vs. What You Don't
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            We are not a SaaS tool and not a consulting deck. We are a done-for-you automation partner that owns your systems end-to-end.
          </p>
        </ScrollFadeInSection>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollFadeInSection>
            <div className="p-8 bg-red-900/10 border-2 border-red-800/50 rounded-xl h-full">
              <h3 className="text-2xl font-bold text-red-400 mb-6">You Don't</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Learn tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Fix broken workflows</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Maintain scripts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Monitor failures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Update logic</span>
                </li>
              </ul>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-green-900/10 border-2 border-green-800/50 rounded-xl h-full">
              <h3 className="text-2xl font-bold text-green-400 mb-6">We Do</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Design workflows</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Build automation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Monitor & fix</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Improve continuously</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Handle failures</span>
                </li>
              </ul>
            </div>
          </ScrollFadeInSection>
        </div>
        <div className="mt-12 text-center">
          <button
            onClick={onBookDemo}
            className="inline-block px-6 py-3 text-base font-semibold text-slate-50 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

const FoundersNote: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection>
          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Why We Build</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-4">
              In a startup, you're not just buying automation—you're buying <strong>the founders' vision</strong>. We built TheOneEye because we watched too many founders burn out managing people to do what machines do better.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed mb-4">
              Every system we build is designed with one question in mind: <strong>"Can this business run without the founder?"</strong> If the answer is no, we haven't done our job.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed">
              We're not here to sell you tools. We're here to build infrastructure that makes your business <strong>independent, scalable, and sellable</strong>—whether you're in the office or on a beach.
            </p>
            <p className="mt-6 text-slate-400 italic">
              — The OneEye Team
            </p>
          </div>
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-700 py-6">
      <button onClick={onClick} className="w-full flex justify-between items-center text-left">
        <h3 className="text-lg font-medium text-slate-50">{question}</h3>
        <svg
          className={`w-6 h-6 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
        <p className="text-slate-300">
          {answer}
        </p>
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    { 
      question: "Why should I pay for a custom build vs. a $500 Zapier setup?", 
      answer: "Zapier is a tool that connects apps—it breaks when apps change. We build engines with self-healing error handling and systems that don't break. Most $500 automations break within 30 days. Our systems monitor and repair themselves automatically. The difference? Tools require maintenance; infrastructure runs itself. See our 'Consultant vs. Vendor' section for a detailed comparison." 
    },
    { 
      question: "Do clients need technical knowledge to use TheOneEye?", 
      answer: "No. Clients only define the outcomes they want; we handle everything else. You don't need to understand how it's built—you just need to know what results you want. We build, deploy, and maintain the entire system." 
    },
    { 
      question: "What if a workflow breaks?", 
      answer: "Our systems are built with self-healing error handling. They monitor themselves and repair automatically. We also provide 24/7 monitoring and support. Any issues are fixed immediately by our team—often before you even notice." 
    },
    { 
      question: "Can TheOneEye handle complex, multi-step workflows?", 
      answer: "Yes. We specialize in designing end-to-end automation infrastructure that combines multiple systems, AI models, and processes. We don't just connect tools—we build industrial-grade systems that scale with your business." 
    },
    { 
      question: "What if I want to leave? Do I lose everything?", 
      answer: "No vendor lock-in. Every automation we build comes with complete documentation and Standard Operating Procedures. If you ever leave us, you own the keys and the manual. We believe in building systems you can own, not rent." 
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">Frequently Asked Questions</h2>
        </ScrollFadeInSection>
        <ScrollFadeInSection className="mt-12">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

interface CtaProps {
  onBookDemo: () => void;
}

const Cta: React.FC<CtaProps> = ({ onBookDemo }) => {
  return (
      <section className="py-20 md:py-28 bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <ScrollFadeInSection>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-slate-50 tracking-tight">Scale Without Headcount</h2>
                  <p className="mt-4 text-xl md:text-2xl text-primary">
                      Apply for a Systems Audit and discover how to eliminate the human bottleneck in your operations.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                      <button
                          onClick={onBookDemo}
                          className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary">
                          Apply for a Systems Audit
                      </button>
                      <Link href="/contact" className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-slate-50 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500">
                          Contact Us
                      </Link>
                  </div>
              </ScrollFadeInSection>
          </div>
      </section>
  );
};

const Footer: React.FC = () => {
  return (
      <footer className="bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div>
                      <h3 className="text-slate-50 font-semibold mb-4">TheOneEye</h3>
                      <p className="text-slate-400 text-sm">
                          Industrial-grade automation infrastructure for scale-ready businesses.
                      </p>
                  </div>
                  <div>
                      <h3 className="text-slate-50 font-semibold mb-4">Legal</h3>
                      <ul className="space-y-2 text-sm">
                          <li><Link href="/privacy" className="text-slate-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
                          <li><Link href="/terms" className="text-slate-400 hover:text-primary transition-colors">Terms of Service</Link></li>
                      </ul>
                  </div>
                  <div>
                      <h3 className="text-slate-50 font-semibold mb-4">Company</h3>
                      <ul className="space-y-2 text-sm">
                          <li><Link href="/about" className="text-slate-400 hover:text-primary transition-colors">About</Link></li>
                          <li><Link href="/contact" className="text-slate-400 hover:text-primary transition-colors">Contact</Link></li>
                      </ul>
                  </div>
                  <div>
                      <h3 className="text-slate-50 font-semibold mb-4">Connect</h3>
                      <div className="flex gap-4">
                          <a href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="LinkedIn">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                          </a>
                          <a href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="Twitter">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                          </a>
                          <a href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="GitHub">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          </a>
                      </div>
                  </div>
              </div>
              <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} TheOneEye. All rights reserved.</p>
              </div>
          </div>
      </footer>
  );
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <main className="flex flex-col gap-10">
      <NavBar onBookDemo={handleOpenModal} />
      <main>
        <HeroSection onBookDemo={handleOpenModal} />
        <LightSocialProof />
        <QuickLinks />
        <DailyLifeFit />
        <SystemStressTest onBookDemo={handleOpenModal} />
        <SimpleWorkflowExample onBookDemo={handleOpenModal} />
        <CostOfDoingNothing onBookDemo={handleOpenModal} />
        <BeforeAfter />
        <Services />
        <Process />
        <OwnershipSection />
        <ROIBlueprint />
        <PlatformAuthority />
        <RiskReversal />
        <ConsultantVsVendor />
        <WhatWeHandleVsYouDont onBookDemo={handleOpenModal} />
        <FoundersNote />
        <Faq />
        <SoftCtaSection onBookDemo={handleOpenModal} />
        <SevenDaySprint onBookDemo={handleOpenModal} />
        <FoundingPartner onBookDemo={handleOpenModal} />
        <Cta onBookDemo={handleOpenModal} />
      </main>
      <Footer />
      <StickyCTA onBookDemo={handleOpenModal} />
      <DemoModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  );
}