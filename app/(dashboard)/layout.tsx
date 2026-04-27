'use client';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dalva-bg bg-gradient-mesh">
      <Sidebar />
      <div className="ml-[260px] transition-all duration-300">
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
