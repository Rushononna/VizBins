import React from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { QuarterlyData } from '../../types';

interface ForecastViewProps {
    data: QuarterlyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-4 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl ring-1 ring-black/5">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{label}</p>
                <div className="space-y-1">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-xs space-x-4">
                            <span className="flex items-center text-gray-600 dark:text-gray-400">
                                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                                {entry.name}:
                            </span>
                            <span className="font-mono font-medium text-gray-900 dark:text-gray-200">
                                {entry.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-700 flex justify-between text-xs font-bold">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-indigo-600 dark:text-indigo-400">
                            {payload[0].payload.total.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const ForecastView: React.FC<ForecastViewProps> = ({ data }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Volume Forecast</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Projected trends based on current parameters</p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></span>
                        <span>Actual (2023)</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-2"></div>
                    <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/50 border border-indigo-500 mr-1.5"></span>
                        <span>Forecast (2024+)</span>
                    </div>
                </div>
            </div>

            <div className="h-[450px] w-full bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOld" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-700/50" />
                        <XAxis 
                            dataKey="quarter" 
                            stroke="#94a3b8" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={10}
                        />
                        <YAxis 
                            stroke="#94a3b8" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                        
                        <Area type="monotone" dataKey="newDirect" name="New Direct" stackId="1" fill="url(#colorNew)" stroke="#3b82f6" strokeWidth={2} />
                        <Area type="monotone" dataKey="oldDirect" name="Old Direct" stackId="1" fill="url(#colorOld)" stroke="#8b5cf6" strokeWidth={2} />
                        <Area type="monotone" dataKey="oldMeta" name="Old Meta" stackId="1" fill="url(#colorMeta)" stroke="#ec4899" strokeWidth={2} />
                        
                        <Line type="monotone" dataKey="total" name="Total Orders" stroke="#1e293b" strokeWidth={3} dot={{ r: 3, fill: "#1e293b", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} className="dark:stroke-white dark:fill-white" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">Trend Insight</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                        Growth is stable. Based on current parameters, Q2/Q3 seasonal peaks are the primary volume drivers for the upcoming year.
                    </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30">
                    <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300 mb-1">Segment Mix</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-400 leading-relaxed">
                        Old Direct volume remains the foundation of total orders, highlighting the importance of your {data.length > 0 ? 'retention' : ''} strategy.
                    </p>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-800/30">
                    <h4 className="text-sm font-bold text-pink-900 dark:text-pink-300 mb-1">Meta Performance</h4>
                    <p className="text-xs text-pink-700 dark:text-pink-400 leading-relaxed">
                        Meta channels show lower elasticity to growth drivers compared to direct channels, suggesting a more fixed audience.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForecastView;