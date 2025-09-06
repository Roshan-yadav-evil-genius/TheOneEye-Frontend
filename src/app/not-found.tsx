"use client";
import { usePathname } from 'next/navigation'
import React from 'react'

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className='border rounded m-5 p-5 flex flex-col justify-center items-center gap-5'>
      <div className='text-5xl font-extrabold'>Page NotFound Error</div>
      <p className='text-blue-600'>{pathname}</p>
    </div>
  )
}

