"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supportSchema, SupportFormData } from "./schema";
import { Button } from "@/app/ui/atoms/Button";
import { Input } from "@/app/ui/atoms/Input";
import { toast } from "sonner";
import { LifeBuoy, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import RedirectByPlan from "../(tenant)/redirectByPlan";
import { SidebarTrigger } from "@/app/ui/organisms/Sidebar";
import { Separator } from "@/app/ui/atoms/Separator";

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
  });

  const onSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message sent successfully! We will get back to you soon.");
      reset();
    } catch (error) {
      console.error(error);
      toast.error(
        "An error occurred while sending your message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex flex-col h-full w-full">
      <Suspense fallback={null}>
        <RedirectByPlan />
      </Suspense>
      <SidebarTrigger className="fixed top-2 left-4 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12 z-100" />
      <section className="flex flex-col gap-4 p-8 py-4 mt-20 md:mt-0">
        <div className="flex flex-row justify-between w-full gap-8">
          <div>
            <h1 className="text-lg font-bold flex flex-row items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-purple-400" />
              Support
            </h1>
            <p className="text-sm text-neutral-400">
              Need help? Send us a message and our team will get back to you as
              soon as possible.
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4 w-full max-w-4xl">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-neutral-800 rounded-3xl p-8 shadow-2xl">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-neutral-300 ml-1"
                >
                  Your Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500/50" : ""}
                />
                {errors.email && (
                  <span className="text-xs text-red-400 ml-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium text-neutral-300 ml-1"
                >
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="How can we help you?"
                  {...register("subject")}
                  className={errors.subject ? "border-red-500/50" : ""}
                />
                {errors.subject && (
                  <span className="text-xs text-red-400 ml-1">
                    {errors.subject.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-neutral-300 ml-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Describe your issue or question in detail..."
                  className={`w-full bg-neutral-300/10 outline-0 focus:bg-neutral-300/20 rounded-2xl px-4 py-3 border-b-2 border-b-neutral-300/20 text-sm text-white placeholder:text-neutral-500 transition-all resize-none ${
                    errors.message
                      ? "border-red-500/50"
                      : "focus:border-purple-500/50"
                  }`}
                  {...register("message")}
                ></textarea>
                {errors.message && (
                  <span className="text-xs text-red-400 ml-1">
                    {errors.message.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-full transition-all group"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-zinc-900/30 border border-neutral-800 rounded-3xl">
              <h3 className="text-sm font-semibold text-neutral-200 mb-2">
                Documentation
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Check our guides and API reference for quick answers.
              </p>
              <a
                href="https://docs.divisor.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4"
              >
                Go to docs
              </a>
            </div>
            <div className="p-6 bg-zinc-900/30 border border-neutral-800 rounded-3xl">
              <h3 className="text-sm font-semibold text-neutral-200 mb-2">
                SDKs
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Check our SDKs for quick integration.
              </p>
              <Link
                href="/integrations"
                className="text-xs text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4"
              >
                Go to SDKs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
