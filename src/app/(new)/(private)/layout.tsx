import { auth } from "@/server/auth";
import type { ILayoutProps } from "@/types/layout";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }: ILayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  return <>{children}</>;
}
