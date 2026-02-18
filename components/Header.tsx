
import React from 'react';
import { Plane, Download, Upload, HelpCircle } from 'lucide-react';

interface HeaderProps {
    onExportCSV: () => void;
    onUploadData?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenFAQ: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExportCSV, onUploadData, onOpenFAQ }) => {
    return (
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
                    <Plane className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Flight Order Simulation
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Historical Analysis & Quarterly Forecasting
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <button
                    onClick={onOpenFAQ}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                    title="Simulation Guide & FAQ"
                >
                    <HelpCircle className="w-6 h-6" />
                </button>
                {onUploadData && (
                    <label className="flex items-center px-4 py-2 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Data
                        <input type="file" accept=".csv" onChange={onUploadData} className="hidden" />
                    </label>
                )}
                <button 
                    onClick={onExportCSV}
                    className="flex items-center px-4 py-2 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                </button>
            </div>
        </header>
    );
};

export default Header;
