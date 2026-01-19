"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { MessageCircle } from "lucide-react";
import LogIcon from "@/components/icons/logIcon";
import { useSession } from "next-auth/react";

interface Log {
  createdAt: string;
  log: string;
  type: number;
}

const LogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();

  const fetchLogs = async () => {
    try {
      let id = session.data?.user?.id;
      if (session.data?.user?.isTeamMember) {
        const adminData = await axios.get(
          "/api/team/get-admin?id=" + session.data?.user?.id,
        );
        id = adminData.data?.admin_id;
      }
      const response = await axios.get<Log[]>("/api/log" + "?id=" + id);
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session.data && session?.data?.user) fetchLogs();
  }, [session?.data]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading logs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-semibold text-gray-800">
            System Logs
          </h1>

          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-center text-gray-500">No logs available</p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 border-b border-gray-100 p-2 last:border-0"
                >
                  <LogIcon
                    type={log?.type || 0}
                    className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-sm font-medium text-gray-500">
                        {moment(log.createdAt).format("DD MMM YYYY : hh:mm A")}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{log.log}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
