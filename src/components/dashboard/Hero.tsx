import React from "react";
import { FileSignature, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            Sign Documents with
            <span className="ml-2 bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
              Confidence
            </span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-xl text-blue-100 md:text-2xl">
            Secure, fast, and legally binding electronic signatures for
            businesses and individuals
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              type="button"
              variant={`outline`}
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              Get Started Free
            </Button>
            <Button
              type="button"
              variant={`outline`}
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
