"use client";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, FileCheck, Shield, Users } from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Secure Signing",
      description:
        "Enterprise-grade security with advanced encryption for all your documents",
      icon: Shield,
    },
    {
      title: "Team Collaboration",
      description:
        "Invite team members and manage signing workflows efficiently",
      icon: Users,
    },
    {
      title: "Quick Turnaround",
      description: "Get documents signed in minutes, not days",
      icon: FileCheck,
    },
  ];

  const testimonials = [
    {
      quote: "Streamlined our entire contract process. Couldn't be happier!",
      author: "Sarah Johnson",
      role: "CEO, TechCorp",
    },
    {
      quote: "The most user-friendly signing platform we've ever used.",
      author: "Michael Chen",
      role: "Legal Director, StartupX",
    },
  ];

  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 to-background pb-32 pt-32">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                Sign Documents with
                <span className="mt-2 block text-[#303596]">
                  Confidence and Speed
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
                Secure, legally-binding electronic signatures for businesses of
                all sizes. Get documents signed in minutes, not days.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-[#303596] text-lg hover:bg-[#303596]/90"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#303596] text-lg text-[#303596]"
                >
                  See How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-background py-24" id="features">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="mb-16 text-center text-3xl font-bold">
              Everything you need for seamless document signing
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 transition-shadow hover:shadow-lg"
                >
                  <feature.icon className="mb-4 h-12 w-12 text-[#303596]" />
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-[#303596]/5 py-24" id="about">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="mb-16 text-center text-3xl font-bold">
              Trusted by businesses worldwide
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-8">
                  <blockquote className="mb-4 text-lg">
                    {testimonial.quote}
                  </blockquote>
                  <footer>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </footer>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#303596] py-24 text-white">
          <div className="container mx-auto max-w-7xl px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">
              Ready to transform your document workflow?
            </h2>
            <p className="mb-10 text-xl opacity-90">
              Join thousands of businesses that trust us with their important
              documents
            </p>
            <Button size="lg" variant="secondary" className="text-lg">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
