"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({ children }: { children: any }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (
      token &&
      (pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/reset-password" ||
        pathname === "/forgot-password")
    ) {
      router.push("/");
    } else if (
      !token &&
      pathname !== "/login" &&
      pathname !== "/register" &&
      pathname !== "/reset-password" &&
      pathname !== "/forgot-password"
    ) {
      router.push("/login");
    }
  }, []);

  return <>{children}</>;
}
