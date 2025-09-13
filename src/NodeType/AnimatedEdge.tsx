import { backendService } from '@/app/services/backend';
import { RootState } from '@/store/store';
import { BezierEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow } from '@xyflow/react'
import { X } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux';

const AnimatedEdge = (props: EdgeProps) => {
    // Delete Icon Placement Logic
    const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;
    const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })

    // Delete Functionality
    const { setEdges } = useReactFlow();
    const workFlow_id = useSelector((state: RootState) => state.WorkFlow.id);

    const onDelete = async (edge_id: string) => {
        const isDeleted = await backendService.deleteWorkFlowConnection(workFlow_id, edge_id);
        if (isDeleted) {
            setEdges((eds) => eds.filter(eds => eds.id !== edge_id))
        }
    }

    return (
        <>
            {/* Animated Bezier Edge */}
            <g>
                <defs>
                    <linearGradient id={`gradient-${props.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8">
                            <animate attributeName="stop-opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1">
                            <animate attributeName="stop-opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8">
                            <animate attributeName="stop-opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                        </stop>
                    </linearGradient>
                </defs>
                <path
                    d={edgePath}
                    stroke={`url(#gradient-${props.id})`}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10,5"
                    strokeDashoffset="0"
                    style={{
                        animation: 'dash 2s linear infinite'
                    }}
                />
                {/* Animated dots flowing along the path */}
                <circle r="5" fill="#DA4646">
                    <animateMotion dur="3s" repeatCount="indefinite">
                        <mpath href={`#path-${props.id}`} />
                    </animateMotion>
                </circle>
                <path id={`path-${props.id}`} d={edgePath} fill="none" stroke="none" />
            </g>
            
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
            
            <style jsx>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -15;
                    }
                }
            `}</style>
        </>
    )
}

export default AnimatedEdge;
