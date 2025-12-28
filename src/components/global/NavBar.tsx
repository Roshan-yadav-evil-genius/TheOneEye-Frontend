"use client";
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { MobileMenuToggle, MobileMenuOverlay, MobileMenu } from './MobileMenu';
import { useMobileMenu } from '@/hooks/useMobileMenu';

// Main NavBar Component
const NavBar = () => {
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();

  return (
    <>
      <header className='fixed right-0 left-0 top-0 p-4 z-50 flex items-center justify-between' style={{ backgroundColor: '#1A1D2B', borderBottom: '1px solid #2A2E3B' }}>
        <Logo />
        <DesktopNav />
        {/* <MobileMenuToggle isOpen={isOpen} onToggle={toggleMenu} /> */}
      </header>

      <MobileMenuOverlay isOpen={isOpen} onClose={closeMenu} />
      <MobileMenu isOpen={isOpen} onClose={closeMenu} />
    </>
  );
};

export default NavBar