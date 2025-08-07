"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  Users,
  ShieldCheck,
  UserCog,
  FileText,
  Settings,
  ChevronDown,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  submenu?: {
    id: string;
    label: string;
    href: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Admin Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    id: "user-management",
    label: "User Management",
    icon: Users,
    submenu: [
      { id: "normal-users", label: "Normal Users", href: "/admin/users" },
      { id: "agents", label: "Agents", href: "/admin/agents" },
    ],
  },
  {
    id: "user-verification",
    label: "User Verification",
    icon: ShieldCheck,
    href: "/admin/verification",
  },
  {
    id: "account-suspension",
    label: "Account Suspension",
    icon: UserCog,
    href: "/admin/suspension",
  },
  {
    id: "customer-agent",
    label: "Customer/Agent Management",
    icon: UserCog,
    href: "/admin/customer-agent",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    href: "/admin/reports",
  },
  {
    id: "system-configuration",
    label: "System Configuration",
    icon: Settings,
    href: "/admin/system-configuration",
  },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    "user-management",
  ]);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus((prev: string[]) =>
      prev.includes(menuId)
        ? prev.filter((id: string) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleItemClick = (hasSubmenu: boolean = false, menuId?: string) => {
    if (hasSubmenu && menuId) {
      toggleSubmenu(menuId);
    }
    // Close mobile menu on item selection
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const isActiveItem = (item: MenuItem) => {
    // Check if this is the active path directly
    if (item.href && pathname === item.href) return true;

    // Check if any submenu item is active for this parent
    if (item.submenu) {
      return item.submenu.some((sub) => pathname === sub.href);
    }

    return false;
  };

  const isActiveSubmenuItem = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-background border border-border shadow-lg hover:bg-muted transition-colors"
        aria-label="Open admin menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:sticky top-0 h-screen bg-gradient-to-b from-background via-background to-muted/10 
        border-r border-border backdrop-blur-sm flex flex-col transition-all duration-300 ease-in-out
        shadow-lg z-40
        ${isCollapsed ? "w-16" : "w-64"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header with toggle button */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-primary/30 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-foreground">
                  Admin Panel
                </span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedMenus.includes(item.id);
              const isActive = isActiveItem(item);

              return (
                <li key={item.id} className="group">
                  {/* Main menu item */}
                  {hasSubmenu ? (
                    <button
                      onClick={() => handleItemClick(hasSubmenu, item.id)}
                      className={`
                      relative w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200
                      hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                      ${
                        isActive
                          ? "bg-primary/10 border border-primary/20 text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }
                      ${isCollapsed ? "justify-center" : "justify-start"}
                    `}
                    >
                      <div className="flex items-center flex-1">
                        <div
                          className={`
                        p-1.5 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "bg-primary/20"
                            : "bg-transparent group-hover:bg-muted"
                        }
                      `}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        {!isCollapsed && (
                          <span className="text-sm font-medium ml-3 whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {/* Chevron for submenu items */}
                      {hasSubmenu && !isCollapsed && (
                        <ChevronDown
                          className={`
                          w-4 h-4 transition-transform duration-200 ml-auto
                          ${isExpanded ? "rotate-180" : "rotate-0"}
                        `}
                        />
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={() => handleItemClick(false)}
                      className={`
                      relative w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200
                      hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                      ${
                        isActive
                          ? "bg-primary/10 border border-primary/20 text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }
                      ${isCollapsed ? "justify-center" : "justify-start"}
                    `}
                    >
                      <div className="flex items-center flex-1">
                        <div
                          className={`
                        p-1.5 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "bg-primary/20"
                            : "bg-transparent group-hover:bg-muted"
                        }
                      `}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        {!isCollapsed && (
                          <span className="text-sm font-medium ml-3 whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                      )}
                    </Link>
                  )}

                  {/* Submenu */}
                  {hasSubmenu && !isCollapsed && isExpanded && (
                    <ul className="mt-1 ml-6 space-y-1 border-l border-border/30 pl-3">
                      {item.submenu!.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            href={subItem.href}
                            onClick={() => handleItemClick(false)}
                            className={`
                            w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200
                            hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/10
                            ${
                              isActiveSubmenuItem(subItem.href)
                                ? "text-primary bg-primary/5 font-medium"
                                : "text-muted-foreground hover:text-foreground"
                            }
                          `}
                          >
                            <div
                              className={`
                            w-2 h-2 rounded-full mr-3 transition-all duration-200
                            ${
                              isActiveSubmenuItem(subItem.href)
                                ? "bg-primary scale-110"
                                : "bg-muted-foreground/40 group-hover:bg-muted-foreground/60"
                            }
                          `}
                            ></div>
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg text-sm font-medium text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-t border-border rotate-45" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-muted/20">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-green-600/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-medium text-foreground">
                  System Online
                </div>
                <div className="text-xs text-muted-foreground">v1.0.0</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500/20 to-green-600/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
