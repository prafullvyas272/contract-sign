import "./globals.css";
import { Suspense } from "react";
import { Sidebar } from "@/components/dashboard/layout/sidebar";
import { Header } from "@/components/dashboard/layout/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </Suspense>
  );
}
