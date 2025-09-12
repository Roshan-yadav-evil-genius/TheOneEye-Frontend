
export type TWorkFlow = {
    id: string,
    name: string,
    description: string,
    created_at: string,
    task_id: string,
    updated_at: string
}

export type TNodeType = {
    id: string;
    name: string;
    description: string;
    initiator: boolean;
};

export type TWorkFlowNodePosition = {
    position_x: number;
    position_y: number;
};

export type TWorkflowNode = {
    id: string;
    node_type: TNodeType;
    created_at: string;
    updated_at: string;
    data: Record<string, string>;
} & TWorkFlowNodePosition;


export type TWorkflowEdge = {
    id: string;
    source_node: string;
    target_node: string;
};

export type TExecutionResponse = {
    task_id:string,
    status:string
}