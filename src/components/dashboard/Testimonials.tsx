import React from "react";

const testimonials = [
  {
    quote:
      "DocSign Pro has transformed how we handle contracts. It's faster and more secure than our old process.",
    author: "Sarah Johnson",
    role: "CEO at TechCorp",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100",
  },
  {
    quote:
      "The ease of use and security features make this platform stand out. Highly recommended!",
    author: "Michael Chen",
    role: "Legal Director",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100",
  },
];

export function Testimonials() {
  return (
    <div className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600">
            See what our customers have to say about DocSign Pro
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="mb-6 italic text-gray-600">{testimonial.quote}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="mr-4 h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
