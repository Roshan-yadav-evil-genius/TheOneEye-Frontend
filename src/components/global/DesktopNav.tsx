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

interface DesktopNavProps {
  onBookDemo?: () => void;
}

export const DesktopNav = ({ onBookDemo }: DesktopNavProps) => {
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
        {onBookDemo && (
          <Button 
            className='bg-primary text-primary-foreground hover:bg-primary/90' 
            onClick={onBookDemo}
          >
            Apply for Systems Audit
          </Button>
        )}
        <Button className='bg-slate-700 text-slate-50 hover:bg-slate-600' onClick={() => router.push('/dashboard')}>
          Login
        </Button>
      </div>
    </nav>
  );
};
