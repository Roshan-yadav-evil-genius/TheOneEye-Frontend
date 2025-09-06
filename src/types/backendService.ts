
export type WorkFlow = {
    id: string,
    name: string,
    description: string,
    created_at: string,
    task_id: string,
    updated_at: string
}

export type NodeType = {
    id: string;
    name: string;
    description: string;
    initiator: boolean;
};

export type WorkflowNode = {
    id: string;
    node_type: NodeType;
    created_at: string;
    updated_at: string;
    position_x: number;
    position_y: number;
    data: Record<string, string>;
};