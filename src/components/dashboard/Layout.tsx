import React from "react";
import { Layout as LayoutIcon, FileText, User2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => (
  <nav className="fixed left-0 top-0 h-full w-64 bg-gray-900 p-4 text-white">
    <div className="mb-8 flex items-center gap-2">
      <LayoutIcon className="h-6 w-6" />
      <span className="text-xl font-bold">DocSign Pro</span>
    </div>
    <div className="space-y-2">
      {[
        { icon: <FileText className="h-5 w-5" />, label: "Contracts" },
        { icon: <User2 className="h-5 w-5" />, label: "Contacts" },
        { icon: <Settings className="h-5 w-5" />, label: "Settings" },
      ].map(({ icon, label }) => (
        <Button
          type="button"
          variant={`outline`}
          key={label}
          className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-800"
        >
          {icon}
          <span>{label}</span>
        </Button>
      ))}
    </div>
  </nav>
);

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
