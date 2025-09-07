import React from "react";
import WatcherNode from "./WatcherNode";
import CosineSimilarityNode from "./CosineSimilarityNode";
import { ENodeTypes,TNodeTypeComponentMap } from "@/types/nodeConnection";
import BaseEdge from "./BaseEdge";



const NodeTypeComponentMap: TNodeTypeComponentMap[] = [
    { type: ENodeTypes.Watcher, component: WatcherNode },
    { type: ENodeTypes.CosineSimilarity, component: CosineSimilarityNode }
]

const NodeTypesValueMap: Record<string, ENodeTypes> = {
    [ENodeTypes.Watcher]: ENodeTypes.Watcher,
    [ENodeTypes.CosineSimilarity]: ENodeTypes.CosineSimilarity,
};

export function nodeTypesValueToEnum(value: string): ENodeTypes {
    return NodeTypesValueMap[value];
}

export const customNodeTypes = Object.fromEntries(
    NodeTypeComponentMap.map((node) => [node.type, node.component])
)

export const customEdgeTypes={
    BaseEdge:BaseEdge
}