"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-con">
          <Link href="/" className="footer-logo">
            <img src="/images/logo3.svg" alt="logo" />
          </Link>
          <div className="footer-links">
            <ul>
              <li>
                <Link
                  href={"/about"}
                  className={`${pathname === "/about" ? "active" : ""}`}
                >
                  ABOUT
                </Link>
              </li>
              <li>
                <a href={"https://blog.dollarsignclub.com"}>BLOG</a>
              </li>
              <li>
                <Link
                  href={"/terms"}
                  className={`${pathname === "/terms" ? "active" : ""}`}
                >
                  TERMS
                </Link>
              </li>
              <li>
                <Link
                  href={"/privacy"}
                  className={`${pathname === "/privacy" ? "active" : ""}`}
                >
                  PRIVACY
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
