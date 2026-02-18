
import React from 'react';
import { X, Target, TrendingUp, Users, AlertTriangle, Briefcase } from 'lucide-react';

interface SimulationFAQProps {
    isOpen: boolean;
    onClose: () => void;
}

const SimulationFAQ: React.FC<SimulationFAQProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const sections = [
        {
            title: "Strategic & High-Level Forecasting",
            icon: Target,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            questions: [
                { q: "What is the most likely volume?", a: "Check the 'Base Case' scenario in the Forecast view." },
                { q: "What is the range of outcomes?", a: "Compare 'Optimistic' vs 'Conservative' scenarios to see the spread." },
                { q: "What growth rate can we expect?", a: "Review the QoQ% metrics and YoY trends in the Analysis tab." }
            ]
        },
        {
            title: "Growth & Acquisition",
            icon: TrendingUp,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            questions: [
                { q: "How sensitive is volume to acquisition?", a: "Adjust 'New UIDs Growth' in Parameters to see real-time impact." },
                { q: "Volume vs Efficiency?", a: "Use Sensitivity Analysis to compare impact of 'UID Count' vs 'Avg Orders'." }
            ]
        },
        {
            title: "Retention & Engagement",
            icon: Users,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20",
            questions: [
                { q: "Impact of better retention?", a: "Adjust 'Repurchase Rate' sliders for Direct/Meta channels." },
                { q: "Which channel matters more?", a: "Compare volume shifts when tweaking Old Direct vs Old Meta parameters." }
            ]
        },
        {
            title: "Risk & Sensitivity",
            icon: AlertTriangle,
            color: "text-rose-600 dark:text-rose-400",
            bg: "bg-rose-50 dark:bg-rose-900/20",
            questions: [
                { q: "What if the market downturns?", a: "Run the 'Conservative' scenario or lower growth to negative values." },
                { q: "Where are we most vulnerable?", a: "Identify parameters with the steepest slopes in the Analysis view." }
            ]
        },
        {
            title: "Tactical Planning",
            icon: Briefcase,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            questions: [
                { q: "ROI of new features?", a: "Model the expected lift in Avg Orders or Retention to quantify order volume gain." },
                { q: "Acquisition vs Retention budget?", a: "Create competing scenarios to see which lever yields more total orders." }
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-slate-700">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Simulation Guide</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Key questions this dashboard answers</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sections.map((section, idx) => {
                            const Icon = section.icon;
                            return (
                                <div key={idx} className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-5 border border-gray-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-slate-600 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-2.5 rounded-lg ${section.bg}`}>
                                            <Icon className={`w-5 h-5 ${section.color}`} />
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{section.title}</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {section.questions.map((item, qIdx) => (
                                            <div key={qIdx} className="text-sm">
                                                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">"{item.q}"</p>
                                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed pl-3 border-l-2 border-gray-200 dark:border-slate-700">{item.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30 text-center">
                        <p className="text-sm text-indigo-800 dark:text-indigo-300">
                            This tool transforms static data into a dynamic sandbox, helping quantify uncertainty and identify key growth levers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulationFAQ;
