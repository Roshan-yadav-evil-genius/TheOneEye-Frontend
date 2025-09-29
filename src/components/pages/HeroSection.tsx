import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { SparklesCore } from '../ui/sparkles';
const HeroSection = () => {
    return (
        <section className='flex flex-col justify-center items-center mt-50'>
            <BackgroundRippleEffect />
            <main className='max-w-2xl flex flex-col justify-center items-center gap-10'>

                <span className='my-5 text-center bg-gradient-to-r from-yellow-900 to-yellow-500 font-bold rounded-2xl p-1'>
                    ✨Join Our Waiting List & Enjoy 1 Month Free.
                </span>
                <div className='flex flex-col gap-5'>
                    <h1 className='text-6xl font-bold text-center'>
                        Tired of Missing Online Opportunities?
                    </h1>
                    <h4 className='text-center text-xl text-slate-500 font-bold'>
                        Fully managed {" "}
                        Automation-as-a-Service
                        that handles repetitive tasks, letting your team focus on growth.
                    </h4>
                </div>
                <div className='w-full px-10'>
                    <form action="" method="post" className='flex gap-2 border-2 rounded-2xl p-2 max-w-lg'>
                        <Input type="email" className='h-10' placeholder="Enter your email" />
                        <Button variant="default" className='h-10'>Sign Up</Button>
                    </form>
                </div>
            </main>

        </section>
    )
}

export default HeroSection