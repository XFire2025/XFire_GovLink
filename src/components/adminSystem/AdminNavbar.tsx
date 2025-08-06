"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Search, 
  LogOut, 
  User, 
  Settings, 
  HelpCircle,
  ChevronDown 
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminNavbar() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleLogout = () => {
    // Clear admin session and redirect to login
    router.push('/admin/login');
  };

  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'System Update',
      message: 'Scheduled maintenance tonight at 2 AM',
      time: '10 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'User Report',
      message: 'New user verification pending review',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Backup Complete',
      message: 'Daily backup completed successfully',
      time: '2 hours ago',
      read: true
    }
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Breadcrumb/Title */}
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <div>
              <h1 className="text-lg lg:text-xl font-semibold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Government Link Administration</p>
            </div>
          </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users, reports, settings..."
              className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-border hover:bg-muted/30 transition-colors ${
                        !notification.read ? 'bg-muted/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'info' ? 'bg-blue-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">A</span>
              </div>
              <span className="hidden md:block text-sm font-medium">Admin</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">A</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Administrator</h3>
                      <p className="text-sm text-muted-foreground">admin@govlink.lk</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    Admin Settings
                  </button>
                  <hr className="my-2 border-border" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-4 px-4 lg:px-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>
    </div>

      {/* Click outside handlers */}
      {(showProfileMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowProfileMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}
