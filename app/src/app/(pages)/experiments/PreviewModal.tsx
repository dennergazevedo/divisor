"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/app/ui/molecules/Dialog";
import { Button } from "@/app/ui/atoms/Button";
import { Input } from "@/app/ui/atoms/Input";
import { Separator } from "@/app/ui/atoms/Separator";
import { Link2, ExternalLink, Fullscreen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PreviewModalProps {
  experiment: Experiment;
}

export default function PreviewModal({ experiment }: PreviewModalProps) {
  const { selectedTenant } = useAuth();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [path, setPath] = useState("");

  const baseUrl = selectedTenant?.url || "";

  const generatePreviewUrl = () => {
    if (!selectedVariant) return "";

    try {
      // Clean up base URL and path
      let cleanBase = baseUrl.replace(/\/$/, "");
      if (!cleanBase.startsWith("http")) {
        cleanBase = `https://${cleanBase}`;
      }

      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      const fullUrl = new URL(cleanPath, cleanBase);

      // Add preview parameters
      fullUrl.searchParams.set("divisor_experiment", experiment.name);
      fullUrl.searchParams.set("divisor_variant", selectedVariant);

      return fullUrl.toString();
    } catch (e) {
      console.error("Invalid URL construction", e);
      return "";
    }
  };

  const handlePreview = () => {
    const url = generatePreviewUrl();
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Fullscreen className="w-4 h-4 text-neutral-400 hover:text-neutral-200 cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-purple-400" />
            Preview Experiment
          </DialogTitle>
          <DialogDescription>
            Force a specific variant for testing on your site.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-300">
              Select Variant
            </label>
            <div className="grid grid-cols-2 gap-2">
              {experiment.variants.map((variant) => (
                <button
                  key={variant.value}
                  onClick={() => setSelectedVariant(variant.value)}
                  className={`cursor-pointer px-4 py-3 text-sm rounded-xl border transition-all text-left flex flex-col gap-1 ${
                    selectedVariant === variant.value
                      ? "bg-purple-600/10 border-purple-500 text-white shadow-lg shadow-purple-500/10"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <span className="font-bold">{variant.value}</span>
                  <span className="text-[10px] opacity-70 uppercase tracking-wider">
                    {variant.percent}% Weight
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-300">
              Preview Path
            </label>
            <div className="flex items-center gap-0 h-12 focus-within:ring-2 focus-within:ring-purple-500/50 rounded-lg overflow-hidden border border-neutral-800 transition-all">
              <div className="bg-neutral-900 px-3 py-2 h-12 flex items-center text-sm text-neutral-500 border-r border-neutral-800 select-none whitespace-nowrap">
                {baseUrl}
              </div>
              <Input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/your-pathname"
                className="border-0 h-12 bg-neutral-950 focus-visible:ring-0 m-0 rounded-none text-sm"
              />
            </div>
            <p className="text-[10px] text-neutral-500">
              Existing query parameters will be preserved.
            </p>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-4">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-xl h-10">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handlePreview}
            disabled={!selectedVariant}
            className="bg-purple-600 hover:bg-purple-500 rounded-xl h-10 gap-2 px-6"
          >
            <ExternalLink className="w-4 h-4" />
            Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
