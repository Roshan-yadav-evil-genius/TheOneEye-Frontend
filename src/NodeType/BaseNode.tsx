import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EllipsisVertical, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

type BaseNodeProps = React.HTMLAttributes<HTMLElement> & {
    id: string
    title: string,
    avatar?: string,
    selected?:boolean,
    children: React.ReactNode
}

const BaseNode = ({ id, title, avatar, children,selected=false, className = '', ...rest }: BaseNodeProps) => {
    return (
        <section
            className={
                cn("border rounded p-1 bg-white flex flex-col gap-2 min-w-[300px]",
                    selected && "border-gray-900",
                    className)}
            {...rest}
        >
            <header className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage width={50} src={avatar} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className='font-bold text-gray-800'>{title}</h1>
                </div>
                <div className='dragByVerticalGrip'>
                    <GripVertical/>
                </div>
            </header>
            <main className='border rounded p-2'>
                {children}
            </main>
            <footer className='text-xs text-gray-500'>Id: {id}</footer>
        </section>
    )
}

export default BaseNode