import React from "react";
import CosineSimilarityNode from "./Nodes/CosineSimilarityNode";
import { TNodeTypeComponentMap } from "@/types/nodeConnection";
import BaseEdge from "./BaseEdge";
import { ENodeTypes } from "@/constants/NodeTypes";
import WatcherNode from "./Nodes/WatcherNode";
import CookieStore from "./Nodes/CookieStore";


// INFO: we did this way because we are going to store additional metdata fo reach node
export const NodeTypeMetaData: TNodeTypeComponentMap[] = [
    { type: ENodeTypes.Watcher, component: WatcherNode },
    { type: ENodeTypes.CosineSimilarity, component: CosineSimilarityNode },
    { type: ENodeTypes.CookieStore, component: CookieStore }
]


export const customNodeTypes = Object.fromEntries(
    NodeTypeMetaData.map((node) => [node.type, node.component])
)

export const customEdgeTypes={
    BaseEdge:BaseEdge
}