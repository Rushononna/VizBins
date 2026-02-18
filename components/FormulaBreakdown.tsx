import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, Info } from 'lucide-react';

const FormulaBreakdown: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden transition-all duration-300">
            <div 
                className="bg-indigo-50 dark:bg-slate-800/80 p-4 flex items-center justify-between cursor-pointer border-b border-indigo-100 dark:border-slate-700 hover:bg-indigo-100 dark:hover:bg-slate-700/80 transition-colors" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
                    <Calculator className="w-4 h-4 mr-2" />
                    Forecast Logic & Definitions
                </div>
                <div className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>

            {/* Always visible Equation */}
            <div className="p-4 md:px-6 md:pt-4 md:pb-4 bg-white dark:bg-slate-800">
                <div className="flex flex-col space-y-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider min-h-[1rem]"> </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-gray-800 dark:text-white leading-relaxed">
                        <span>Total Orders</span>
                        <span className="text-gray-400">=</span>
                        <span className="text-blue-600 dark:text-blue-400 whitespace-nowrap">New User Orders</span>
                        <span className="text-gray-400">+</span>
                        <span className="text-purple-600 dark:text-purple-400 whitespace-nowrap">Old Direct User Orders</span>
                        <span className="text-gray-400">+</span>
                        <span className="text-pink-600 dark:text-pink-400 whitespace-nowrap">Old Meta User Orders</span>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 md:px-6 md:pb-6 text-sm text-gray-600 dark:text-gray-300 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                        {/* A. New Users */}
                        <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg border border-gray-100 dark:border-slate-700">
                            <div className="font-bold text-blue-700 dark:text-blue-300 text-[10px] uppercase tracking-wide border-b border-blue-100 dark:border-blue-800 pb-2 mb-3">
                                A. Orders From New Users
                            </div>
                            <div className="font-mono text-[11px] text-gray-700 dark:text-gray-300 space-y-1.5 flex-grow">
                                <div className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                    <span>New UIDs × (1 + Growth %)</span>
                                </div>
                            </div>
                        </div>

                        {/* B. Old Direct */}
                        <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg border border-gray-100 dark:border-slate-700">
                            <div className="font-bold text-purple-700 dark:text-purple-300 text-[10px] uppercase tracking-wide border-b border-purple-100 dark:border-purple-800 pb-2 mb-3">
                                B. Old Users (Direct Channel)
                            </div>
                            <div className="font-mono text-[11px] text-gray-700 dark:text-gray-300 space-y-1.5 flex-grow">
                                <div className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                    <span>Old Direct UIDs</span>
                                </div>
                                <div className="pl-3.5 text-gray-500 flex items-center">
                                    <span>× Repurchase Rate %</span>
                                </div>
                                <div className="pl-3.5 text-gray-500 flex items-center">
                                    <span>× Avg Orders</span>
                                </div>
                            </div>
                        </div>

                        {/* C. Old Meta */}
                        <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg border border-gray-100 dark:border-slate-700">
                            <div className="font-bold text-pink-700 dark:text-pink-300 text-[10px] uppercase tracking-wide border-b border-pink-100 dark:border-pink-800 pb-2 mb-3">
                                C. Old Users (Meta Channel)
                            </div>
                            <div className="font-mono text-[11px] text-gray-700 dark:text-gray-300 space-y-1.5 flex-grow">
                                <div className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                    <span>Old Meta UIDs</span>
                                </div>
                                <div className="pl-3.5 text-gray-500 flex items-center">
                                    <span>× Repurchase Rate %</span>
                                </div>
                                <div className="pl-3.5 text-gray-500 flex items-center">
                                    <span>× Avg Orders</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="flex items-start p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
                        <Info className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="space-y-1">
                            <h5 className="text-[10px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wide">Model Notes</h5>
                            <ol className="list-decimal list-inside text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                                <li><strong>Direct Channel</strong>: All sources excluding Meta (1 - Meta).</li>
                                <li><strong>Data Filters</strong>: <code>Orderstatus &lt;&gt; 'C'</code> (Canceled orders excluded).</li>
                                <li><strong>Order Count</strong>: Distinct count of <code>primaryorderid</code>.</li>
                                <li><strong>Reliability</strong>: The first predicted quarter holds the highest confidence level.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormulaBreakdown;