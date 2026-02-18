import React from 'react';
import { QuarterlyData } from '../../types';

interface DataTableViewProps {
    data: QuarterlyData[];
}

const DataTableView: React.FC<DataTableViewProps> = ({ data }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
                    <tr>
                        <th className="px-4 py-3 sticky left-0 bg-gray-50 dark:bg-slate-700 z-10 shadow-sm border-b border-gray-200 dark:border-slate-600">Quarter</th>
                        <th className="px-4 py-3 text-right text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-slate-600">New Direct</th>
                        <th className="px-4 py-3 text-right text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-slate-600">Old Direct</th>
                        <th className="px-4 py-3 text-right text-pink-600 dark:text-pink-400 border-b border-gray-200 dark:border-slate-600">Old Meta</th>
                        <th className="px-4 py-3 text-right font-bold bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-600">Total</th>
                        <th className="px-4 py-3 text-right text-xs text-gray-500 font-semibold border-l border-b border-gray-200 dark:border-slate-600">QoQ %</th>
                        <th className="px-4 py-3 text-right text-xs text-gray-500 border-b border-gray-200 dark:border-slate-600">New %</th>
                        <th className="px-4 py-3 text-right text-xs text-gray-500 border-b border-gray-200 dark:border-slate-600">Old Dir %</th>
                        <th className="px-4 py-3 text-right text-xs text-gray-500 border-b border-gray-200 dark:border-slate-600">Old Meta %</th>
                        <th className="px-4 py-3 text-right text-xs text-blue-600/70 dark:text-blue-400/70 bg-blue-50/50 dark:bg-blue-900/10 border-l border-b border-gray-200 dark:border-slate-600">New / Direct %</th>
                        <th className="px-4 py-3 text-right text-xs text-pink-600/70 dark:text-pink-400/70 bg-pink-50/50 dark:bg-pink-900/10 border-b border-gray-200 dark:border-slate-600">New / Meta %</th>
                        <th className="px-4 py-3 text-right text-xs text-purple-700/70 dark:text-purple-400/70 bg-purple-50/50 dark:bg-purple-900/10 border-l border-b border-gray-200 dark:border-slate-600 whitespace-nowrap">Repur. Dir %</th>
                        <th className="px-4 py-3 text-right text-xs text-pink-700/70 dark:text-pink-400/70 bg-pink-50/50 dark:bg-pink-900/10 border-b border-gray-200 dark:border-slate-600 whitespace-nowrap">Repur. Meta %</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {data.map((row, index) => {
                        const isForecast = row.type === 'Forecast';
                        
                        // Fallback calculations if not present in data (e.g. for Actuals if missing)
                        const newOfDirect = row.newOfDirectPercent ?? (row.newDirect / (row.newDirect + row.oldDirect) * 100);
                        const newOfMeta = row.newOfMetaPercent ?? (row.newDirect / (row.newDirect + row.oldMeta) * 100);
                        
                        // Dynamic QoQ if missing
                        const prevRow = data[index - 1];
                        const calculatedQoQ = prevRow && prevRow.total > 0 
                            ? ((row.total - prevRow.total) / prevRow.total * 100) 
                            : 0;
                        const displayQoQ = row.qoqGrowth !== undefined ? row.qoqGrowth : (index === 0 ? 0 : calculatedQoQ);
                        
                        const growthColor = displayQoQ > 0 ? 'text-emerald-600 dark:text-emerald-400' : displayQoQ < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500';

                        return (
                            <tr 
                                key={row.quarter} 
                                className={`bg-white dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${isForecast ? 'italic' : ''}`}
                            >
                                <td className="px-4 py-3 font-medium flex items-center whitespace-nowrap sticky left-0 bg-inherit z-10 border-r border-transparent text-gray-900 dark:text-gray-100">
                                    {row.quarter}
                                    {isForecast && <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-indigo-100 text-indigo-800 rounded dark:bg-indigo-900 dark:text-indigo-200 font-normal not-italic">FCST</span>}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-gray-100">{row.newDirect.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-gray-100">{row.oldDirect.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-gray-100">{row.oldMeta.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right font-bold font-mono bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-white">{row.total.toLocaleString()}</td>
                                
                                <td className={`px-4 py-3 text-right text-xs font-semibold border-l border-gray-100 dark:border-slate-700 ${growthColor}`}>
                                    {displayQoQ !== undefined ? `${displayQoQ > 0 ? '+' : ''}${displayQoQ.toFixed(2)}%` : '-'}
                                </td>
                                
                                <td className="px-4 py-3 text-right text-xs text-gray-500 dark:text-gray-400">{row.newPercent?.toFixed(1)}%</td>
                                <td className="px-4 py-3 text-right text-xs text-gray-500 dark:text-gray-400">{row.oldDirectPercent?.toFixed(1)}%</td>
                                <td className="px-4 py-3 text-right text-xs text-gray-500 dark:text-gray-400">{row.oldMetaPercent?.toFixed(1)}%</td>
                                
                                <td className="px-4 py-3 text-right text-xs font-mono text-gray-600 dark:text-gray-400 bg-blue-50/50 dark:bg-blue-900/10 border-l border-gray-100 dark:border-slate-700">
                                    {!isNaN(newOfDirect) ? `${newOfDirect.toFixed(2)}%` : '-'}
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-mono text-gray-600 dark:text-gray-400 bg-pink-50/50 dark:bg-pink-900/10">
                                    {!isNaN(newOfMeta) ? `${newOfMeta.toFixed(2)}%` : '-'}
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-mono text-purple-700 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/10 border-l border-gray-100 dark:border-slate-700">
                                    {row.repurchaseRateDirect ? `${row.repurchaseRateDirect.toFixed(2)}%` : '-'}
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-mono text-pink-700 dark:text-pink-400 bg-pink-50/50 dark:bg-pink-900/10">
                                    {row.repurchaseRateMeta ? `${row.repurchaseRateMeta.toFixed(2)}%` : '-'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DataTableView;