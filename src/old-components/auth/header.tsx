"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/old-context/authContext";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const headerMain: any = document.querySelector(".header-main");
    if (headerMain) {
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerMain.offsetHeight}px`,
      );
    }
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };
  return (
    <header className="header">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-auto">
            <div
              ref={dropdownRef}
              className={`header-toggle-menu ${isDropdownOpen ? "active" : ""}`}
            >
              <button
                type="button"
                className="header-toggle-menu-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {isDropdownOpen ? (
                  <i className="icon-close" />
                ) : (
                  <i className="icon-bars" />
                )}
              </button>
              <div className="header-toggle-menu-box">
                <ul>
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                  <li>
                    <a href={"https://blog.dollarsignclub.com"}>Blog</a>
                  </li>
                  <li>
                    <Link href="/upload-document">Upload Now</Link>
                  </li>
                  <li>
                    <Link href="/terms">Terms</Link>
                  </li>
                  <li>
                    <Link href="/privacy">Privacy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col">
            <Link href="/" className="header-logo">
              <img src="images/logo3.svg" alt="logo" />
            </Link>
          </div>
          <div className="col-auto">
            <a
              href={
                session.status === "authenticated" ? "/dashboard" : "/signin"
              }
              className="header-user-btn"
            >
              <i className="icon-user" />
            </a>
            {/* <SignIn /> */}
          </div>
          {session.status === "authenticated" && (
            <div className="col-auto">
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
