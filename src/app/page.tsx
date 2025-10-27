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
            <span className="block">We do the busy work,</span>
            <span className="block text-primary">so you can do the important work.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-300">
            TheOneEye builds and maintains end-to-end automations that deliver real business outcomes — without the hassle of setup, updates, or monitoring.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={onBookDemo}
              className="inline-block px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary"
            >
              Book a Demo
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
      title: 'Discovery',
      description: 'Understand your business, goals, bottlenecks, and repetitive tasks. Identify areas where automation will deliver the highest impact.'
    },
    {
      number: '02',
      title: 'Design & Build',
      description: 'Create a tailored workflow that fits your exact processes. Use the best combination of AI, scripts, and automation tools.'
    },
    {
      number: '03',
      title: 'Deploy & Maintain',
      description: 'Launch the workflow and continuously monitor performance. Handle updates, errors, and improvements — clients never touch a line of code.'
    },
    {
      number: '04',
      title: 'Deliver Value',
      description: 'Provide hands-free results that are measurable, consistent, and reliable. Free your team to focus on high-value tasks.'
    }
  ];

  return (
    <section id="process" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">How TheOneEye Works</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            We follow a structured, client-focused process to ensure success.
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
        title: "Lead Management", 
        description: "Automatically capture, enter, and update leads in your CRM, trigger follow-ups, and generate reports." 
      },
      { 
        icon: <HiOutlineCog className="text-3xl" />, 
        title: "Operations", 
        description: "Streamline approvals, data synchronization between tools, reporting, and workflow management." 
      },
      { 
        icon: <HiOutlineSpeakerphone className="text-3xl" />, 
        title: "Marketing", 
        description: "Manage email campaigns, social media outreach, audience segmentation, and performance tracking." 
      },
      { 
        icon: <HiOutlineSupport className="text-3xl" />, 
        title: "Customer Support", 
        description: "Route tickets, trigger smart responses, and ensure timely communication automatically." 
      }
  ];

  return (
      <section id="services" className="py-20 md:py-28 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollFadeInSection className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">What We Automate</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
                      Our solutions cover a wide range of repetitive business processes.
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
                          "Any repetitive, predictable, measurable task can be automated — if it slows your team down, we fix it."
                      </p>
                  </blockquote>
              </ScrollFadeInSection>
          </div>
      </section>
  );
};



const Benefits: React.FC = () => {
  const whyChooseUs = [
      { title: "We manage it fully", description: "Clients don’t maintain scripts, dashboards, or automation platforms." },
      { title: "Outcome-focused", description: "Our goal is to deliver tangible results, not just tools." },
      { title: "Continuous optimization", description: "Workflows adapt as your business grows." },
      { title: "Client-first approach", description: "Remove headaches, save time, and increase efficiency." }
  ];

  const businessBenefits = [
      "Save Time: Reduce hours spent on repetitive manual tasks.",
      "Increase Accuracy: Minimize human error in critical workflows.",
      "Scalable Operations: Automations grow with your business.",
      "Consistent Output: Predictable and reliable results every time.",
      "Stress-Free Maintenance: Focus on your goals, we handle everything else."
  ];

  return (
      <section id="benefits" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <ScrollFadeInSection>
                      <div>
                          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">Why Clients Choose TheOneEye</h2>
                          <p className="mt-4 text-lg text-slate-300">TheOneEye is more than automation — it’s a silent partner that keeps your business running smoothly.</p>
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
                          <h3 className="text-2xl font-bold text-slate-50">Benefits to Your Business</h3>
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

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "TheOneEye completely transformed our operations. Our team now focuses on strategy while all repetitive work runs automatically.",
      author: "Happy Client"
    },
    {
      quote: "Predictable results and zero maintenance — TheOneEye is like having an invisible operations team.",
      author: "Satisfied Customer"
    }
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">What Our Clients Say</h2>
        </ScrollFadeInSection>
        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollFadeInSection key={index}>
              <figure className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl h-full flex flex-col justify-between">
                <blockquote className="text-slate-300">
                  <p>“{testimonial.quote}”</p>
                </blockquote>
                <figcaption className="mt-6">
                  <div className="font-semibold text-primary">— {testimonial.author}</div>
                </figcaption>
              </figure>
            </ScrollFadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};


const About: React.FC = () => {
  const missionPoints = [
    "Deliver measurable outcomes for every automated workflow.",
    "Take full responsibility for setup, maintenance, and optimization.",
    "Simplify business operations, removing technical headaches.",
    "Continuously improve workflows as your business evolves.",
    "Empower teams to focus on creativity, strategy, and growth.",
  ];

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <ScrollFadeInSection>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">About TheOneEye</h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                At <strong>TheOneEye</strong>, we help businesses <strong>focus on growth, strategy, and innovation</strong> — not repetitive tasks, inefficiencies, or operational headaches. We are a <strong>Managed Automation-as-a-Service provider</strong>, creating, running, and maintaining intelligent workflows that deliver <strong>predictable, measurable results</strong>.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                Whether it’s lead generation, reporting, marketing campaigns, or customer support workflows, our solutions let your team focus on <strong>what truly matters</strong>. We take full ownership — from setup and deployment to ongoing monitoring and optimization — so you <strong>get results without the technical burden</strong>.
              </p>
            </div>
          </ScrollFadeInSection>

          <div className="space-y-12">
            <ScrollFadeInSection>
              <div className="space-y-4 p-6 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-primary">Our Vision</h3>
                <p className="text-slate-300">
                  Our vision is to make automation <strong>intelligent, effortless, and outcome-driven</strong>, empowering businesses of all sizes to scale <strong>without chaos or wasted effort</strong>. We envision a world where teams can stop worrying about repetitive work and instead focus on innovation, strategy, and building value — while technology silently powers their success.
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
    { question: "Do clients need technical knowledge to use TheOneEye?", answer: "No. Clients only define the outcomes they want; we handle everything else." },
    { question: "What if a workflow breaks?", answer: "We monitor and maintain all workflows 24/7. Any issues are fixed immediately by our team." },
    { question: "Can TheOneEye handle complex, multi-step workflows?", answer: "Yes. We specialize in designing end-to-end automations that combine multiple systems, tools, and processes." }
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
                  <h2 className="text-3xl md:text-5xl font-extrabold text-slate-50 tracking-tight">Ready to Get Started?</h2>
                  <p className="mt-4 text-xl md:text-2xl text-primary">
                      Focus on growth. Let TheOneEye handle the execution.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                      <button
                          onClick={onBookDemo}
                          className="w-full sm:w-auto inline-block px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary">
                          Book a Demo
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
        <Benefits />
        <Testimonials />
        <Faq />
        <Cta onBookDemo={handleOpenModal} />
        <About />
      </main>
      <Footer />
      <DemoModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  );
}