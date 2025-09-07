import React from "react";
import CosineSimilarity from "./Nodes/CosineSimilarity";
import { TCookieStoreNodeMap, TCosineSimilarityNodeMap, TFreelanceJobsNodeMap, TNodeTypeComponentMap } from "@/types/nodeConnection";
import BaseEdge from "./BaseEdge";
import { ENodeTypes } from "@/constants/NodeTypes";
import FreelanceJobs from "./Nodes/FreelanceJobs";
import CookieStore from "./Nodes/CookieStore";


// INFO: we did this way because we are going to store additional metdata fo reach node
export const NodeTypeMetaData: (
    TNodeTypeComponentMap | TCookieStoreNodeMap | TFreelanceJobsNodeMap | TCosineSimilarityNodeMap)[] = [
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
            type: ENodeTypes.CookieStore,
            icon: "https://cookie-editor.com/favicon.ico",
            component: CookieStore
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
    BaseEdge: BaseEdge
}