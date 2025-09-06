import { Input } from '@/components/ui/input'
import React from 'react'
import { Button } from "@/components/ui/button"

const SideBar = () => {
  return (
    <div className="border rounded m-2 p-2 gap-2 flex flex-col">
      <Input type='text' placeholder='Search . . .'/>
      <div className='flex gap-2 flex-wrap justify-center'>
      <Button variant="outline">Button</Button>
      <Button variant="outline">Button</Button>
      <Button variant="outline">Button</Button>
      </div>
      <ul>
        
      </ul>
    </div>
  )
}

export default SideBar