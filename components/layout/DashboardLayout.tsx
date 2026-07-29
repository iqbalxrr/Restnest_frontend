"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
}

export default function DashboardLayout({ children, navItems, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2 font-bold text-[var(--primary)]">
          <Home size={20} />
          RentNest
        </Link>
        <div className="mt-4">
          <div className="w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-sm mb-2">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm font-medium">{user?.name}</div>
          <div className="text-xs text-[var(--muted)]">{user?.email}</div>
          <div className="text-xs font-medium text-[var(--primary)] mt-1 uppercase tracking-wide">{user?.role}</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2 w-full rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--secondary)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[var(--border)] fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 w-64 bg-white h-full flex flex-col">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1 text-[var(--muted)]">
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 bg-white border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-[var(--muted)]" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
