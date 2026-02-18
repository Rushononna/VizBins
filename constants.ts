import type { QuarterlyData, SimulationParameters, Scenario } from './types';

export const ACTUAL_2023_DATA: QuarterlyData[] = [
  { 
    quarter: '2023 Q1', 
    newDirect: 20323, 
    oldDirect: 11399, 
    oldMeta: 7930, 
    total: 39652, 
    newPercent: 51.25, 
    oldDirectPercent: 28.75, 
    oldMetaPercent: 20.00, 
    qoqGrowth: 0, 
    type: 'Actual', 
    newOfDirectPercent: 64.08, 
    newOfMetaPercent: 71.93 
  },
  { 
    quarter: '2023 Q2', 
    newDirect: 39851, 
    oldDirect: 19189, 
    oldMeta: 16652, 
    total: 75692, 
    newPercent: 52.65, 
    oldDirectPercent: 25.35, 
    oldMetaPercent: 22.00, 
    qoqGrowth: 90.89, 
    type: 'Actual', 
    newOfDirectPercent: 67.50, 
    newOfMetaPercent: 70.53 
  },
  { 
    quarter: '2023 Q3', 
    newDirect: 48758, 
    oldDirect: 24796, 
    oldMeta: 24518, 
    total: 98072, 
    newPercent: 49.72, 
    oldDirectPercent: 25.28, 
    oldMetaPercent: 25.00, 
    qoqGrowth: 29.57, 
    type: 'Actual', 
    newOfDirectPercent: 66.29, 
    newOfMetaPercent: 66.54 
  },
  { 
    quarter: '2023 Q4', 
    newDirect: 69138, 
    oldDirect: 26438, 
    oldMeta: 37168, 
    total: 132744, 
    newPercent: 52.08, 
    oldDirectPercent: 19.92, 
    oldMetaPercent: 28.00, 
    qoqGrowth: 35.35, 
    type: 'Actual', 
    newOfDirectPercent: 72.33, 
    newOfMetaPercent: 65.04 
  }
];

// Base UIDs derived from 2023 Q4 and 2024 Q1 data to seed the simulation
export const SIMULATION_BASE_UIDS = {
  newUIDs_2023_Q4: 51519,
  oldDirectUIDs: 748420,
  oldMetaUIDs: 862570,
};

export const DEFAULT_PARAMETERS: SimulationParameters = {
  newUIDsQuarterlyGrowth: 15.00,
  newUIDsAvgOrders: 1.34,
  oldDirectRepurchaseRate: 15.00,
  oldDirectAvgOrders: 1.00,
  oldMetaRepurchaseRate: 10.00,
  oldMetaAvgOrders: 0.80,
  oldDirectUserRepurchaseDirectPercent: 51.00,
  oldMetaUserRepurchaseDirectPercent: 53.00,
};

export const SCENARIOS: Scenario[] = [
  {
    name: "Base Case",
    description: "Current parameters based on historic trends.",
    color: "#3b82f6",
    parameters: DEFAULT_PARAMETERS,
  },
  {
    name: "Optimistic Growth",
    description: "Assumes +10% new user acquisition and improved retention.",
    color: "#10b981",
    parameters: {
      ...DEFAULT_PARAMETERS,
      newUIDsQuarterlyGrowth: 25.00,
      newUIDsAvgOrders: 1.45,
      oldDirectUserRepurchaseDirectPercent: 55.00,
    }
  },
  {
    name: "Conservative",
    description: "Market downturn simulation (-5% growth, lower avg orders).",
    color: "#ef4444",
    parameters: {
      ...DEFAULT_PARAMETERS,
      newUIDsQuarterlyGrowth: 10.00,
      oldDirectRepurchaseRate: 12.00,
      oldDirectUserRepurchaseDirectPercent: 45.00,
    }
  }
];