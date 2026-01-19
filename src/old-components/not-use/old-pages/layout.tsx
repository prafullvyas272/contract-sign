import PrivateRoute from "@/old-components/not-use/private-route";

export default function RootLayout({ children }: { children: any }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
