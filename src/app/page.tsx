import React from 'react';
import NavBar from "@/components/global/NavBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { FaUsersGear } from 'react-icons/fa6';
import { GiRobotGrab } from 'react-icons/gi';
import { MdOutlineSecurity } from 'react-icons/md';
import { TbDeviceHeartMonitorFilled } from 'react-icons/tb';
import { SiGoogledocs } from 'react-icons/si';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

const HeroSection = () => {
    return (
        <section className='flex flex-col justify-center items-center mt-50'>
            <BackgroundRippleEffect />
            <main className='max-w-2xl flex flex-col justify-center items-center gap-10'>

                <span className='my-5 text-center bg-gradient-to-r from-yellow-900 to-yellow-500 font-bold rounded-2xl p-1'>
                    ✨Join Our Waiting List & Enjoy 1 Month Free.
                </span>
                <div className='flex flex-col gap-5'>
                    <h1 className='text-6xl font-bold text-center'>
                        Tired of Missing Online Opportunities?
                    </h1>
                    <h4 className='text-center text-xl text-slate-500 font-bold'>
                        Fully managed {" "}
                        Automation-as-a-Service
                        that handles repetitive tasks, letting your team focus on growth.
                    </h4>
                </div>
                <div className='w-full px-10'>
                    <form action="" method="post" className='flex gap-2 border-2 rounded-2xl p-2 max-w-lg'>
                        <Input type="email" className='h-10' placeholder="Enter your email" />
                        <Button variant="default" className='h-10'>Sign Up</Button>
                    </form>
                </div>
            </main>

        </section>
    )
}

const FeatureCards = () => {
  return (
    <main className='flex flex-col wrap-normal gap-8 lg:flex-row items-stretch'>
      <Card className='hover:border-yellow-800 flex-1'>
        <CardContent className='flex justify-center'>
          <FaUsersGear size={80}/>
        </CardContent>
        <CardHeader className='text-2xl text-center font-bold'>Fully Managed <br />"Automation-as-a-Service"</CardHeader>
        <CardDescription className='px-5'>A complete, hands-off automation solution — we build, manage, and maintain your workflows so you focus only on results, not tools.</CardDescription>
      </Card>
      <Card className='hover:border-yellow-800 flex-1'>
        <CardContent className='flex justify-center'>
          <GiRobotGrab  size={80}/>
        </CardContent>
        <CardHeader className='text-2xl text-center font-bold'>AI-Enhanced Intelligent Actions</CardHeader>
        <CardDescription className='px-5'>Go beyond alerts — detect opportunities, generate tailored proposals, and act instantly to win more business with less effort.</CardDescription>
      </Card>
      <Card className='hover:border-yellow-800 flex-1'>
        <CardContent className='flex justify-center'>
          <MdOutlineSecurity  size={80}/>
        </CardContent>
        <CardHeader className='text-2xl text-center font-bold'>Enterprise-Grade Security & Reliability</CardHeader>
        <CardDescription className='px-5'>Each workflow runs in its own isolated container, ensuring maximum security, stability, and trust for mission-critical operations.</CardDescription>
      </Card>
      <Card className='hover:border-yellow-800 flex-1'>
        <CardContent className='flex justify-center'>
          <TbDeviceHeartMonitorFilled  size={80}/>
        </CardContent>
        <CardHeader className='text-2xl text-center font-bold'>Flexible Client Control Portal</CardHeader>
        <CardDescription className='px-5'>Stay in charge of sensitive credentials and strategy settings without dealing with technical complexity.</CardDescription>
      </Card>
      <Card className='hover:border-yellow-800 flex-1'>
        <CardContent className='flex justify-center'>
          <SiGoogledocs size={80}/>
        </CardContent>
        <CardHeader className='text-2xl text-center font-bold'>Personalized Automation Audit</CardHeader>
        <CardDescription className='px-5'>Stay in charge of sensitive credentials and strategy settings without dealing with technical complexity.</CardDescription>
      </Card>
    </main>
  )
}

