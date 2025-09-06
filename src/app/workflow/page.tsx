import React from 'react'
import { backendService } from '../services/backend'
import Link from 'next/link';

const WorkFlow = async () => {
  const workflows = await backendService.getWorkFlows();
  return (
    <div className='m-5'>
      <h1>WorkFlows</h1>
      <ul>
        {workflows.map((workflow, index) => {
          return (
            <li key={index}>
              <Link href={`/workflow/${workflow.id}`} className='border rounded m-5 p-5 flex flex-col'>
                <p className='font-bold'>{workflow.name}</p>
                <p className='text-sm'>{workflow.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export default WorkFlow