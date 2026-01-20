"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/home" className="text-2xl font-bold text-[#303596]">
              Contract Sign.
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <div className="flex gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-[#303596]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-[#303596]"
                onClick={() => router.push("/signin")}
              >
                Sign in
              </Button>
              <Button
                className="bg-[#303596] hover:bg-[#303596]/90"
                onClick={() => router.push("/dashboard/contracts")}
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="pb-3 pt-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base font-medium text-gray-700 transition-colors hover:text-[#303596]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 border-t pt-4">
                <Button
                  variant="ghost"
                  className="w-full text-[#303596]"
                  onClick={() => router.push("/signin")}
                >
                  Sign in
                </Button>
                <Button
                  className="w-full bg-[#303596] hover:bg-[#303596]/90"
                  onClick={() => router.push("/dashboardcontracts")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
