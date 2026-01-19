"use client";

import {
  LucideIcon,
  LayoutDashboard,
  FileText,
  User,
  Settings,
  Signature,
  FileUser,
  LayoutPanelTop,
  Users,
  BookType,
  LogOut,
  CoinsIcon,
  DollarSign,
  RefreshCcw,
  RefreshCcwDotIcon,
  RefreshCcwIcon,
  DollarSignIcon,
  Logs,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BRAND, ROUTES } from "@/lib/constants";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  role: string[];
}

const navItems: NavItem[] = [
  // {
  //   title: "Dashboard",
  //   href: ROUTES.dashboard,
  //   icon: LayoutDashboard,
  //   role: ["company", "individual"],
  // },
  {
    title: "Contracts",
    href: ROUTES.contracts,
    icon: FileText,
    role: ["company", "individual", "teamMember"],
  },
  {
    title: "Templates",
    href: ROUTES.templates,
    icon: BookType,
    role: ["company", "teamMember"],
  },
  {
    title: "Team",
    href: ROUTES.team,
    icon: Users,
    role: ["company", "teamMember"],
  },
  {
    title: "Wallet",
    href: ROUTES.wallet,
    icon: DollarSignIcon,
    role: ["company", "teamMember"],
  },
  {
    title: "Profile",
    href: ROUTES.profile,
    icon: Settings,
    role: ["company", "individual", "teamMember"],
  },
  // {
  //   title: "Log",
  //   href: ROUTES.log,
  //   icon: Logs,
  //   role: ["company", "teamMember"],
  // },
];

export function Sidebar() {
  const pathname = usePathname();
  const session = useSession();
  const [walletAmount, setWalletAmount] = useState<number>(0);
  async function fetchWalletAmount() {
    let id = session.data?.user?.id;
    if (session.data?.user?.isTeamMember) {
      const adminData = await axios.get(
        "/api/team/get-admin?id=" + session.data?.user?.id,
      );
      id = adminData.data?.admin_id;
    }
    try {
      const response = await axios.get(`/api/wallet?id=${id}`);
      setWalletAmount(response.data.wallet);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (session.data && session?.data?.user?.role == "company")
      fetchWalletAmount();
  }, [session.data]);
  return (
    <div className="flex h-screen flex-col border-r bg-white">
      <div className="p-6">
        <Link
          href={ROUTES.dashboard}
          className="flex items-center gap-2 font-semibold"
          style={{ color: BRAND.primary }}
        >
          <FileUser className="h-6 w-6" />
          <span>{BRAND.name}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isVisible =
            item.role.includes(session?.data?.user?.role as string) ||
            (session?.data?.user?.isTeamMember &&
              item.role.includes("teamMember"));

          if (!isVisible) return null;

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
        <div
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
          onClick={() => signOut({ redirectTo: "/" })}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </div>
      </nav>
      {session?.data?.user?.role == "company" ? (
        <div
          onClick={() => fetchWalletAmount()}
          className="mb-12 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-lg font-medium text-gray-500 transition-colors"
        >
          $ {walletAmount?.toFixed(2) || 0}
          <RefreshCcwIcon className="h-4 w-4" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
