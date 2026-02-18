
import React from 'react';
import { ComposedChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { QuarterlyData } from '../../types';

interface ForecastViewProps {
    data: QuarterlyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-4 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl ring-1 ring-black/5 z-50">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{label}</p>
                <div className="space-y-1">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-xs space-x-4">
                            <span className="flex items-center text-gray-600 dark:text-gray-400">
                                <span 
                                    className="w-3 h-0.5 mr-2" 
                                    style={{ backgroundColor: entry.fill || entry.stroke, height: entry.fill ? '8px' : '2px', borderRadius: entry.fill ? '2px' : '0' }}
                                ></span>
                                {entry.name}:
                            </span>
                            <span className="font-mono font-medium text-gray-900 dark:text-gray-200">
                                {typeof entry.value === 'number' ? entry.value.toLocaleString() + (entry.unit || '') : entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const ForecastView: React.FC<ForecastViewProps> = ({ data }) => {
    // Find the last actual quarter to place the separator line
    const actualData = data.filter(d => d.type === 'Actual');
    const lastActualQuarter = actualData.length > 0 ? actualData[actualData.length - 1].quarter : null;

    // Prepare YoY Data
    const yoyData = data.map((current, index) => {
        // Need at least 4 quarters prior to calculate YoY
        if (index < 4) return null;
        
        const prevYearIndex = index - 4;
        const prevYearData = data[prevYearIndex];
        
        // Ensure we aren't comparing against zero to avoid Infinity
        if (prevYearData.total === 0) return null;

        const growth = ((current.total - prevYearData.total) / prevYearData.total) * 100;
        
        return {
            quarter: current.quarter,
            growth: parseFloat(growth.toFixed(2)),
            volume: current.total,
            type: current.type
        };
    }).filter(Boolean);

    // Derived Observations
    const lastForecast = data[data.length - 1];
    const totalGrowth = lastForecast && actualData.length > 0 
        ? ((lastForecast.total - actualData[actualData.length - 1].total) / actualData[actualData.length - 1].total) * 100 
        : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Volume Forecast</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Projected trends based on current parameters</p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></span>
                        <span>Actual</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-2"></div>
                    <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/50 border border-indigo-500 mr-1.5"></span>
                        <span>Forecast</span>
                    </div>
                </div>
            </div>

            {/* Main Forecast Chart */}
            <div className="h-[450px] w-full bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-700/50" />
                        
                        {lastActualQuarter && (
                            <ReferenceLine 
                                x={lastActualQuarter} 
                                stroke="#94a3b8" 
                                strokeDasharray="3 3" 
                                label={{ 
                                    value: 'Forecast Start', 
                                    position: 'insideTopLeft', 
                                    fill: '#94a3b8', 
                                    fontSize: 10,
                                    offset: 10
                                }} 
                            />
                        )}

                        <XAxis 
                            dataKey="quarter" 
                            stroke="#94a3b8" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={10}
                            angle={-30}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis 
                            stroke="#94a3b8" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                            dx={-10}
                            domain={[0, (dataMax: number) => Math.ceil(dataMax / 50000) * 50000]}
                            tickCount={6}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="plainline" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                        
                        <Line type="monotone" dataKey="newDirect" name="New Direct" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="oldDirect" name="Old Direct" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="oldMeta" name="Old Meta" stroke="#ec4899" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        
                        <Line type="monotone" dataKey="total" name="Total Orders" stroke="#1e293b" strokeWidth={3} dot={{ r: 3, fill: "#1e293b", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} className="dark:stroke-white dark:fill-white" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Analysis Section (Moved from Analysis Tab) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* YoY Growth Chart */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="w-1 h-4 bg-emerald-500 rounded-full mr-2"></span>
                        Year-Over-Year Growth Trends
                    </h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={yoyData!}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
                                <XAxis dataKey="quarter" fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} dy={5} />
                                <YAxis fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} unit="%" />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const val = payload[0].value as number;
                                            return (
                                                <div className="bg-white dark:bg-slate-800 p-2 border border-gray-100 dark:border-slate-700 rounded shadow-lg text-xs">
                                                    <span className="font-bold">{label}</span>: <span className={val > 0 ? 'text-emerald-600' : 'text-rose-600'}>{val.toFixed(2)}%</span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="growth" fill="#10b981" radius={[4, 4, 0, 0]} name="YoY Growth %">
                                    {yoyData!.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.growth > 0 ? '#10b981' : '#f43f5e'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Key Observations */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="w-1 h-4 bg-indigo-500 rounded-full mr-2"></span>
                        Forecast Observations
                    </h3>
                    <div className="space-y-4 flex-grow">
                        <div className="flex gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/30">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase mb-1">Growth Trajectory</h4>
                                <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                                    Forecasted volume {totalGrowth >= 0 ? 'increases' : 'decreases'} by <span className="font-bold">{Math.abs(totalGrowth).toFixed(1)}%</span> over the next 4 quarters relative to current levels. 
                                    The trend suggests {Math.abs(totalGrowth) > 5 ? 'significant movement' : 'stability'} in the medium term.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800/30">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase mb-1">Seasonality & Retention</h4>
                                <p className="text-sm text-purple-800 dark:text-purple-400 leading-relaxed">
                                    Historical seasonal patterns are projected to repeat. 
                                    The divergence between YoY growth and absolute volume indicates how heavily retention parameters (Direct vs Meta) are weighing on the final outcome.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForecastView;
