import { ENodeTypes } from "@/constants/NodeTypes"
import { NodeProps } from "@xyflow/react"
import React from "react"

export type TNodeTypeComponentMap<T = NodeProps> = {
    type: ENodeTypes,
    icon:string,
    component: (props: T) => React.JSX.Element
}

export type TDeduplicatorProps = Omit<NodeProps, "data"> & {
    data: { cookies: string }
}
export type TDeduplicatorMap = TNodeTypeComponentMap<TDeduplicatorProps>

export type TFreelanceJobsProps = Omit<NodeProps, "data"> & {
    data: {
        projectPageUrl: string,
        executionMode: string
    }
}
export type TFreelanceJobsNodeMap = TNodeTypeComponentMap<TFreelanceJobsProps>

export type TCosineSimilarityProps = Omit<NodeProps, "data"> & {
    data: {
        input: string,
        threshold:number
    }
}
export type TCosineSimilarityNodeMap = TNodeTypeComponentMap<TCosineSimilarityProps>
