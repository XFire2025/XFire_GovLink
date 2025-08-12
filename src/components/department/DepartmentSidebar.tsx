// src/components/department/DepartmentSidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, Users, FileText, BarChart3, Settings, Layers } from "lucide-react";
import { useTranslation } from "@/lib/i18n/hooks/useTranslation";

interface MenuItem {
  id: string;
  // THIS IS THE CORRECTED LINE:
  // We simplify the type to 'string' as TypeScript can't infer the nested keys directly this way.
  // The t() function will still correctly resolve the full key like "sidebar.dashboard".
  labelKey: string; 
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", labelKey: "dashboard", icon: LayoutDashboard, href: "/department/dashboard" },
  { id: "agents", labelKey: "agents", icon: Users, href: "/department/agents" },
  { id: "services", labelKey: "services", icon: Layers, href: "/department/services" }, // New menu item
  { id: "submissions", labelKey: "submissions", icon: FileText, href: "/department/submissions" },
  { id: "reports", labelKey: "reports", icon: BarChart3, href: "/department/analytics" },
  { id: "settings", labelKey: "settings", icon: Settings, href: "/department/config" },
];

export default function DepartmentSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation('department');

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const isActiveItem = (href: string) => pathname === href;

  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileOpen(false)} />}
      
      <button onClick={() => setIsMobileOpen(true)} className="fixed top-6 left-4 z-[110] lg:hidden p-2.5 rounded-xl bg-card/95 dark:bg-card/98 backdrop-blur-md border border-border/50 shadow-xl hover:bg-muted modern-card" aria-label="Open menu">
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      <div className={`fixed lg:sticky top-0 h-screen bg-gradient-to-b from-[#008060] via-[#FFC72C] to-[#FF5722] border-r border-border/50 backdrop-blur-md flex flex-col transition-all duration-300 ease-in-out shadow-2xl modern-card z-40 overflow-hidden ${isCollapsed ? "w-16" : "w-64"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-25 dark:opacity-15 bg-center bg-no-repeat bg-cover transition-opacity duration-1000" style={{ backgroundImage: 'url("/2.png")', filter: 'saturate(1.1) brightness(1.05)' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/30 dark:from-background/70 dark:via-background/50 dark:to-background/80"></div>
        </div>
        
        <div className="relative z-10 p-4 border-b border-border/30 bg-gradient-to-r from-[#008060]/5 to-[#FF5722]/5">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#008060]/20 to-[#FF5722]/20 rounded-lg flex items-center justify-center border border-[#008060]/30 shadow-md">
                  <LayoutDashboard className="w-4 h-4 text-[#008060]" />
                </div>
                <span className="font-bold bg-gradient-to-r from-[#008060] to-[#FF5722] bg-clip-text text-transparent">{t('sidebar.title')}</span>
              </div>
            )}
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-[#008060]/10 transition-all duration-300 text-muted-foreground hover:text-[#008060] hover:scale-105" aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="relative z-10 flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-[#008060]/30 scrollbar-track-transparent">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveItem(item.href);
              return (
                <li key={item.id} className="group">
                  <Link href={item.href} onClick={() => window.innerWidth < 1024 && setIsMobileOpen(false)} className={`relative w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[#008060]/20 ${isActive ? "bg-[#008060]/10 border border-[#008060]/20 text-[#008060] shadow-sm" : "text-muted-foreground hover:text-foreground"} ${isCollapsed ? "justify-center" : "justify-start"}`}>
                    <div className="flex items-center flex-1">
                      <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${isActive ? "bg-gradient-to-r from-[#008060]/20 to-[#FF5722]/10 shadow-md" : "bg-transparent group-hover:bg-muted/60"}`}>
                        <IconComponent className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-[#008060]" : ""}`} />
                      </div>
                      {/* Using the t function with a constructed key */}
                      {!isCollapsed && <span className="text-sm font-medium ml-3 whitespace-nowrap">{t(`sidebar.${item.labelKey}`)}</span>}
                    </div>
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#008060] to-[#FFC72C] rounded-r-full shadow-md" />}
                  </Link>
                  {/* Using the t function with a constructed key for the tooltip */}
                  {isCollapsed && <div className="absolute left-full ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg text-sm font-medium text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">{t(`sidebar.${item.labelKey}`)}<div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-t border-border rotate-45" /></div>}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}