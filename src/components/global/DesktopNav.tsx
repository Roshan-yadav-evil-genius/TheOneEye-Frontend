import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, DollarSign, Users, BookOpen, LayoutDashboard, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  link: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  // { label: 'Dashboard', link: '/dashboard', icon: LayoutDashboard },
  // { label: 'Products', link: '#', icon: Package },
  // { label: 'Pricing', link: '#', icon: DollarSign },
  // { label: 'Clients', link: '#', icon: Users },
  // { label: 'Resources', link: '#', icon: BookOpen }
];

export const DesktopNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    // <nav className='hidden md:block'>
    <nav className=''>
      <div className='flex gap-4'>
        {navItems.map(item => {
          const isActive = pathname === item.link || 
            (item.link !== '/' && pathname.startsWith(item.link));
          
          return (
            <Link 
              key={item.label} 
              href={item.link} 
              className={`flex items-center gap-1 transition-colors ${
                isActive 
                  ? 'text-primary font-medium' 
                  : 'hover:text-primary hover:font-bold'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      <Button className='bg-primary text-primary-foreground hover:bg-primary/90' onClick={() => router.push('/dashboard')}>
        Login
      </Button>
      </div>
    </nav>
  );
};