const FeaturesSection = () => {
  return (
    <section className='flex items-center flex-col gap-10 mt-20'>
      <div className='border-2 px-3 py-1 rounded-2xl flex gap-2 items-center border-yellow-600'>
        <div className="w-2 h-2 rounded-full bg-yellow-600 animate-ping"></div>
        <p className='hover:text-yellow-600 font-bold'>Features</p>
      </div>
      <FeatureCards />
    </section>
  )
}

const FAQSection = () => {
  return (
    <section className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>


      <Accordion type="single" collapsible>
        <AccordionItem value="q-1">
          <AccordionTrigger className="text-left">What is TheOneEye? Is it just another automation tool like Zapier?</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">No — TheOneEye is a fully managed <strong>Automation-as-a-Service</strong>. Instead of giving you a DIY platform to build and maintain, we deliver a finished, maintained automation that solves a specific business outcome.</p>


            <ul className="list-disc pl-5 space-y-1">
              <li><strong>We build, manage, and maintain everything for you.</strong> Our team handles the full technical lifecycle — design, development, monitoring, and ongoing fixes when target sites change.</li>
              <li><strong>You buy a guaranteed business outcome, not a tool.</strong> No learning new software — you get a hands-off utility that solves problems like improving proposal win rates or ensuring critical tenders are never missed.</li>
              <li><strong>We fill the Automation Service Gap.</strong> For businesses whose needs are too complex for DIY tools but who don’t want expensive enterprise platforms, we remove hidden costs and technical burden.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>


        <AccordionItem value="q-2">
          <AccordionTrigger className="text-left">Who is this service designed for?</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">TheOneEye is built for business leaders and process owners — the people whose performance depends on the outcome of a process. Not for IT teams.</p>


            <ul className="list-disc pl-5 space-y-1">
              <li><strong>High-Volume Bidding Teams:</strong> Agencies, freelancers and development shops who compete on platforms like Upwork and want to overcome bid flooding and proposal burnout.</li>
              <li><strong>Enterprise & Public Sector Tender Teams:</strong> Organizations that monitor government or industry portals for high-value contracts and cannot risk missing opportunities.</li>
              <li><strong>Mid-Market Strategic Intelligence Units:</strong> Consultancies and corporate strategy teams that need real-time competitor, pricing, or market signals without costly analyst teams.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>


        <AccordionItem value="q-3">
          <AccordionTrigger className="text-left">What happens when a website we monitor changes its layout or security?</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Our team handles it. This is a core promise of our fully-managed service.</p>
            <p>We operate proactive monitoring to detect structural or security changes on target sites and fix workflows — often before you even notice an issue.</p>
          </AccordionContent>
        </AccordionItem>


        <AccordionItem value="q-4">
          <AccordionTrigger className="text-left">How do you ensure my data and credentials are secure?</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Security is built into our architecture:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Containerized Isolation:</strong> Each client&apos;s workflow runs inside its own Docker container, ensuring complete separation from other clients and reducing noisy-neighbor risks.</li>
              <li><strong>Client-Controlled Portal:</strong> You get a secure, view-only portal to store and update sensitive parameters (credentials, API keys, cookies) without touching the underlying workflow logic.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>


        <AccordionItem value="q-5">
          <AccordionTrigger className="text-left">How does your pricing work?</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">We use a custom-quote pricing model. Because every automation is unique, pricing is tailored to portal complexity, required actions, and maintenance scope.</p>
            <p>This consultative approach ensures a deep discovery process so the solution fits your exact needs instead of forcing a one-size-fits-all subscription.</p>
          </AccordionContent>
        </AccordionItem>


        <AccordionItem value="q-6">
          <AccordionTrigger className="text-left">How can I know if it’s right for my business before committing?</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Start with our <strong>Free Automation Audit</strong> — a no-obligation consultative review.</p>
            <p className="mb-2">You fill a short form describing a manual, web-based process that’s causing pain. We return a concise one-page PDF that shows:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>How the process can be fully automated.</li>
              <li>A quantified estimate of the impact, e.g. <em>“20–25 hours saved per week”</em> or <em>“300% increase in proposal output.”</em></li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}

export default function Home() {
  return (
    <main className="flex flex-col gap-10 p-5">
      <NavBar/>
      <HeroSection/>
      <FeaturesSection/>
      <FAQSection/>
    </main>
  );
}