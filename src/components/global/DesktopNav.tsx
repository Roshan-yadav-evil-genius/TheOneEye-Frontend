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
  { label: 'About', link: '/about', icon: BookOpen },
  { label: 'Contact', link: '/contact', icon: Mail },
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
    <nav className=''>
      <div className='flex gap-4 items-center'>
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
        <Button 
          className='bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded' 
          onClick={() => router.push('/dashboard')}
        >
          My Account
        </Button>
      </div>
    </nav>
  );
};
