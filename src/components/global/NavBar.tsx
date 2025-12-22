"use client";
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { MobileMenuToggle, MobileMenuOverlay, MobileMenu } from './MobileMenu';
import { useMobileMenu } from '@/hooks/useMobileMenu';

// Main NavBar Component
interface NavBarProps {
  onBookDemo?: () => void;
}

const NavBar = ({ onBookDemo }: NavBarProps) => {
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();

  return (
    <>
      <header className='fixed right-0 left-0 top-0 p-4 bg-slate-100 dark:bg-slate-900 backdrop-blur-lg z-50 rounded border-2 flex items-center justify-between'>
        <Logo />
        <DesktopNav onBookDemo={onBookDemo} />
        {/* <MobileMenuToggle isOpen={isOpen} onToggle={toggleMenu} /> */}
      </header>

      <MobileMenuOverlay isOpen={isOpen} onClose={closeMenu} />
      <MobileMenu isOpen={isOpen} onClose={closeMenu} />
    </>
  );
};

export default NavBar