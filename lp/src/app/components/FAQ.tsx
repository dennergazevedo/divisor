"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question:
      "Why is Divisor proportionally much cheaper than other providers?",
    answer:
      "It's highly optimized for a specific use case—A/B testing—avoiding unnecessary features and infrastructure overhead that most players include but you don't use.",
  },
  {
    question: "How to integrate Divisor into my site?",
    answer:
      "With the Divisor SDK, it's plug-and-play. We provide practical examples within the platform for the market's leading web frameworks.",
  },
  {
    question: "Can I test Divisor without cluttering my website with code?",
    answer:
      "Yes, we have a Free plan specifically for this scenario. The SDK is simple to use and easy to uninstall, leaving no residue after the test.",
  },
  {
    question: "How can I create an A/B test with Divisor?",
    answer:
      "On the experiments page, you can create your tests and name your variants as you wish. You can also decide the split percentage for each variant, which is ideal for Canary Releases—starting with a small percentage and increasing it gradually.",
  },
  {
    question: "How does Divisor affect site loading?",
    answer:
      "Our SDK is only 10.3kb and loads in approximately 25ms—visually imperceptible. It's also Edge First, ensuring performance with every request.",
  },
  {
    question: "Does Divisor work in server-side applications?",
    answer:
      "Yes, you can communicate with our servers before rendering the screen to the user, with fast response times between 5ms and 20ms in most cases.",
  },
];

const FAQ = () => (
  <section id="faq" className="py-24 border-t border-border">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Everything you need to know about Divisor.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="w-full"
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b-border/50"
            >
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline hover:text-purple-500 transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default FAQ;
