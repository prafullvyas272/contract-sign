"use client";

import { FileCheck, FileClock, FileX, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ContractAnalytics } from "@/components/dashboard/contract-analytics";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    router.push(ROUTES.contracts);
  }, []);

  console.log("session", session);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Heres your contract overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Contracts"
          value={5}
          icon={FileClock}
          description="Awaiting signatures"
        />
        <StatsCard
          title="Signed Contracts"
          value={12}
          icon={FileCheck}
          description="Successfully completed"
        />
        <StatsCard
          title="Rejected Contracts"
          value={2}
          icon={FileX}
          description="Requires attention"
        />
        <StatsCard
          title="Team Members"
          value={8}
          icon={Users}
          description="Active users"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ContractAnalytics />
        <RecentActivity />
      </div>
    </div>
  );
}
