import React, { useState } from 'react';
import { SimulationParameters } from '../../types';
import { Save, RotateCcw } from 'lucide-react';

interface ParametersViewProps {
    parameters: SimulationParameters;
    onParameterChange: (key: keyof SimulationParameters, value: number) => void;
    onReset: () => void;
    onSaveScenario: (name: string, description: string) => void;
}

const SliderControl: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    suffix?: string;
    onChange: (val: number) => void;
}> = ({ label, value, min, max, step, suffix = '', onChange }) => (
    <div className="group space-y-3">
        <div className="flex justify-between text-sm items-center">
            <label className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors w-2/3">{label}</label>
            <span className="font-mono text-xs font-semibold bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-gray-900 dark:text-white min-w-[3.5rem] text-center">
                {value.toFixed(2)}{suffix}
            </span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
    </div>
);

const ParametersView: React.FC<ParametersViewProps> = ({ parameters, onParameterChange, onReset, onSaveScenario }) => {
    const [scenarioName, setScenarioName] = useState('');
    const [scenarioDesc, setScenarioDesc] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        if (!scenarioName) return;
        onSaveScenario(scenarioName, scenarioDesc);
        setIsSaving(false);
        setScenarioName('');
        setScenarioDesc('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Acquisition */}
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-4 mb-6 flex items-center">
                        <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>
                        New User Acquisition
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <SliderControl
                            label="Quarterly UID Growth"
                            value={parameters.newUIDsQuarterlyGrowth}
                            min={-20}
                            max={50}
                            step={0.5}
                            suffix="%"
                            onChange={(v) => onParameterChange('newUIDsQuarterlyGrowth', v)}
                        />
                        <SliderControl
                            label="Avg Orders per New User"
                            value={parameters.newUIDsAvgOrders}
                            min={1.0}
                            max={3.0}
                            step={0.01}
                            onChange={(v) => onParameterChange('newUIDsAvgOrders', v)}
                        />
                    </div>
                </div>

                {/* Old Direct Users */}
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-4 mb-6 flex items-center">
                        <span className="w-1.5 h-4 bg-purple-500 rounded-full mr-2"></span>
                        Old Direct User Retention
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <SliderControl
                            label="Repurchase Rate"
                            value={parameters.oldDirectRepurchaseRate}
                            min={0}
                            max={50}
                            step={0.5}
                            suffix="%"
                            onChange={(v) => onParameterChange('oldDirectRepurchaseRate', v)}
                        />
                        <SliderControl
                            label="Avg Orders (if active)"
                            value={parameters.oldDirectAvgOrders}
                            min={0.5}
                            max={2.0}
                            step={0.05}
                            onChange={(v) => onParameterChange('oldDirectAvgOrders', v)}
                        />
                        <SliderControl
                            label="Channel Share: Direct"
                            value={parameters.oldDirectUserRepurchaseDirectPercent}
                            min={0}
                            max={100}
                            step={1}
                            suffix="%"
                            onChange={(v) => onParameterChange('oldDirectUserRepurchaseDirectPercent', v)}
                        />
                    </div>
                </div>

                {/* Old Meta Users */}
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-4 mb-6 flex items-center">
                        <span className="w-1.5 h-4 bg-pink-500 rounded-full mr-2"></span>
                        Old Meta User Retention
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <SliderControl
                            label="Repurchase Rate"
                            value={parameters.oldMetaRepurchaseRate}
                            min={0}
                            max={50}
                            step={0.5}
                            suffix="%"
                            onChange={(v) => onParameterChange('oldMetaRepurchaseRate', v)}
                        />
                        <SliderControl
                            label="Avg Orders (if active)"
                            value={parameters.oldMetaAvgOrders}
                            min={0.5}
                            max={2.0}
                            step={0.05}
                            onChange={(v) => onParameterChange('oldMetaAvgOrders', v)}
                        />
                         <SliderControl
                            label="Channel Share: Direct"
                            value={parameters.oldMetaUserRepurchaseDirectPercent}
                            min={0}
                            max={100}
                            step={1}
                            suffix="%"
                            onChange={(v) => onParameterChange('oldMetaUserRepurchaseDirectPercent', v)}
                        />
                    </div>
                </div>
            </div>

            {/* Actions Panel */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg sticky top-6">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">Simulation Actions</h3>
                    
                    {!isSaving ? (
                        <div className="space-y-3">
                             <button 
                                onClick={() => setIsSaving(true)}
                                className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-blue-500/20 shadow-lg"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Current Scenario
                            </button>
                            <button 
                                onClick={onReset}
                                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:text-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600 rounded-xl transition-colors"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset to Defaults
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Scenario Name</label>
                                <input 
                                    type="text" 
                                    autoFocus
                                    placeholder="e.g. Post-COVID Recovery"
                                    value={scenarioName}
                                    onChange={(e) => setScenarioName(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                                <textarea 
                                    placeholder="What assumptions did you make?"
                                    value={scenarioDesc}
                                    onChange={(e) => setScenarioDesc(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    rows={3}
                                />
                            </div>
                            <div className="flex space-x-2 pt-2">
                                <button 
                                    onClick={handleSave}
                                    disabled={!scenarioName}
                                    className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    Save
                                </button>
                                <button 
                                    onClick={() => setIsSaving(false)}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 dark:text-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                            Parameters automatically update the <span className="font-semibold text-blue-600">Forecast</span> tab. Save scenarios to quickly compare different outcomes later.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParametersView;