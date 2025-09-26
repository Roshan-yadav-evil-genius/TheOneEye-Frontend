import { NodeProps } from "@xyflow/react"
import { TNodeType } from "./backendService"



export type TBaseNodeProps = Omit<NodeProps, "data"> & {
    data: {
        node_type: TNodeType,
        config: Record<string, any>
    }
}