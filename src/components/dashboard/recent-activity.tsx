"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTRACT_STATUS } from "@/lib/constants";
import { FileCheck, FileX, FileClock, User } from "lucide-react";

const activities = [
  {
    id: 1,
    type: CONTRACT_STATUS.SIGNED,
    title: "Service Agreement signed",
    user: "John Doe",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: CONTRACT_STATUS.PENDING,
    title: "Employment Contract sent",
    user: "Sarah Smith",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: CONTRACT_STATUS.REJECTED,
    title: "NDA rejected",
    user: "Mike Johnson",
    time: "1 day ago",
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case CONTRACT_STATUS.SIGNED:
      return FileCheck;
    case CONTRACT_STATUS.PENDING:
      return FileClock;
    case CONTRACT_STATUS.REJECTED:
      return FileX;
    default:
      return User;
  }
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div
                  className={`rounded-full p-2 ${
                    activity.type === CONTRACT_STATUS.SIGNED
                      ? "bg-green-100 text-green-600"
                      : activity.type === CONTRACT_STATUS.PENDING
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
