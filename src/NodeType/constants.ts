import React from "react";
import WatcherNode from "./WatcherNode";
import CosineSimilarityNode from "./CosineSimilarityNode";
import { NodeTypes, TNodeComponentMapping } from "@/types/nodeConnection";


const NodeTypeComponentMapping:TNodeComponentMapping[] = [
    { type: NodeTypes.Watcher, component: WatcherNode },
    { type: NodeTypes.CosineSimilarity, component: CosineSimilarityNode }
]

export const customNodeTypes=Object.fromEntries(
    NodeTypeComponentMapping.map((node)=>[node.type,node.component])
)