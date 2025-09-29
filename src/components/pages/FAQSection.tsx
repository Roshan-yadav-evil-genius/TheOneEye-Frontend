import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

export default FAQSection