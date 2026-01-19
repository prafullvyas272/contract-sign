import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // This is a simple example. In a real app, you'd check for a valid auth token
  const isAuthenticated = localStorage.getItem("isAuthenticated") !== "true";

  return <>{children}</>;
}
