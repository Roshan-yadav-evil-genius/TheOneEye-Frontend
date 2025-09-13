import { ENodeTypes, NodeTypesValueToEnum } from "@/NodeType/NodeTypes";



export function cvtnodeTypesValueToEnum(value: string): ENodeTypes {
    return NodeTypesValueToEnum[value];
}