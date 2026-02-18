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
        const quartersToForecast = 4;

        // Initialize user pools (Defaults)
        let currentPoolOldDirect = SIMULATION_BASE_UIDS.oldDirectUIDs;
        let currentPoolOldMeta = SIMULATION_BASE_UIDS.oldMetaUIDs;
        let lastNewUIDs = SIMULATION_BASE_UIDS.newUIDs_2023_Q4;
        
        // Determine starting point from default constants or provided lastActualData
        let lastTotal = ACTUAL_2023_DATA[ACTUAL_2023_DATA.length - 1].total;
        let lastQuarterStr = ACTUAL_2023_DATA[ACTUAL_2023_DATA.length - 1].quarter;

        // If uploaded data exists (or just passed from App state), calibrate the simulation
        if (lastActualData) {
            lastTotal = lastActualData.total;
            lastQuarterStr = lastActualData.quarter; 

            // 1. Calibrate Starting New User Volume
            // Use DEFAULT_PARAMETERS to anchor the population estimation. 
            // This ensures that changing the simulation parameter (params.newUIDsAvgOrders) 
            // reflects a change in behavior (more orders per user) rather than a change in history (fewer users).
            if (DEFAULT_PARAMETERS.newUIDsAvgOrders > 0 && lastActualData.newDirect > 0) {
                 lastNewUIDs = lastActualData.newDirect / DEFAULT_PARAMETERS.newUIDsAvgOrders;
            }

            // 2. Calibrate Retention Volume (Pools)
            const actualOldVolume = lastActualData.oldDirect + lastActualData.oldMeta;
            
            if (MODEL_DEFAULT_OLD_VOLUME > 0 && actualOldVolume > 0) {
                 const scaleFactor = actualOldVolume / MODEL_DEFAULT_OLD_VOLUME;
                 currentPoolOldDirect = SIMULATION_BASE_UIDS.oldDirectUIDs * scaleFactor;
                 currentPoolOldMeta = SIMULATION_BASE_UIDS.oldMetaUIDs * scaleFactor;
            }
        }

        // Parse last quarter string to determine start year/quarter for forecast
        // Supports format "YYYY QX"
        let currentYear = 2023;
        let currentQuarter = 4;
        
        const quarterMatch = lastQuarterStr.match(/(\d{4})\s*Q(\d)/);
        if (quarterMatch) {
            currentYear = parseInt(quarterMatch[1]);
            currentQuarter = parseInt(quarterMatch[2]);
        }

        for (let i = 1; i <= quartersToForecast; i++) {
            // Increment quarter logic
            currentQuarter++;
            if (currentQuarter > 4) {
                currentQuarter = 1;
                currentYear++;
            }
            const forecastQuarterStr = `${currentYear} Q${currentQuarter}`;

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
                quarter: forecastQuarterStr,
                year: currentYear,
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