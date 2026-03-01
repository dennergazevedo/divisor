"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

const FAQ = () => {
  const t = useTranslations("FAQ");

  const faqs = [
    {
      question: t("q1.q"),
      answer: t("q1.a"),
    },
    {
      question: t("q2.q"),
      answer: t("q2.a"),
    },
    {
      question: t("q3.q"),
      answer: t("q3.a"),
    },
    {
      question: t("q4.q"),
      answer: t("q4.a"),
    },
    {
      question: t("q5.q"),
      answer: t("q5.a"),
    },
    {
      question: t("q6.q"),
      answer: t("q6.a"),
    },
  ];

  return (
    <section id="faq" className="py-24 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t("subtitle")}
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
};

export default FAQ;
