'use client';

import { Home, LineChart, Sparkles, User, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Insights',
    href: '/insights',
    icon: LineChart,
  },
  {
    name: 'Calm',
    href: '/calm',
    icon: Sparkles,
  },
  {
    name: 'Login',
    href: '/auth/login',
    icon: LogIn,
  },
  {
    name: 'Signup',
    href: '/auth/signup',
    icon: UserPlus,
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 pb-safe">
      <div className="flex items-center justify-around h-16 md:h-20">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full',
                'transition-all duration-200',
                'group',
                isActive ? 'text-primary' : 'text-muted-foreground',
                'hover:text-primary'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-6 h-6 md:w-7 md:h-7 transition-transform duration-200',
                    isActive ? 'scale-110' : 'scale-100',
                    'group-hover:scale-110'
                  )}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
              <span
                className={cn(
                  'text-xs mt-1 font-medium',
                  isActive ? 'opacity-100' : 'opacity-70'
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
