import React from 'react'
import FeatureCards from './FeatureCards'

const FeaturesSection = () => {
  return (
    <section className='flex items-center flex-col gap-10 mt-20'>
      <div className='border-2 px-3 py-1 rounded-2xl flex gap-2 items-center border-yellow-600'>
        <div className="w-2 h-2 rounded-full bg-yellow-600 animate-ping"></div>
        <p className='hover:text-yellow-600 font-bold'>Features</p>
      </div>
      <FeatureCards />
    </section>
  )
}

export default FeaturesSection