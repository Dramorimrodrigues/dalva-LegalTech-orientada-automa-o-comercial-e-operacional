'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-dalva-bg flex items-center justify-center">
      <div className="animate-pulse-soft">
        <span className="text-gradient-gold text-3xl font-bold">Dalva</span>
      </div>
    </div>
  );
}
