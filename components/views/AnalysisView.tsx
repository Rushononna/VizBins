import React, { useState, useMemo } from 'react';
import { SimulationParameters, QuarterlyData } from '../../types';
import { DEFAULT_PARAMETERS } from '../../constants';
import { useSimulation } from '../../hooks/useSimulation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Settings, RefreshCw } from 'lucide-react';

interface AnalysisViewProps {
    baseParameters: SimulationParameters; // Not strictly used for the baseline if we strictly compare to DEFAULT, but good for context
    lastActualData?: QuarterlyData;
}

const PARAM_CONFIG: Record<string, { label: string; min: number; max: number; step: number; suffix: string }> = {
    newUIDsQuarterlyGrowth: { label: 'New User Quarterly Growth', min: -20, max: 50, step: 1, suffix: '%' },
    newUIDsAvgOrders: { label: 'Avg Orders (New Users)', min: 1.0, max: 2.5, step: 0.05, suffix: '' },
    oldDirectRepurchaseRate: { label: 'Old Direct Repurchase Rate', min: 5, max: 50, step: 1, suffix: '%' },
    oldMetaRepurchaseRate: { label: 'Old Meta Repurchase Rate', min: 5, max: 50, step: 1, suffix: '%' },
    oldDirectAvgOrders: { label: 'Avg Orders (Old Direct)', min: 0.5, max: 2.0, step: 0.05, suffix: '' },
    oldMetaAvgOrders: { label: 'Avg Orders (Old Meta)', min: 0.5, max: 2.0, step: 0.05, suffix: '' },
};

const AnalysisView: React.FC<AnalysisViewProps> = ({ lastActualData }) => {
    const [selectedParam, setSelectedParam] = useState<keyof SimulationParameters>('newUIDsQuarterlyGrowth');
    const [paramValue, setParamValue] = useState<number>(DEFAULT_PARAMETERS['newUIDsQuarterlyGrowth']);

    // 1. Generate Baseline Forecast (Default Parameters)
    const baselineForecast = useSimulation(DEFAULT_PARAMETERS, lastActualData);

    // 2. Generate Impact Forecast (Default + Modified Parameter)
    const modifiedParameters = useMemo(() => ({
        ...DEFAULT_PARAMETERS,
        [selectedParam]: paramValue
    }), [selectedParam, paramValue]);

    const impactForecast = useSimulation(modifiedParameters, lastActualData);

    // 3. Calculate Delta (Impact Forecast - Baseline Forecast)
    const deltaData = useMemo(() => {
        return impactForecast.map((row, index) => {
            const baselineRow = baselineForecast[index];
            const delta = row.total - baselineRow.total;
            return {
                quarter: row.quarter,
                delta: Math.round(delta),
                total: row.total,
                baseline: baselineRow.total
            };
        });
    }, [impactForecast, baselineForecast]);

    const totalImpact = deltaData.reduce((acc, curr) => acc + curr.delta, 0);

    const handleParamChange = (newParam: keyof SimulationParameters) => {
        setSelectedParam(newParam);
        setParamValue(DEFAULT_PARAMETERS[newParam]);
    };

    const currentConfig = PARAM_CONFIG[selectedParam] || { label: selectedParam, min: 0, max: 100, step: 1, suffix: '' };
    const isDefault = paramValue === DEFAULT_PARAMETERS[selectedParam];

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Parameter Impact Analysis</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Isolate variables to see their specific impact on order volume compared to the Default Scenario.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls Column */}
                <div className="space-y-6">
                    {/* Parameter Selector */}
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 font-semibold text-xs text-gray-500 uppercase tracking-wide">
                            Select Variable
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-slate-700">
                            {Object.entries(PARAM_CONFIG).map(([key, config]) => (
                                <button
                                    key={key}
                                    onClick={() => handleParamChange(key as keyof SimulationParameters)}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between
                                        ${selectedParam === key 
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-medium' 
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <span>{config.label}</span>
                                    {selectedParam === key && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Adjustment Slider */}
                    <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-blue-200 dark:border-blue-900 shadow-md ring-1 ring-blue-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Settings className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        </div>
                        
                        <div className="relative z-10">
                            <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2 block">
                                Adjust {currentConfig.label}
                            </label>
                            
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs text-gray-500 font-mono">{currentConfig.min}{currentConfig.suffix}</span>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                                    {paramValue.toFixed(currentConfig.step < 1 ? 2 : 0)}{currentConfig.suffix}
                                </div>
                                <span className="text-xs text-gray-500 font-mono">{currentConfig.max}{currentConfig.suffix}</span>
                            </div>

                            <input
                                type="range"
                                min={currentConfig.min}
                                max={currentConfig.max}
                                step={currentConfig.step}
                                value={paramValue}
                                onChange={(e) => setParamValue(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />

                            <div className="mt-4 flex justify-between items-center text-xs">
                                <div className="text-gray-500">
                                    Default: <span className="font-mono">{DEFAULT_PARAMETERS[selectedParam]}{currentConfig.suffix}</span>
                                </div>
                                {!isDefault && (
                                    <button 
                                        onClick={() => setParamValue(DEFAULT_PARAMETERS[selectedParam])}
                                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        <RefreshCw className="w-3 h-3 mr-1" /> Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Impact Summary */}
                    <div className={`p-4 rounded-xl border ${totalImpact >= 0 ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800' : 'bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-800'}`}>
                        <div className="text-xs font-bold uppercase tracking-wide mb-1 opacity-70">
                            {totalImpact >= 0 ? 'Net Volume Gain' : 'Net Volume Loss'} (4 Qtrs)
                        </div>
                        <div className={`text-2xl font-bold ${totalImpact >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                            {totalImpact > 0 ? '+' : ''}{totalImpact.toLocaleString()}
                        </div>
                        <div className="text-xs mt-1 opacity-70">
                            orders vs. Default Scenario
                        </div>
                    </div>
                </div>

                {/* Chart Column */}
                <div className="lg:col-span-2 bg-white dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                             Actual Order Change (Delta)
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Difference in total orders between Adjusted Scenario and Default Scenario per quarter.
                        </p>
                    </div>

                    <div className="flex-grow min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deltaData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-700/50" />
                                <ReferenceLine y={0} stroke="#94a3b8" />
                                <XAxis dataKey="quarter" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} />
                                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white dark:bg-slate-800 p-3 border border-gray-100 dark:border-slate-700 rounded-lg shadow-lg text-xs">
                                                    <div className="font-bold text-gray-900 dark:text-white mb-2">{label}</div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-gray-500">Change:</span>
                                                            <span className={`font-mono font-bold ${data.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                {data.delta > 0 ? '+' : ''}{data.delta.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="border-t border-gray-100 dark:border-slate-700 my-1"></div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-gray-500">Adjusted Total:</span>
                                                            <span className="font-mono text-gray-700 dark:text-gray-300">{data.total.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-gray-500">Default Total:</span>
                                                            <span className="font-mono text-gray-700 dark:text-gray-300">{data.baseline.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="delta" name="Order Change" maxBarSize={60}>
                                    {deltaData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.delta >= 0 ? '#10b981' : '#f43f5e'} 
                                            radius={entry.delta >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisView;