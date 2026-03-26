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
      <header className="fixed right-0 left-0 top-0 z-50 flex items-center justify-between border-b border-border bg-background p-4">
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