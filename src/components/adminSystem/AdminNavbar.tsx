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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-[#8D153A]';
      case 'warning': return 'bg-[#FFC72C]';
      case 'success': return 'bg-[#008060]';
      default: return 'bg-[#FF5722]';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-[100] bg-gradient-to-b from-card/95 via-card/90 to-card/80 dark:from-card/98 dark:via-card/95 dark:to-card/90 backdrop-blur-md border-b border-border/50 shadow-sm modern-card overflow-visible">
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-25 dark:opacity-15 bg-center bg-no-repeat bg-cover transition-opacity duration-1000"
          style={{
            backgroundImage: 'url("/2.png")',
            backgroundPosition: 'center center',
            filter: 'saturate(1.1) brightness(1.05)',
          }}
        ></div>
        {/* Gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/30 dark:from-background/30 dark:via-transparent dark:to-background/40"></div>
      </div>
      
      <div className="z-10 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Left Section - Breadcrumb/Title */}
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <div>
              <h1 className="text-lg lg:text-xl font-bold">
                <span className="text-foreground">Admin</span>{' '}
                <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                  Panel
                </span>
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block font-medium">
                Government Link Administration
              </p>
            </div>
          </div>

          {/* Enhanced Center Section - Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-[#8D153A] transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search users, reports, settings..."
                className="w-full pl-10 pr-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
              />
            </div>
          </div>

          {/* Enhanced Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Enhanced Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 hover:bg-card/60 rounded-xl transition-all duration-300 hover:shadow-md modern-card hover:scale-105"
              >
                <Bell className="w-5 h-5 text-muted-foreground hover:text-[#8D153A] transition-colors duration-300" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#FF5722] to-[#FF5722]/90 text-white text-xs rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Enhanced Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card/95 dark:bg-card/98 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl z-[110] modern-card">
                  <div className="p-4 border-b border-border/30 bg-gradient-to-r from-[#8D153A]/5 to-[#FF5722]/5">
                    <h3 className="font-bold bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b border-border/20 hover:bg-card/60 transition-all duration-300 hover:shadow-sm ${
                          !notification.read ? 'bg-card/40' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full mt-1.5 shadow-sm ${getNotificationColor(notification.type)}`} />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-foreground">{notification.title}</h4>
                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground/80 mt-1 font-medium">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border/30 bg-gradient-to-r from-[#8D153A]/5 to-[#FF5722]/5">
                    <button className="w-full text-sm text-[#8D153A] hover:text-[#8D153A]/80 transition-colors font-semibold">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
          </div>

            {/* Enhanced Help */}
            <button className="p-2.5 hover:bg-card/60 rounded-xl transition-all duration-300 hover:shadow-md modern-card hover:scale-105">
              <HelpCircle className="w-5 h-5 text-muted-foreground hover:text-[#FFC72C] transition-colors duration-300" />
            </button>

          {/* Enhanced Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2.5 hover:bg-card/60 rounded-xl transition-all duration-300 hover:shadow-md modern-card hover:scale-105"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-[#8D153A]/20 to-[#FF5722]/20 rounded-full flex items-center justify-center border border-[#8D153A]/30 shadow-md">
                <span className="text-sm font-medium text-[#8D153A]">A</span>
              </div>
              <span className="hidden md:block text-sm font-medium text-foreground">Admin</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground hover:text-[#8D153A] transition-colors duration-300" />
            </button>

            {/* Enhanced Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-card/95 dark:bg-card/98 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl z-[110] modern-card">
                <div className="p-4 border-b border-border/30 bg-gradient-to-r from-[#8D153A]/5 to-[#FF5722]/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#8D153A]/20 to-[#FF5722]/20 rounded-full flex items-center justify-center border border-[#8D153A]/30 shadow-md">
                      <span className="text-sm font-medium text-[#8D153A]">A</span>
                    </div>
                    <div>
                      <h3 className="font-medium bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">Administrator</h3>
                      <p className="text-sm text-muted-foreground">admin@govlink.lk</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-card/60 hover:shadow-sm rounded-xl transition-all duration-300 hover:scale-105 modern-card">
                    <User className="w-4 h-4 text-[#8D153A]" />
                    <span className="text-foreground">Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-card/60 hover:shadow-sm rounded-xl transition-all duration-300 hover:scale-105 modern-card">
                    <Settings className="w-4 h-4 text-[#008060]" />
                    <span className="text-foreground">Admin Settings</span>
                  </button>
                  <hr className="my-2 border-border/30" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#FF5722] hover:bg-[#FF5722]/10 hover:shadow-sm rounded-xl transition-all duration-300 hover:scale-105 modern-card"
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

      {/* Enhanced Mobile Search */}
      <div className="md:hidden mt-4 px-4 lg:px-6">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-[#8D153A] transition-colors duration-300" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
          />
        </div>
      </div>
    </div>

      {/* Click outside handlers */}
      {(showProfileMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-[105]" 
          onClick={() => {
            setShowProfileMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}
