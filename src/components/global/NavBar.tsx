import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NavBar = () => {
    return (
        <header className='fixed right-0 left-0 top-0 p-4 bg-slate-100 dark:bg-slate-900 backdrop-blur-lg z-50 rounded border-2 flex items-center justify-between'>
            <aside className='flex items-center'>
                <p className='text-2xl font-bold'>TheOneEye</p>
            </aside>
            <nav className='absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block'>
                <span className='flex gap-4'>
                    <Link href="#">Products</Link>
                    <Link href="#">Pricing</Link>
                    <Link href="#">Clients</Link>
                    <Link href="#">Resources</Link>
                </span>
            </nav>
            <aside className='flex items-center gap-4'>
                <button className="relative inline-flex h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-100 dark:bg-slate-950 px-3 py-1 text-sm font-bold backdrop-blur-3xl">
                        Dashboard
                    </span>
                </button>
                <button className='cursor-pointer dark:hover:bg-slate-950 hover:bg-slate-200 px-2 py-1 rounded md:hidden'>
                    <MenuIcon/>
                </button>
            </aside>
        </header>
    )
}

export default NavBar