import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, DollarSign, Users, BookOpen, LayoutDashboard } from 'lucide-react';

interface NavItem {
  label: string;
  link: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', link: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', link: '#', icon: Package },
  { label: 'Pricing', link: '#', icon: DollarSign },
  { label: 'Clients', link: '#', icon: Users },
  { label: 'Resources', link: '#', icon: BookOpen }
];

export const DesktopNav = () => {
  const pathname = usePathname();
  
  return (
    <nav className='absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block'>
      <div className='flex gap-4'>
        {navItems.map(item => {
          const isActive = pathname === item.link || 
            (item.link !== '/' && pathname.startsWith(item.link));
          
          return (
            <Link 
              key={item.label} 
              href={item.link} 
              className={`flex items-center gap-2 transition-colors ${
                isActive 
                  ? 'text-yellow-600 dark:text-yellow-400 font-medium' 
                  : 'hover:text-yellow-600 dark:hover:text-yellow-400'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
