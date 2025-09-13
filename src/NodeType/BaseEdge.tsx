import { backendService } from '@/app/services/backend';
import { RootState } from '@/store/store';
import { BezierEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow } from '@xyflow/react'
import { X } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux';
import AnimatedEdge from './AnimatedEdge';

const BaseEdge = (props: EdgeProps) => {
    // Delete Icon Placement Logic
    const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;
    const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })

    // Delete Functionality
    const { setEdges } = useReactFlow();
    const workFlow_id = useSelector((state: RootState) => state.WorkFlow.id);
    const isExecuting = useSelector((state: RootState) => !!state.WorkFlow.task_id);

    const onDelete = async (edge_id: string) => {
        const isDeleted = await backendService.deleteWorkFlowConnection(workFlow_id, edge_id);
        if (isDeleted) {
            setEdges((eds) => eds.filter(eds => eds.id !== edge_id))
        }
    }

    // If workflow is executing, use animated edge, otherwise use regular edge
    if (isExecuting) {
        return <AnimatedEdge {...props} />;
    }

    return (
        <>
            <BezierEdge {...props}/>
            <EdgeLabelRenderer>
                <X
                    onClick={() => onDelete(props.id)}
                    style={{
                        position: 'absolute',
                        left: labelX,
                        top: labelY,
                        transform: `translate(-50%, -50%)`,
                    }}
                    pointerEvents="all"
                    className="text-red-200 hover:text-red-600 hover:cursor-pointer w-5"/>
            </EdgeLabelRenderer>
        </>
    )
}

export default BaseEdge