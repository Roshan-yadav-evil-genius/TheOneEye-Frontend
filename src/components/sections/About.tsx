"use client";
import React from 'react';
import ScrollFadeInSection from '@/components/common/ScrollFadeInSection';
import { CheckIcon } from 'lucide-react';

const About: React.FC = () => {
  const missionPoints = [
    "Build industrial-grade infrastructure, not fragile task automation.",
    "Eliminate the human bottleneck through self-healing systems.",
    "Deliver measurable ROI with 99.9% uptime guarantees.",
    "Build systems you own, not rent—no vendor lock-in.",
    "Enable businesses to scale revenue without scaling headcount.",
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <ScrollFadeInSection>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">About TheOneEye</h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                At <strong>TheOneEye</strong>, we are <strong>consultants, not vendors</strong>. We don't sell automation tools—we build <strong>industrial-grade automation systems</strong> that eliminate the human bottleneck in your operations.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                We replace fragile, human-dependent processes with <strong>self-healing systems</strong> designed for enterprise scale. Our infrastructure delivers <strong>99.9% uptime</strong> with <strong>$0 marginal cost per transaction</strong>—enabling you to scale revenue without scaling headcount.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                We build systems you <strong>own, not rent</strong>. Every automation comes with complete documentation and Standard Operating Procedures. No vendor lock-in. Just systems that don't break and guaranteed outcomes.
              </p>
            </div>
          </ScrollFadeInSection>

          <div className="space-y-12">
            <ScrollFadeInSection>
              <div className="space-y-4 p-6 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-primary">Our Vision</h3>
                <p className="text-slate-300">
                  Our vision is to make business operations <strong>independent and automated</strong>—where companies can scale to $50M+ without doubling headcount. We envision a world where founders can exit their businesses knowing operations run perfectly without them, where <strong>reliable systems</strong> replace task automation, and where <strong>self-healing infrastructure</strong> eliminates the human bottleneck forever.
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

export default About;

