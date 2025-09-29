"use client";
import { MenuIcon, XIcon, Package, DollarSign, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Types
interface NavItem {
    label: string
    link: string
    icon: React.ComponentType<{ size?: number; className?: string }>
}

interface DashboardButtonProps {
    className?: string
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
    { label: 'Products', link: '#', icon: Package },
    { label: 'Pricing', link: '#', icon: DollarSign },
    { label: 'Clients', link: '#', icon: Users },
    { label: 'Resources', link: '#', icon: BookOpen }
]

// Reusable Dashboard Button Component
const DashboardButton = ({ className = "" }: DashboardButtonProps) => (
    <button className={`relative inline-flex overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${className}`}>
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-100 dark:bg-slate-950 px-3 py-1 text-sm font-bold backdrop-blur-3xl">
            Dashboard
        </span>
    </button>
)

// Logo Component
const Logo = () => (
    <p className='text-2xl font-bold'>TheOneEye</p>
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
        <DashboardButton className="w-full h-10" />
    </div>
)

// Mobile Menu Component
const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => (
    <div className={`fixed top-0 right-0 h-full w-80 bg-slate-100 dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
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
                    <DashboardButton className="h-8" />
                    <MobileMenuToggle isOpen={isOpen} onToggle={toggleMenu} />
                </div>
            </header>

            <MobileMenuOverlay isOpen={isOpen} onClose={closeMenu} />
            <MobileMenu isOpen={isOpen} onClose={closeMenu} />
        </>
    )
}

export default NavBar