import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  LayoutDashboard,
  Search,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  BarChart3,
  CheckSquare,
  Home
} from 'lucide-react';
import { currentUser, notifications } from '../data/mockData';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { MobileNav } from './MobileNav';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
}

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const userNavItems: NavItem[] = [
    { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard' },
    { label: 'Find Rooms', icon: <Search className="h-5 w-5" />, path: '/rooms' },
    { label: 'My Bookings', icon: <Calendar className="h-5 w-5" />, path: '/bookings' },
  ];

  const adminNavItems: NavItem[] = [
    { label: 'Admin Dashboard', icon: <Shield className="h-5 w-5" />, path: '/admin', roles: ['admin'] },
    { label: 'Approvals', icon: <CheckSquare className="h-5 w-5" />, path: '/admin/approvals', roles: ['admin'] },
    { label: 'Room Management', icon: <Home className="h-5 w-5" />, path: '/admin/rooms', roles: ['admin'] },
    { label: 'Analytics', icon: <BarChart3 className="h-5 w-5" />, path: '/admin/analytics', roles: ['admin'] },
  ];

  const allNavItems = currentUser.role === 'admin' 
    ? [...userNavItems, ...adminNavItems]
    : userNavItems;

  const unreadCount = notifications.filter(n => !n.read).length;

  const NavLinks = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="space-y-1">
      {allNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              onItemClick?.();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center px-6 border-b">
                  <h1 className="text-xl font-bold text-primary">RoomifyU</h1>
                </div>
                <div className="p-4">
                  <NavLinks onItemClick={() => setMobileMenuOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <h1 className="text-xl font-bold text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>
              RoomifyU
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-4 py-3 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b hover:bg-muted cursor-pointer ${
                          !notification.read ? 'bg-accent/5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings & Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/login')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 border-r bg-card min-h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-4">
            <NavLinks />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}