import { AuthProvider } from "@/old-context/authContext";
import Header from "@/old-components/auth/header";
import Footer from "@/old-components/auth/footer";
import { ILayoutProps } from "@/types/layout";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/old_custum.css";

export default async function RootLayout({ children }: ILayoutProps) {
  return (
    <>
      <main>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </main>
    </>
  );
}
