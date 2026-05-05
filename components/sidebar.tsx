"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  FileBarChart2,
  Package,
  History,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Cog,
  AlertTriangle,
  X,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { alerts } from "@/lib/data";
import ThemeToggle from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/grinding-log", label: "Grinding Log", icon: ClipboardList },
  { href: "/production-report", label: "Production Report", icon: FileBarChart2 },
  { href: "/inventory", label: "Roll Inventory", icon: Package },
  { href: "/roll-history", label: "Roll History", icon: History },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/admin", label: "Admin Panel", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  const NavLink = ({ item }: { item: (typeof navItems)[0] }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150 group relative",
          isActive
            ? "bg-primary/15 text-primary font-medium"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <div className="relative shrink-0">
          <Icon size={18} className={cn(isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground")} />
          {item.label === "Alerts" && unreadAlerts > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {unreadAlerts}
            </span>
          )}
        </div>
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && item.label === "Alerts" && unreadAlerts > 0 && (
          <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full px-1.5 py-0.5">
            {unreadAlerts}
          </span>
        )}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-card border border-border rounded-md text-xs text-foreground whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            {item.label}
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-md text-foreground lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-40 transition-all duration-300",
          collapsed ? "w-16" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-4 py-4 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md shrink-0">
            <Cog size={16} className="text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-bold text-sidebar-accent-foreground leading-none">Roll Shop</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">MES System</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
          {!collapsed && (
            <div className="px-3 mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Navigation</span>
            </div>
          )}
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Theme toggle */}
        <div className="px-2 border-t border-sidebar-border pt-2">
          <ThemeToggle collapsed={collapsed} />
        </div>

        {/* Bottom status */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--status-active)" }} />
              <span className="text-xs text-muted-foreground">System Online</span>
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">v2.4.1 · Jan 2024</div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          className="hidden lg:flex items-center justify-center py-3 border-t border-sidebar-border text-muted-foreground hover:text-sidebar-accent-foreground transition-colors"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  );
}
