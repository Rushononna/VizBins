export interface QuarterlyData {
    quarter: string;
    year?: number; // Optional as it might be derived or not present in raw constants
    newDirect: number;
    oldDirect: number;
    oldMeta: number;
    total: number;
    // New fields from 2023 data
    newPercent?: number;
    oldDirectPercent?: number;
    oldMetaPercent?: number;
    qoqGrowth?: number;
    type?: string;
    newOfDirectPercent?: number;
    newOfMetaPercent?: number;
    // Repurchase Rates
    repurchaseRateDirect?: number;
    repurchaseRateMeta?: number;
}

export interface SimulationParameters {
    newUIDsQuarterlyGrowth: number; // %
    newUIDsAvgOrders: number; // decimal
    oldDirectRepurchaseRate: number; // %
    oldDirectAvgOrders: number; // decimal
    oldMetaRepurchaseRate: number; // %
    oldMetaAvgOrders: number; // decimal
    oldDirectUserRepurchaseDirectPercent: number; // %
    oldMetaUserRepurchaseDirectPercent: number; // %
}

export interface Scenario {
    name: string;
    description: string;
    parameters: SimulationParameters;
    color: string;
    isCustom?: boolean;
}