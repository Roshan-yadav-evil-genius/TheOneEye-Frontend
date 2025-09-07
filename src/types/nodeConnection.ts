import { NodeProps } from "@xyflow/react"
import React from "react"

export enum ENodeTypes {
    Watcher = "13b9c960-ba45-42b6-899d-72f98b6ea4db",
    CosineSimilarity = "1a7b39c0-8dc3-48c2-999f-042b27679d46",
}

export type TNodeTypeComponentMap = {
    type: ENodeTypes,
    component: (props: NodeProps) => React.JSX.Element
}

