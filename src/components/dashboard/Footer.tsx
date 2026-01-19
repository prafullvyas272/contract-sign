import React from "react";
import { FileSignature } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <FileSignature className="h-6 w-6" />
              <span className="text-xl font-bold">DocSign Pro</span>
            </div>
            <p className="text-gray-400">
              Secure document signing for modern businesses
            </p>
          </div>
          {["Product", "Company", "Resources", "Legal"].map((section) => (
            <div key={section}>
              <h3 className="mb-4 font-semibold">{section}</h3>
              <ul className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 transition-colors hover:text-white"
                    >
                      {section} Link {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2024 DocSign Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
