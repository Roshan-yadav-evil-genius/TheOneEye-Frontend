"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import NavBar from "@/components/global/NavBar";
import { HiOutlineUserGroup, HiOutlineCog, HiOutlineSpeakerphone, HiOutlineSupport } from "react-icons/hi";
import ScrollFadeInSection from '@/components/common/ScrollFadeInSection';
import { CheckCircleIcon, CheckIcon } from 'lucide-react';
import DemoModal from '@/components/common/DemoModal';

interface HeroProps {
  onBookDemo: () => void;
}

const HeroSection: React.FC<HeroProps> = ({ onBookDemo }) => {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] sm:w-[150%] sm:h-[150%] lg:w-[100%] lg:h-[100%] rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollFadeInSection>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-50 tracking-tighter">
            <span className="block">Scale to $5M–$50M</span>
            <span className="block text-primary">Without Doubling Your Headcount.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-300">
            We replace fragile, human-dependent processes with industrial-grade algorithmic infrastructure. Stop managing people to do what engines do better.
          </p>
              <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={onBookDemo}
              className="inline-block px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary"
            >
              Apply for a 7-Day Proof-of-Concept
            </button>
          </div>
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
      description: 'Identify hidden costs and inefficiencies that drain your revenue. We audit your operations like finding a hole in a gold mine—urgent, precise, and profit-focused.'
    },
    {
      number: '02',
      title: 'Architectural Design',
      description: 'Build industrial-grade infrastructure, not fragile connections. We design systems with architectural integrity that scale without breaking.'
    },
    {
      number: '03',
      title: 'Seamless Integration',
      description: 'Zero-downtime deployment with self-healing error handling. Your business continues operating while we integrate—no disruption, no risk.'
    },
    {
      number: '04',
      title: 'Guaranteed Outcomes',
      description: 'Measurable results with 99.9% uptime and $0 marginal cost per transaction. We deliver predictable ROI, not promises.'
    }
  ];

  return (
    <section id="process" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">The OneEye Integration Protocol</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            A proven framework for building industrial-grade automation infrastructure that scales without headcount.
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


const Services: React.FC = () => {

  const services = [
      { 
        icon: <HiOutlineUserGroup className="text-3xl" />, 
        title: "Zero-Leak Sales Pipelines", 
        description: "Industrial-grade lead infrastructure that captures, qualifies, and converts every opportunity with 0% human input. Eliminate revenue leakage from manual entry errors." 
      },
      { 
        icon: <HiOutlineCog className="text-3xl" />, 
        title: "Human Bottleneck Elimination", 
        description: "Self-healing operational architecture that synchronizes data, manages approvals, and generates reports without human intervention. Scale operations without scaling headcount." 
      },
      { 
        icon: <HiOutlineSpeakerphone className="text-3xl" />, 
        title: "Automated Revenue Acceleration", 
        description: "Algorithmic marketing infrastructure that segments audiences, personalizes campaigns, and tracks performance at scale. Generate revenue while you sleep." 
      },
      { 
        icon: <HiOutlineSupport className="text-3xl" />, 
        title: "24/7 Resolution Engines", 
        description: "Intelligent support infrastructure that routes, responds, and resolves tickets automatically. Never lose a customer to delayed response times again." 
      }
  ];

  return (
      <section id="services" className="py-20 md:py-28 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollFadeInSection className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">Industrial-Grade Infrastructure</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
                      We build engines, not tools. Self-healing systems designed for 99.9% uptime and zero marginal cost per transaction.
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
              <ScrollFadeInSection className="mt-12 text-center">
                  <blockquote className="max-w-3xl mx-auto p-6 border-l-4 border-primary bg-slate-800/50 rounded-r-lg">
                      <p className="text-lg italic text-slate-300">
                          "We don't build tools. We architect infrastructure. A tool breaks; an engine heals itself."
                      </p>
                  </blockquote>
              </ScrollFadeInSection>
          </div>
      </section>
  );
};

const PlatformAuthority: React.FC = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">Built on Industry-Standard Infrastructure</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            We leverage the world's most advanced algorithmic models from OpenAI and Anthropic to build your infrastructure. We don't experiment with unproven tech; we deploy industry-standard power.
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
            Certified Architects of enterprise-grade algorithmic infrastructure
          </p>
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

const CostOfDoingNothing: React.FC<HeroProps> = ({ onBookDemo }) => {
  return (
    <section className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">The Cost of Doing Nothing</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            You aren't just losing money on labor; you're losing the opportunity cost of your best minds.
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
            Calculate Your Hidden Costs
          </button>
        </ScrollFadeInSection>
      </div>
    </section>
  );
};

const SystemStressTest: React.FC = () => {
  const fracturePoints = [
    {
      title: "Lead Lag",
      description: "Delayed response times kill conversion rates. Every hour a lead sits unqualified costs you revenue. We eliminate the lag with instant algorithmic triage.",
      impact: "48-hour response time on a LinkedIn connection → 0% conversion. Our system ensures the moment they accept, they receive a personalized follow-up."
    },
    {
      title: "Manual Data Entry",
      description: "Human error accumulates exponentially. One typo in a CRM becomes a lost deal. We eliminate manual entry with self-healing data pipelines.",
      impact: "5% error rate → $50k in lost revenue"
    },
    {
      title: "Hero Dependency",
      description: "Your business breaks when your top performer is unavailable. We build systems that run identically whether your star employee is there or on vacation.",
      impact: "Single point of failure → business risk"
    }
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">The 3 Fracture Points We Fix First</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Not sure if your business is ready for automation? We've audited dozens of workflows. Here are the 3 'Fracture Points' we look for first...
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
      </div>
    </section>
  );
};

const BeforeAfter: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">The Hero Culture vs. The Sovereign System</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            High-ticket buyers don't buy automation—they buy peace of mind and sellability.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScrollFadeInSection>
            <div className="p-8 bg-red-900/10 border-2 border-red-800/50 rounded-xl h-full flex flex-col">
              <h3 className="text-2xl font-bold text-red-400 mb-4">The Hero Culture</h3>
              <ul className="space-y-3 text-slate-300 flex-grow">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Everything relies on a 'hero' employee working late to fix mistakes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Manual Lead Entry → Human Error → 48-hour response time → Lost Revenue</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Business breaks when key person is unavailable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  <span>Unpredictable, dependent on individual heroics</span>
                </li>
              </ul>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-green-900/10 border-2 border-green-800/50 rounded-xl h-full flex flex-col">
              <h3 className="text-2xl font-bold text-green-400 mb-4">The Sovereign System</h3>
              <ul className="space-y-3 text-slate-300 flex-grow">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Business runs exactly the same whether top performer is there or on vacation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Algorithmic Lead Triage → Instant Personalized Response → Booked Meeting → $0 Manual Effort</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Predictable, reliable, independent of individual heroics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Your business can run without you—true sellability</span>
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
      { title: "Eliminate the Human Bottleneck", description: "We remove the dependency on people for repetitive tasks. Your team focuses on strategy, not data entry." },
      { title: "Guaranteed Outcomes", description: "We deliver measurable ROI, not promises. 99.9% uptime with $0 marginal cost per transaction." },
      { title: "Self-Healing Infrastructure", description: "Our systems adapt and repair automatically. No manual intervention required as your business scales." },
      { title: "Architectural Integrity", description: "We build infrastructure that doesn't break. Industrial-grade systems designed for enterprise scale." }
  ];

  const businessBenefits = [
      "Reclaim 20+ hours/week: Your leadership team focuses on growth, not admin.",
      "Zero human error: Self-healing systems eliminate manual mistakes that cost revenue.",
      "Infinite scalability: Operations grow without proportional headcount increases.",
      "Predictable performance: 99.9% uptime guarantees consistent revenue generation.",
      "Sellable business: Your company runs independently—true exit value."
  ];

  return (
      <section id="benefits" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <ScrollFadeInSection>
                      <div>
                          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">Eliminate the Human Bottleneck</h2>
                          <p className="mt-4 text-lg text-slate-300">We don't automate tasks—we architect infrastructure that eliminates the need for human intervention in repetitive processes.</p>
                          <div className="mt-8 space-y-6">
                              {whyChooseUs.map((item, index) => (
                                  <div key={index} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                                      <h3 className="font-semibold text-primary">{item.title}</h3>
                                      <p className="text-slate-400">{item.description}</p>
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
    <section id="roi-blueprint" className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">The ROI Blueprint: How We Architect $X Million Operations</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Our Architectural Standard: We build systems designed for 99.9% uptime and $0 marginal cost per lead.
          </p>
        </ScrollFadeInSection>
        <div className="mt-12 max-w-4xl mx-auto space-y-8">
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl">
              <h3 className="text-2xl font-bold text-primary mb-4">Example: Autonomous Prospecting Engine (LinkedIn)</h3>
              <div className="space-y-4 text-slate-300">
                <p>
                  <strong className="text-slate-50">System Logic:</strong> While your competitors are manually clicking through LinkedIn profiles, your engine has already filtered 1,000 prospects and sent 50 targeted requests before your morning coffee is cold.
                </p>
                <p>
                  <strong className="text-slate-50">The Math:</strong> A human SDR takes 4 minutes to qualify and message one LinkedIn lead. At 100 leads a day, that's 6.6 hours of manual labor. Our engine does this in seconds for $0 marginal cost.
                </p>
                <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-slate-50 font-semibold">Architectural Components:</p>
                  <ul className="mt-2 space-y-2 text-slate-300">
                    <li>• Heuristic Filtering: Automatically filters prospects by 300+ connections and industry criteria</li>
                    <li>• Algorithmic Qualification: Instant lead scoring and routing</li>
                    <li>• Personalized Messaging: Context-aware responses in &lt;60 seconds</li>
                    <li>• Self-Healing Workflows: System adapts when LinkedIn changes its interface</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl">
              <h3 className="text-2xl font-bold text-primary mb-4">Example: Real Estate Lead Processing System</h3>
              <div className="space-y-4 text-slate-300">
                <p>
                  <strong className="text-slate-50">System Logic:</strong> We designed this infrastructure to handle 500 leads/day with 0% human input.
                </p>
                <p>
                  <strong className="text-slate-50">The Math:</strong> At $25/hour for a human admin working 8 hours/day, this system generates $12,000 in monthly savings.
                </p>
                <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-slate-50 font-semibold">Architectural Components:</p>
                  <ul className="mt-2 space-y-2 text-slate-300">
                    <li>• Algorithmic Lead Triage: Instant qualification and routing</li>
                    <li>• CRM Auto-Population: Zero manual data entry</li>
                    <li>• Personalized Follow-up: Context-aware responses in &lt;60 seconds</li>
                    <li>• Self-Healing Error Handling: System repairs itself automatically</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollFadeInSection>
          <p className="text-center text-slate-400 italic">
            This is the architecture we build. Not a tool you configure—an infrastructure that runs your business.
          </p>
        </div>
      </div>
    </section>
  );
};

const FoundingPartner: React.FC<HeroProps> = ({ onBookDemo }) => {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">The Proof of Concept Protocol</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Your First Engine is on Us.
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
                  <strong className="text-slate-50">We don't do 'demos' with slide decks. We do demos with production-ready infrastructure.</strong>
                </p>
                <p className="text-center">
                  Give us your most painful manual workflow today, and in 7 days, we will show you the engine running in your environment—at our own expense.
                </p>
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-50 font-semibold mb-2">The 7-Day Rapid Prototype Sprint:</p>
                  <ul className="space-y-2 text-slate-300">
                    <li>✓ We automate your first manual bottleneck in 7 days</li>
                    <li>✓ No fee. No commitment. We let the infrastructure speak for itself</li>
                    <li>✓ Whether it's an <strong className="text-slate-50">Autonomous Prospecting Engine</strong> that scrapes and qualifies 1,000 LinkedIn leads or a <strong className="text-slate-50">Zero-Leak Billing Pipeline</strong></li>
                    <li>✓ You see the ROI before you invest a dollar</li>
                  </ul>
                </div>
                <div className="mt-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
                  <p className="text-sm text-red-300 font-semibold text-center">
                    ⚠️ We only offer the 7-Day Sprint to companies that have the potential to reclaim 500+ hours a year. We need 30 minutes with your Ops Lead to identify the 'Fracture Point' where we can have the most immediate financial impact.
                  </p>
                </div>
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-50 font-semibold mb-2">Founding Partner Benefits (After Sprint):</p>
                  <ul className="space-y-2 text-slate-300">
                    <li>✓ Direct access to founders and architects</li>
                    <li>✓ Custom system design (not template-based)</li>
                    <li>✓ Locked-in pricing (no future increases)</li>
                    <li>✓ Priority support and optimization</li>
                    <li>✓ Once we hit capacity, the price triples and the access decreases</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center">
                <button
                  onClick={onBookDemo}
                  className="inline-block px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Apply for the 7-Day Sprint
                </button>
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
              <p className="text-slate-300">
                We deploy with zero disruption to your existing operations. Your business continues running while we integrate—no downtime, no risk.
              </p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
              <h3 className="text-xl font-bold text-primary mb-3">No Vendor Lock-In + Data Ownership</h3>
              <p className="text-slate-300">
                Every automation we build comes with a 'Standard Operating Procedure' for your infrastructure. Every prospect your engine qualifies is synced directly to your private CRM. You own the assets; we just build the engine that mines them. If you ever leave us, you own the keys, the manual, and all your data.
              </p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
              <h3 className="text-xl font-bold text-primary mb-3">Architectural Integrity</h3>
              <p className="text-slate-300">
                We build systems that integrate seamlessly with your existing infrastructure. No breaking changes, no technical debt. LinkedIn changes its interface often—our self-healing infrastructure adapts automatically while cheap Zapier setups break.
              </p>
            </div>
          </ScrollFadeInSection>
          <ScrollFadeInSection>
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full">
              <h3 className="text-xl font-bold text-primary mb-3">Ongoing Optimization</h3>
              <p className="text-slate-300">
                We don't just deploy and disappear. We monitor, optimize, and improve your systems continuously—included in your partnership.
              </p>
            </div>
          </ScrollFadeInSection>
        </div>
      </div>
    </section>
  );
};

const ConsultantVsVendor: React.FC = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">Consultant vs. Vendor: Why We're Not Another SaaS</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Zapier is a tool. We build Engines. A tool in the hands of an amateur creates a mess; an engine built by an architect creates a fortune.
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
                    <span><strong>Infrastructure:</strong> Self-healing systems that adapt to changes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Architectural design:</strong> Error-handling logic that heals itself</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Zero maintenance:</strong> Systems monitor and repair automatically</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Ongoing optimization:</strong> Continuous improvement included</span>
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


const About: React.FC = () => {
  const missionPoints = [
    "Architect industrial-grade infrastructure, not fragile task automation.",
    "Eliminate the human bottleneck through self-healing systems.",
    "Deliver measurable ROI with 99.9% uptime guarantees.",
    "Build systems you own, not rent—no vendor lock-in.",
    "Enable businesses to scale revenue without scaling headcount.",
  ];

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <ScrollFadeInSection>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">About TheOneEye</h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                At <strong>TheOneEye</strong>, we are <strong>consultants, not vendors</strong>. We don't sell automation tools—we architect <strong>industrial-grade algorithmic infrastructure</strong> that eliminates the human bottleneck in your operations.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                We replace fragile, human-dependent processes with <strong>self-healing systems</strong> designed for enterprise scale. Our infrastructure delivers <strong>99.9% uptime</strong> with <strong>$0 marginal cost per transaction</strong>—enabling you to scale revenue without scaling headcount.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                We build systems you <strong>own, not rent</strong>. Every automation comes with complete documentation and Standard Operating Procedures. No vendor lock-in. Just architectural integrity and guaranteed outcomes.
              </p>
            </div>
          </ScrollFadeInSection>

          <div className="space-y-12">
            <ScrollFadeInSection>
              <div className="space-y-4 p-6 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-primary">Our Vision</h3>
                <p className="text-slate-300">
                  Our vision is to make business operations <strong>sovereign and independent</strong>—where companies can scale to $50M+ without doubling headcount. We envision a world where founders can exit their businesses knowing operations run perfectly without them, where <strong>architectural integrity</strong> replaces task automation, and where <strong>self-healing infrastructure</strong> eliminates the human bottleneck forever.
                </p>
              </div>
            </ScrollFadeInSection>
            
            <ScrollFadeInSection>
              <div className="space-y-4 p-6 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-primary">Our Mission</h3>
                <ul className="space-y-3">
                  {missionPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckIcon />
                      <span className="text-slate-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollFadeInSection>
          </div>
        </div>
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
      answer: "Zapier is a tool that connects apps—it breaks when apps change. We build engines with self-healing error handling and architectural integrity. Most $500 automations break within 30 days. Our systems monitor and repair themselves automatically. The difference? Tools require maintenance; infrastructure runs itself. See our 'Consultant vs. Vendor' section for a detailed comparison." 
    },
    { 
      question: "Do clients need technical knowledge to use TheOneEye?", 
      answer: "No. Clients only define the outcomes they want; we handle everything else. You don't need to understand the architecture—you just need to know what results you want. We build, deploy, and maintain the entire system." 
    },
    { 
      question: "What if a workflow breaks?", 
      answer: "Our systems are built with self-healing error handling. They monitor themselves and repair automatically. We also provide 24/7 monitoring and support. Any issues are fixed immediately by our team—often before you even notice." 
    },
    { 
      question: "Can TheOneEye handle complex, multi-step workflows?", 
      answer: "Yes. We specialize in designing end-to-end automation infrastructure that combines multiple systems, AI models, and processes. We don't just connect tools—we architect industrial-grade systems that scale with your business." 
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
    <section id="faq" className="py-20 md:py-28">
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
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-slate-400">
              <p>&copy; {new Date().getFullYear()} TheOneEye. All rights reserved.</p>
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
      <NavBar />
      <main>
        <HeroSection onBookDemo={handleOpenModal} />
        <Process />
        <Services />
        <PlatformAuthority />
        <CostOfDoingNothing onBookDemo={handleOpenModal} />
        <SystemStressTest />
        <BeforeAfter />
        <Benefits />
        <ROIBlueprint />
        <FoundingPartner onBookDemo={handleOpenModal} />
        <RiskReversal />
        <ConsultantVsVendor />
        <Faq />
        <Cta onBookDemo={handleOpenModal} />
        <About />
      </main>
      <Footer />
      <DemoModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  );
}