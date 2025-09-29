"use client";
import { MenuIcon, XIcon, Package, DollarSign, Users, BookOpen, LayoutDashboard } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link'
import { useState } from 'react'

// Types
interface NavItem {
    label: string
    link: string
    icon: React.ComponentType<{ size?: number; className?: string }>
}


interface MobileMenuToggleProps {
    isOpen: boolean
    onToggle: () => void
}

interface MobileMenuOverlayProps {
    isOpen: boolean
    onClose: () => void
}

interface MobileMenuHeaderProps {
    onClose: () => void
}

interface MobileNavLinksProps {
    onClose: () => void
}

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
}

// Constants
const navItems: NavItem[] = [
    { label: 'Dashboard', link: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', link: '#', icon: Package },
    { label: 'Pricing', link: '#', icon: DollarSign },
    { label: 'Clients', link: '#', icon: Users },
    { label: 'Resources', link: '#', icon: BookOpen }
]


// Logo Component
const Logo = () => (
    <Link href="/" className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
        <Image src="/logo.png" width={70} height={10} alt='TheOneEye' />
        <p className='text-2xl font-bold'>TheOneEye</p>
    </Link>
)

// Desktop Navigation Component
const DesktopNav = () => (
    <nav className='absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block'>
        <div className='flex gap-4'>
            {navItems.map(item => (
                <Link key={item.label} href={item.link} className="flex items-center gap-2 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                    <item.icon size={16} />
                    {item.label}
                </Link>
            ))}
        </div>
    </nav>
)

// Mobile Menu Toggle Button Component
const MobileMenuToggle = ({ isOpen, onToggle }: MobileMenuToggleProps) => (
    <button
        onClick={onToggle}
        className='cursor-pointer dark:hover:bg-slate-950 hover:bg-slate-200 px-2 py-1 rounded md:hidden'
    >
        {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
    </button>
)

// Mobile Menu Overlay Component
const MobileMenuOverlay = ({ isOpen, onClose }: MobileMenuOverlayProps) => (
    isOpen && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
        />
    )
)

// Mobile Menu Header Component
const MobileMenuHeader = ({ onClose }: MobileMenuHeaderProps) => (
    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
        <p className="text-xl font-bold">Menu</p>
        <button
            onClick={onClose}
            className="cursor-pointer dark:hover:bg-slate-950 hover:bg-slate-200 px-2 py-1 rounded"
        >
            <XIcon size={24} />
        </button>
    </div>
)

// Mobile Navigation Links Component
const MobileNavLinks = ({ onClose }: MobileNavLinksProps) => (
    <nav className="flex-1 p-6">
        <div className="flex flex-col gap-6">
            {navItems.map(item => (
                <Link
                    key={item.label}
                    href={item.link}
                    onClick={onClose}
                    className="flex items-center gap-3 text-lg font-medium hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                    <item.icon size={20} />
                    {item.label}
                </Link>
            ))}
        </div>
    </nav>
)

// Mobile Menu Footer Component
const MobileMenuFooter = () => (
    <div className="p-6 border-t border-slate-200 dark:border-slate-700">
        {/* Footer content can be added here if needed */}
    </div>
)

// Mobile Menu Component
const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => (
    <div className={`fixed top-0 right-0 h-full w-80 bg-slate-100 dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
            <MobileMenuHeader onClose={onClose} />
            <MobileNavLinks onClose={onClose} />
            <MobileMenuFooter />
        </div>
    </div>
)

// Main NavBar Component
const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)
    const closeMenu = () => setIsOpen(false)

    return (
        <>
            <header className='fixed right-0 left-0 top-0 p-4 bg-slate-100 dark:bg-slate-900 backdrop-blur-lg z-50 rounded border-2 flex items-center justify-between'>
                <Logo />
                <DesktopNav />
                <div className='flex items-center gap-4'>
                    <MobileMenuToggle isOpen={isOpen} onToggle={toggleMenu} />
                </div>
            </header>

            <MobileMenuOverlay isOpen={isOpen} onClose={closeMenu} />
            <MobileMenu isOpen={isOpen} onClose={closeMenu} />
        </>
    )
}

export default NavBar