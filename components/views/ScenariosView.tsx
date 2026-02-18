import React from 'react';
import { Scenario } from '../../types';
import { Trash2, CheckCircle, Play } from 'lucide-react';

interface ScenariosViewProps {
    scenarios: Scenario[];
    onDeleteScenario: (name: string) => void;
    onApplyScenario: (scenario: Scenario) => void;
}

const ScenariosView: React.FC<ScenariosViewProps> = ({ scenarios, onDeleteScenario, onApplyScenario }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
                <div 
                    key={scenario.name}
                    className="relative group bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col"
                >
                    <div 
                        className="absolute top-0 left-0 w-full h-1.5 rounded-t-xl"
                        style={{ backgroundColor: scenario.color }}
                    />
                    
                    <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {scenario.name}
                            </h3>
                            {scenario.isCustom ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteScenario(scenario.name); }}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                    title="Delete Scenario"
                                    aria-label="Delete Scenario"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            ) : (
                                <div title="Default Scenario">
                                    <CheckCircle className="w-5 h-5 text-blue-500/50" />
                                </div>
                            )}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 min-h-[2.5rem]">
                            {scenario.description}
                        </p>

                        <div className="space-y-3">
                            <div className="flex justify-between text-xs items-center">
                                <span className="text-gray-500 dark:text-gray-500">Acq. Growth</span>
                                <span className="font-mono font-medium text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                    {scenario.parameters.newUIDsQuarterlyGrowth > 0 ? '+' : ''}{scenario.parameters.newUIDsQuarterlyGrowth}%
                                </span>
                            </div>
                            <div className="flex justify-between text-xs items-center">
                                <span className="text-gray-500 dark:text-gray-500">New User Orders</span>
                                <span className="font-mono font-medium text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                    {scenario.parameters.newUIDsAvgOrders}x
                                </span>
                            </div>
                            <div className="flex justify-between text-xs items-center">
                                <span className="text-gray-500 dark:text-gray-500">Direct Retention</span>
                                <span className="font-mono font-medium text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                    {scenario.parameters.oldDirectRepurchaseRate}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700 rounded-b-xl">
                        <button 
                            onClick={() => onApplyScenario(scenario)}
                            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-500 rounded-lg transition-colors shadow-sm group-hover:translate-y-[-2px]"
                        >
                            <Play className="w-4 h-4 mr-2 fill-current" />
                            Run Simulation
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ScenariosView;