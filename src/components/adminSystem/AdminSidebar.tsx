"use client";

import React, { useState } from "react";
import { 
  Menu, 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  UserCog, 
  FileText, 
  Settings,
  ChevronDown
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: {
    id: string;
    label: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Admin Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: Users,
    submenu: [
      { id: 'normal-users', label: 'Normal Users' },
      { id: 'agents', label: 'Agents' },
    ],
  },
  {
    id: 'user-verification',
    label: 'User Verification',
    icon: ShieldCheck,
  },
  {
    id: 'customer-agent',
    label: 'Customer/Agent Management',
    icon: UserCog,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
  },
  {
    id: 'system-configuration',
    label: 'System Configuration',
    icon: Settings,
  },
];

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['user-management']);

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

  const handleItemClick = (itemId: string, hasSubmenu: boolean = false) => {
    if (hasSubmenu) {
      toggleSubmenu(itemId);
    } else {
      onTabChange(itemId);
    }
  };

  const isActiveItem = (itemId: string) => {
    // Check if this is the active tab directly
    if (activeTab === itemId) return true;
    
    // Check if any submenu item is active for this parent
    const item = menuItems.find(menu => menu.id === itemId);
    if (item?.submenu) {
      return item.submenu.some(sub => sub.id === activeTab);
    }
    
    return false;
  };

  const isActiveSubmenuItem = (subItemId: string) => {
    return activeTab === subItemId;
  };

  return (
    <div className={`
      bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header with toggle button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenus.includes(item.id);
            const isActive = isActiveItem(item.id);

            return (
              <li key={item.id}>
                {/* Main menu item */}
                <button
                  onClick={() => handleItemClick(item.id, hasSubmenu)}
                  className={`
                    w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-gray-800 border-r-2 border-blue-400' 
                      : 'hover:bg-gray-800'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-between'}
                  `}
                >
                  <div className="flex items-center">
                    <IconComponent className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                  
                  {/* Chevron for submenu items */}
                  {hasSubmenu && !isCollapsed && (
                    <ChevronDown 
                      className={`
                        w-4 h-4 transition-transform duration-200
                        ${isExpanded ? 'rotate-180' : 'rotate-0'}
                      `}
                    />
                  )}
                </button>

                {/* Submenu */}
                {hasSubmenu && !isCollapsed && isExpanded && (
                  <ul className="mt-1 ml-4 space-y-1">
                    {item.submenu!.map((subItem) => (
                      <li key={subItem.id}>
                        <button
                          onClick={() => onTabChange(subItem.id)}
                          className={`
                            w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-200
                            ${isActiveSubmenuItem(subItem.id)
                              ? 'text-blue-400 bg-gray-700'
                              : 'text-gray-300 hover:bg-gray-700'
                            }
                          `}
                        >
                          <div className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"></div>
                          {subItem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="hidden group-hover:block absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer (optional) */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="text-xs text-gray-400 text-center">
            Admin Panel v1.0
          </div>
        )}
      </div>
    </div>
  );
}
