import React from "react";
import CosineSimilarity from "./Nodes/CosineSimilarity";
import { TDeduplicatorMap, TCosineSimilarityNodeMap, TFreelanceJobsNodeMap, TNodeTypeComponentMap } from "@/types/nodeConnection";
import BaseEdge from "./BaseEdge";
import AnimatedEdge from "./AnimatedEdge";
import { ENodeTypes } from "@/constants/NodeTypes";
import FreelanceJobs from "./Nodes/FreelanceJobs";
import Deduplicator from "./Nodes/Deduplicator";


// INFO: we did this way because we are going to store additional metdata fo reach node
export const NodeTypeMetaData: (
    TNodeTypeComponentMap | TDeduplicatorMap | TFreelanceJobsNodeMap | TCosineSimilarityNodeMap)[] = [
        {
            type: ENodeTypes.FreelanceJobs,
            icon: "https://www.f-cdn.com/assets/main/en/assets/favicon.ico",
            component: FreelanceJobs
        },
        {
            type: ENodeTypes.CosineSimilarity,
            icon: "https://static.vecteezy.com/system/resources/previews/030/973/506/non_2x/similar-icon-vector.jpg",
            component: CosineSimilarity
        },
        {
            type: ENodeTypes.Deduplicator,
            icon: "https://tse2.mm.bing.net/th/id/OIP.mpkFR44j2xuj9psay9FvxwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
            component: Deduplicator
        }
    ]

export const getNodeAvatar = (type: ENodeTypes) => {
    const node = NodeTypeMetaData.find(n => n.type === type);
    return node ? node.icon : undefined;
}

export const customNodeTypes = Object.fromEntries(
    NodeTypeMetaData.map((node) => [node.type, node.component])
)

export const customEdgeTypes = {
    BaseEdge: BaseEdge,
    AnimatedEdge: AnimatedEdge
}