export enum ENodeTypes {
    InFiniteBrowserOperation = "13b9c960-ba45-42b6-899d-72f98b6ea4db",
    CosineSimilarity = "1a7b39c0-8dc3-48c2-999f-042b27679d46",
    Deduplicator = "5c4cc05b-7b3f-46ad-8ccc-aaf4a29621c6",
    AiAgent = "85a05278-658a-423e-8f77-44984cdb8f01",
    FiniteBrowserOperation="d7129df1-103b-41a6-9185-e6e9231305c2"
}

export const NodeTypesValueToEnum: Record<string, ENodeTypes> = 
  Object.values(ENodeTypes).reduce(
    (acc, val) => ({ ...acc, [val]: val }),
    {} as Record<string, ENodeTypes>
  );
