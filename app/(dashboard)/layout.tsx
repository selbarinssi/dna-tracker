// app/(dashboard)/layout.tsx

import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-ivory overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
