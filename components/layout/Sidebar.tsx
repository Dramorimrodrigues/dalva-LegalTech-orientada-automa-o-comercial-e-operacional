'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Kanban,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Bot,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/kanban', label: 'Kanban', icon: Kanban },
  { href: '/conversas', label: 'Conversas', icon: MessageSquare },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <aside
      className={cn(
        'glass-sidebar fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[72px] border-b border-dalva-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-dalva-gold to-dalva-gold-soft flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-dalva-bg" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-gradient-gold text-lg font-bold leading-tight">Dalva</h1>
            <p className="text-[10px] text-dalva-text-muted tracking-wider uppercase">Amorim Rodrigues</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-dalva-gold-muted text-dalva-gold border border-dalva-gold/20'
                  : 'text-dalva-text-secondary hover:text-dalva-text-primary hover:bg-white/[0.04]'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  active ? 'text-dalva-gold' : 'text-dalva-text-muted group-hover:text-dalva-text-secondary'
                )}
              />
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-dalva-gold animate-pulse-soft" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2">
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dalva-text-muted hover:text-dalva-text-secondary hover:bg-white/[0.04] transition-all w-full"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 flex-shrink-0" />
              <span>Recolher</span>
            </>
          )}
        </button>

        {/* Logout — Real session invalidation */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dalva-text-muted hover:text-red-400 hover:bg-red-400/[0.06] transition-all w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
