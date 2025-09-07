import { ENodeTypes } from "@/constants/NodeTypes"
import { NodeProps } from "@xyflow/react"
import React from "react"


export type TNodeTypeComponentMap = {
    type: ENodeTypes,
    component: (props: NodeProps) => React.JSX.Element
}

