import React from 'react';
import { SimulationParameters } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSimulation } from '../../hooks/useSimulation';
import { ACTUAL_2023_DATA } from '../../constants';

interface AnalysisViewProps {
    baseParameters: SimulationParameters;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ baseParameters }) => {
    // We generate forecast
    const forecast = useSimulation(baseParameters);
    const fullData = [...ACTUAL_2023_DATA, ...forecast];

    // Prepare Year-over-Year Data
    // We match forecast quarters to previous year quarters
    const yoyData = fullData.map((current, index) => {
        if (index < 4) return null; // Skip first year (2023) as we don't have 2022
        const prevYearIndex = index - 4;
        const prevYearData = fullData[prevYearIndex];
        
        const growth = ((current.total - prevYearData.total) / prevYearData.total) * 100;
        
        return {
            quarter: current.quarter,
            growth: parseFloat(growth.toFixed(2)),
            volume: current.total
        };
    }).filter(Boolean);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Year-Over-Year Growth %</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={yoyData!}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                <XAxis dataKey="quarter" fontSize={12} stroke="#64748b" tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} stroke="#64748b" tickLine={false} axisLine={false} unit="%" />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--tw-colors-card-light)', 
                                        borderColor: 'var(--tw-colors-border-light)', 
                                        borderRadius: '0.5rem',
                                        color: '#1e293b'
                                    }}
                                />
                                <Bar dataKey="growth" fill="#10b981" radius={[4, 4, 0, 0]} name="YoY Growth %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Key Observations</h3>
                    <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-start">
                            <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                            <span>
                                <strong>Growth trajectory:</strong> Based on current parameters ({baseParameters.newUIDsQuarterlyGrowth}% new user growth), the year-over-year expansion is stabilizing.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-purple-500 mt-2 mr-2"></span>
                            <span>
                                <strong>Seasonality Impact:</strong> Q2 and Q3 continue to drive the majority of volume due to retention patterns and acquisition growth, assuming historical seasonality is reflected in the baselines.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-pink-500 mt-2 mr-2"></span>
                            <span>
                                <strong>Long-term forecast:</strong> By end of 2025, total quarterly volume is expected to reach approx. {forecast[forecast.length-1]?.total.toLocaleString()} orders.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnalysisView;