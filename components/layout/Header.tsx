'use client';

import { Bell, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';

export default function Header() {
  const { data: session } = useSession();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const userName = session?.user?.name || 'Usuário';

  const handleSearch = () => {
    const q = searchValue.trim();
    if (q) {
      router.push(`/leads?q=${encodeURIComponent(q)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setSearchValue('');
      inputRef.current?.blur();
    }
  };

  return (
    <header className="h-[72px] flex items-center justify-between px-8 border-b border-dalva-border bg-dalva-bg/80 backdrop-blur-xl sticky top-0 z-40">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <button
          onClick={handleSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-dalva-text-muted hover:text-dalva-gold transition-colors"
          aria-label="Buscar"
        >
          <Search className="w-4 h-4" />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar leads, conversas... (Enter)"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-dalva-surface border transition-all duration-200 outline-none
            ${searchFocused
              ? 'border-dalva-gold/40 shadow-gold'
              : 'border-dalva-border hover:border-dalva-border-hover'
            }
            text-dalva-text-primary placeholder:text-dalva-text-muted
          `}
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group">
          <Bell className="w-5 h-5 text-dalva-text-muted group-hover:text-dalva-text-secondary transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-dalva-gold animate-pulse-soft" />
        </button>

        {/* User — Dynamic from session */}
        <div className="flex items-center gap-3 pl-4 border-l border-dalva-border">
          <div className="text-right">
            <p className="text-sm font-medium text-dalva-text-primary">{userName}</p>
            <p className="text-xs text-dalva-text-muted">Administrador</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-dalva-gold/80 to-dalva-gold-soft/80 flex items-center justify-center">
            <span className="text-xs font-bold text-dalva-bg">{getInitials(userName)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
