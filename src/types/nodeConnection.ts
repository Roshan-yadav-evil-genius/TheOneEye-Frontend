import { ENodeTypes } from "@/NodeType/NodeTypes"
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

export type TInFiniteBrowserOperationProps = Omit<NodeProps, "data"> & {
    data: {
        projectPageUrl: string,
        executionMode: string
    }
}
export type TInFiniteBrowserOperationNodeMap = TNodeTypeComponentMap<TInFiniteBrowserOperationProps>

export type TCosineSimilarityProps = Omit<NodeProps, "data"> & {
    data: {
        input: string,
        threshold:number
    }
}
export type TCosineSimilarityNodeMap = TNodeTypeComponentMap<TCosineSimilarityProps>


export type TAiAgentProps = Omit<NodeProps, "data"> & {
    data: {
        system_prompt: string,
    }
}
export type TAiAgentNodeMap = TNodeTypeComponentMap<TAiAgentProps>
