import React from "react";
import { FileSignature, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: <FileSignature className="h-6 w-6" />,
    title: "Easy Signing Process",
    description:
      "Sign documents in seconds with our intuitive drag-and-drop interface",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Bank-Level Security",
    description:
      "Your documents are protected with enterprise-grade encryption",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Get your documents signed quickly with automated workflows",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Collaboration",
    description: "Work together seamlessly with role-based access control",
  },
];

export function Features() {
  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Everything You Need to Sign Documents
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features that make document signing simple and secure
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
