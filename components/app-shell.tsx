"use client";

import Sidebar from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-60 min-w-0 transition-all duration-300 flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        {/* Footer */}
        <div className="container mx-auto px-4 pb-4">
          <Footer />
        </div>
      </main>
    </div>
  );
}

