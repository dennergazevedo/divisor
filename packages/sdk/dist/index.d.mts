type DivisorConfig = {
    tenantId: string;
};
type ExperimentResult = {
    experiment: string;
    variant: string | null;
};

declare class DivisorClient {
    private tenantId;
    private edgeUrl;
    constructor(config: DivisorConfig);
    get(experimentName: string): Promise<ExperimentResult>;
}

export { DivisorClient, type DivisorConfig, type ExperimentResult };
