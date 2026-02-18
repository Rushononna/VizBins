import { useMemo } from 'react';
import { SimulationParameters, QuarterlyData } from '../types';
import { SIMULATION_BASE_UIDS, ACTUAL_2023_DATA, DEFAULT_PARAMETERS } from '../constants';

// Calculate what the model produces by default to establish a baseline for scaling
// This represents the "expected" old volume if we used the hardcoded constants
const MODEL_DEFAULT_OLD_VOLUME = 
    (SIMULATION_BASE_UIDS.oldDirectUIDs * DEFAULT_PARAMETERS.oldDirectRepurchaseRate / 100 * DEFAULT_PARAMETERS.oldDirectAvgOrders) +
    (SIMULATION_BASE_UIDS.oldMetaUIDs * DEFAULT_PARAMETERS.oldMetaRepurchaseRate / 100 * DEFAULT_PARAMETERS.oldMetaAvgOrders);

export const useSimulation = (params: SimulationParameters, lastActualData?: QuarterlyData): QuarterlyData[] => {
    return useMemo(() => {
        const forecast: QuarterlyData[] = [];
        const quartersToForecast = 4; // 2024 Q1 to Q4

        // Initialize user pools (Defaults)
        let currentPoolOldDirect = SIMULATION_BASE_UIDS.oldDirectUIDs;
        let currentPoolOldMeta = SIMULATION_BASE_UIDS.oldMetaUIDs;
        let lastNewUIDs = SIMULATION_BASE_UIDS.newUIDs_2023_Q4;
        let lastTotal = ACTUAL_2023_DATA[ACTUAL_2023_DATA.length - 1].total;

        // If uploaded data exists, calibrate the simulation to match the provided history
        if (lastActualData) {
            lastTotal = lastActualData.total;

            // 1. Calibrate Starting New User Volume
            // If we have actual New Direct orders, derive the starting New UIDs from them
            // This ensures the "New Users" forecast line starts from the actuals provided
            if (params.newUIDsAvgOrders > 0 && lastActualData.newDirect > 0) {
                 lastNewUIDs = lastActualData.newDirect / params.newUIDsAvgOrders;
            }

            // 2. Calibrate Retention Volume (Pools)
            // If the actual Old volume differs significantly from what our default constants produce,
            // we scale the pool sizes to match the reality of the uploaded data.
            // This prevents a "jump" in the chart between Actual Q4 and Forecast Q1.
            const actualOldVolume = lastActualData.oldDirect + lastActualData.oldMeta;
            
            if (MODEL_DEFAULT_OLD_VOLUME > 0 && actualOldVolume > 0) {
                 const scaleFactor = actualOldVolume / MODEL_DEFAULT_OLD_VOLUME;
                 currentPoolOldDirect = SIMULATION_BASE_UIDS.oldDirectUIDs * scaleFactor;
                 currentPoolOldMeta = SIMULATION_BASE_UIDS.oldMetaUIDs * scaleFactor;
            }
        }

        for (let i = 1; i <= quartersToForecast; i++) {
            // 1. Calculate New Users for this quarter
            const currentNewUIDs = lastNewUIDs * (1 + params.newUIDsQuarterlyGrowth / 100);
            
            // 2. Calculate Orders from New Users (New Direct)
            const newDirectOrders = Math.round(currentNewUIDs * params.newUIDsAvgOrders);

            // 3. Calculate Orders from Old Users (Retention)
            const activeOldDirectUsers = currentPoolOldDirect * (params.oldDirectRepurchaseRate / 100);
            const activeOldMetaUsers = currentPoolOldMeta * (params.oldMetaRepurchaseRate / 100);

            const totalOrdersFromOldDirectPool = activeOldDirectUsers * params.oldDirectAvgOrders;
            const totalOrdersFromOldMetaPool = activeOldMetaUsers * params.oldMetaAvgOrders;

            // 4. Split Retention Orders into Channels
            const ordersFromOldDirectToDirect = totalOrdersFromOldDirectPool * (params.oldDirectUserRepurchaseDirectPercent / 100);
            const ordersFromOldMetaToDirect = totalOrdersFromOldMetaPool * (params.oldMetaUserRepurchaseDirectPercent / 100);
            const oldDirectOrders = Math.round(ordersFromOldDirectToDirect + ordersFromOldMetaToDirect);

            const ordersFromOldDirectToMeta = totalOrdersFromOldDirectPool * (1 - params.oldDirectUserRepurchaseDirectPercent / 100);
            const ordersFromOldMetaToMeta = totalOrdersFromOldMetaPool * (1 - params.oldMetaUserRepurchaseDirectPercent / 100);
            const oldMetaOrders = Math.round(ordersFromOldDirectToMeta + ordersFromOldMetaToMeta);

            // 5. Total
            const total = newDirectOrders + oldDirectOrders + oldMetaOrders;

            // 6. Update Pools for next quarter
            currentPoolOldDirect += currentNewUIDs;
            lastNewUIDs = currentNewUIDs;

            // Derived metrics
            const newPercent = (newDirectOrders / total) * 100;
            const oldDirectPercent = (oldDirectOrders / total) * 100;
            const oldMetaPercent = (oldMetaOrders / total) * 100;

            const qoqGrowth = lastTotal > 0 ? ((total - lastTotal) / lastTotal) * 100 : 0;
            const newOfDirectPercent = (newDirectOrders / (newDirectOrders + oldDirectOrders)) * 100;
            const newOfMetaPercent = (newDirectOrders / (newDirectOrders + oldMetaOrders)) * 100;

            lastTotal = total;

            forecast.push({
                quarter: `2024 Q${i}`,
                year: 2024,
                newDirect: newDirectOrders,
                oldDirect: oldDirectOrders,
                oldMeta: oldMetaOrders,
                total,
                newPercent,
                oldDirectPercent,
                oldMetaPercent,
                qoqGrowth,
                newOfDirectPercent,
                newOfMetaPercent,
                repurchaseRateDirect: params.oldDirectRepurchaseRate,
                repurchaseRateMeta: params.oldMetaRepurchaseRate,
                type: 'Forecast'
            });
        }

        return forecast;
    }, [params, lastActualData]);
};