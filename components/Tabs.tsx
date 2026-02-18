import React from 'react';
import { BarChart2, Sliders, Layers, Table, PieChart } from 'lucide-react';

interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'Forecast', icon: BarChart2 },
        { id: 'Parameters', icon: Sliders },
        { id: 'Scenarios', icon: Layers },
        { id: 'Data Table', icon: Table },
        { id: 'Analysis', icon: PieChart },
    ];

    return (
        <div className="flex overflow-x-auto border-b border-border-light dark:border-border-dark px-4 md:px-6 scrollbar-hide">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                            ${isActive 
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.id}
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;