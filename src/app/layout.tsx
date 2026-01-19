import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";

import { TRPCReactProvider } from "@/trpc/react";
import type { ILayoutProps } from "@/types/layout";

import "@/styles/globals.css";
import AppProvider from "@/provider/AppProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Dollar Sign Club.",
  description: "Dollar Sign Club.",
};

export default function RootLayout({ children }: Readonly<ILayoutProps>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        {/* <meta name="robots" content="noindex, nofollow" /> */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="title"
          content="Dollar Sign Club | $1 Per E-Signature, No Subscriptions"
        />
        <meta
          name="description"
          content="Simplify your e-signature process with Dollar Sign Club. Pay just $1 per signature with no subscriptions, no hidden fees, or contracts. Affordable, fast, and secure document signing made easy."
        />
        <meta
          name="keywords"
          content="e-signature, affordable e-signature, $1 per signature, digital document signing, no subscription e-signature, online signature platform, Dollar Sign Club, secure e-signature, pay-as-you-go signing, best e-signature tool"
        />
        <meta name="author" content="Dollar Sign Club" />
        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Dollar Sign Club | $1 Per E-Signature, No Subscriptions"
        />
        <meta
          property="og:description"
          content="Dollar Sign Club offers an affordable, no-commitment way to sign documents. Just $1 per signature—no subscriptions or hidden fees."
        />
        <meta property="og:url" content="https://dollarsignclub.com/" />
        <meta property="og:image" content="images/logo3.svg?v=1" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Dollar Sign Club | $1 Per E-Signature, No Subscriptions"
        />
        <meta
          name="twitter:description"
          content="Affordable e-signature solutions with no commitments. Pay $1 per signature, no subscriptions needed."
        />
        <meta name="twitter:image" content="images/logo3.svg?v=1" />

        <title>Dollar Sign Club | $1 Per E-Signature, No Subscriptions</title>
      </head>
      <body>
        <GoogleTagManager gtmId="GTM-KMNQXGP2" />
        <TRPCReactProvider>
          <AppProvider>{children}</AppProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
