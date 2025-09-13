import React from "react";
import CosineSimilarity from "./Nodes/CosineSimilarity";
import { TDeduplicatorMap, TCosineSimilarityNodeMap, TInFiniteBrowserOperationNodeMap, TNodeTypeComponentMap, TAiAgentNodeMap } from "@/types/nodeConnection";
import BaseEdge from "./BaseEdge";
import AnimatedEdge from "./AnimatedEdge";
import { ENodeTypes } from "@/NodeType/NodeTypes";
import InFiniteBrowserOperation from "./Nodes/InFiniteBrowserOperation";
import Deduplicator from "./Nodes/Deduplicator";
import AiAgent from "./Nodes/AiAgent";
import FiniteBrowserOperation from "./Nodes/FiniteBrowserOperation";


// INFO: we did this way because we are going to store additional metdata fo reach node
export const NodeTypeMetaData: (
    TNodeTypeComponentMap | TAiAgentNodeMap | TDeduplicatorMap | TInFiniteBrowserOperationNodeMap | TCosineSimilarityNodeMap)[] = [
        {
            type: ENodeTypes.InFiniteBrowserOperation,
            icon: "https://edgestatic.azureedge.net/welcome/static/favicon.png",
            component: InFiniteBrowserOperation
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
        },
        {
            type: ENodeTypes.AiAgent,
            icon: "https://tse4.mm.bing.net/th/id/OIP.5V5bspqYOeNUnV7hj7ck4gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
            component: AiAgent
        },
        {
            type: ENodeTypes.FiniteBrowserOperation,
            icon: "https://edgestatic.azureedge.net/welcome/static/favicon.png",
            component: FiniteBrowserOperation
        },
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