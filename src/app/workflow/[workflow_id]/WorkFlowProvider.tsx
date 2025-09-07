"use client"
import { GlobalObjectStore } from '@/store/store'
import React from 'react'
import { Provider } from 'react-redux'
import WorkFlowEditor from './WorkFlowEditor'

const WorkFlowProvider = ({workflow_id}:{ workflow_id: string }) => {
    return (
        <Provider store={GlobalObjectStore}>
            <WorkFlowEditor WorkFlow_id={workflow_id} />
        </Provider>
    )
}

export default WorkFlowProvider