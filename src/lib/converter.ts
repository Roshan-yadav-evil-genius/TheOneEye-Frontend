import { ENodeTypes } from "@/constants/NodeTypes";

const NodeTypesValueMap: Record<string, ENodeTypes> = {
    [ENodeTypes.FreelanceJobs]: ENodeTypes.FreelanceJobs,
    [ENodeTypes.CosineSimilarity]: ENodeTypes.CosineSimilarity,
    [ENodeTypes.CookieStore]: ENodeTypes.CookieStore
};

export function cvtnodeTypesValueToEnum(value: string): ENodeTypes {
    return NodeTypesValueMap[value];
}