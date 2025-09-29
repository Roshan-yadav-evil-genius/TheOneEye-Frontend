import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '../ui/card'
import { FaUsersGear } from 'react-icons/fa6'
import { GiRobotGrab } from 'react-icons/gi'
import { MdOutlineSecurity } from 'react-icons/md'
import { TbDeviceHeartMonitorFilled } from 'react-icons/tb'
import { SiGoogledocs } from 'react-icons/si'

const FeatureCards = () => {
  return (
    <main className='flex flex-col wrap-normal gap-8 lg:flex-row items-stretch'>
      <Card className='hover:border-yellow-800 flex-1'>
        <CardContent className='flex justify-center'>
          <FaUsersGear size={80}/>
        </CardContent>
        <CardHeader className='text-2xl text-center font-bold'>Fully Managed <br />"Automation-as-a-Service"</CardHeader>
        <CardDescription className='px-5'>A complete, hands-off automation solution — we build, manage, and maintain your workflows so you focus only on results, not tools.</CardDescription>
      </Card>
      <Card className='hover:border-yellow-800 flex-1'>
        <CardContent className='flex justify-center'>
          <GiRobotGrab  size={80}/>
        </CardContent>
        <CardHeader className='text-2xl text-center font-bold'>AI-Enhanced Intelligent Actions</CardHeader>
        <CardDescription className='px-5'>Go beyond alerts — detect opportunities, generate tailored proposals, and act instantly to win more business with less effort.</CardDescription>
      </Card>
      <Card className='hover:border-yellow-800 flex-1'>
        <CardContent className='flex justify-center'>
          <MdOutlineSecurity  size={80}/>
        </CardContent>
        <CardHeader className='text-2xl text-center font-bold'>Enterprise-Grade Security & Reliability</CardHeader>
        <CardDescription className='px-5'>Each workflow runs in its own isolated container, ensuring maximum security, stability, and trust for mission-critical operations.</CardDescription>
      </Card>
      <Card className='hover:border-yellow-800 flex-1'>
        <CardContent className='flex justify-center'>
          <TbDeviceHeartMonitorFilled  size={80}/>
        </CardContent>
        <CardHeader className='text-2xl text-center font-bold'>Flexible Client Control Portal</CardHeader>
        <CardDescription className='px-5'>Stay in charge of sensitive credentials and strategy settings without dealing with technical complexity.</CardDescription>
      </Card>
      <Card className='hover:border-yellow-800 flex-1'>
        <CardContent className='flex justify-center'>
          <SiGoogledocs size={80}/>
        </CardContent>
        <CardHeader className='text-2xl text-center font-bold'>Personalized Automation Audit</CardHeader>
        <CardDescription className='px-5'>Stay in charge of sensitive credentials and strategy settings without dealing with technical complexity.</CardDescription>
      </Card>
    </main>
  )
}

export default FeatureCards