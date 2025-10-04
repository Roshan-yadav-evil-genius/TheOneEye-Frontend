import { MenuIcon, XIcon, Package, DollarSign, Users, BookOpen, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MobileMenuHeaderProps {
  onClose: () => void;
}

interface MobileNavLinksProps {
  onClose: () => void;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mobile Menu Toggle Button Component
export const MobileMenuToggle = ({ isOpen, onToggle }: MobileMenuToggleProps) => (
  <button
    onClick={onToggle}
    className='cursor-pointer dark:hover:bg-slate-950 hover:bg-slate-200 px-2 py-1 rounded md:hidden'
  >
    {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
  </button>
);

// Mobile Menu Overlay Component
export const MobileMenuOverlay = ({ isOpen, onClose }: MobileMenuOverlayProps) => (
  isOpen && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      onClick={onClose}
    />
  )
);

// Mobile Menu Header Component
export const MobileMenuHeader = ({ onClose }: MobileMenuHeaderProps) => (
  <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
    <p className="text-xl font-bold">Menu</p>
    <button
      onClick={onClose}
      className="cursor-pointer dark:hover:bg-slate-950 hover:bg-slate-200 px-2 py-1 rounded"
    >
      <XIcon size={24} />
    </button>
  </div>
);

// Mobile Navigation Links Component
export const MobileNavLinks = ({ onClose }: MobileNavLinksProps) => {
  const pathname = usePathname();
  
  return (
    <nav className="flex-1 p-6">
      <div className="flex flex-col gap-6">
        {navItems.map(item => {
          const isActive = pathname === item.link || 
            (item.link !== '/' && pathname.startsWith(item.link));
          
          return (
            <Link
              key={item.label}
              href={item.link}
              onClick={onClose}
              className={`flex items-center gap-3 text-lg font-medium transition-colors ${
                isActive 
                  ? 'text-yellow-600 dark:text-yellow-400 font-semibold' 
                  : 'hover:text-yellow-600 dark:hover:text-yellow-400'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

// Mobile Menu Footer Component
export const MobileMenuFooter = () => (
  <div className="p-6 border-t border-slate-200 dark:border-slate-700">
    {/* Footer content can be added here if needed */}
  </div>
);

// Mobile Menu Component
export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => (
  <div className={`fixed top-0 right-0 h-full w-80 bg-slate-100 dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
    <div className="flex flex-col h-full">
      <MobileMenuHeader onClose={onClose} />
      <MobileNavLinks onClose={onClose} />
      <MobileMenuFooter />
    </div>
  </div>
);
