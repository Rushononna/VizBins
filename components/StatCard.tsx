import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
    title: string;
    value?: number;
    growth?: number;
    color?: 'blue' | 'purple' | 'pink' | 'emerald';
    isMain?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value = 0, growth = 0, color = 'blue', isMain = false }) => {
    const isPositive = growth > 0;
    const isNeutral = growth === 0;

    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        pink: 'from-pink-500 to-pink-600',
        emerald: 'from-emerald-500 to-emerald-600',
    };

    const gradientClass = colorClasses[color];

    return (
        <div className={`relative p-6 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md 
            ${isMain 
                ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-transparent' 
                : 'bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark'
            }`}
        >
            <h3 className={`text-sm font-medium mb-1 ${isMain ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {title}
            </h3>
            
            <div className="flex items-end justify-between mt-2">
                <div className={`text-3xl font-bold tracking-tight ${isMain ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {value.toLocaleString()}
                </div>
                
                <div className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm
                    ${isMain 
                        ? 'bg-white/20 text-white' 
                        : isPositive 
                            ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30' 
                            : isNeutral 
                                ? 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800' 
                                : 'text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-900/30'
                    }`}
                >
                    {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : isNeutral ? <Minus className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                    {Math.abs(growth).toFixed(1)}%
                </div>
            </div>

            {!isMain && (
                <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div 
                        className={`h-full rounded-full bg-gradient-to-r ${gradientClass}`} 
                        style={{ width: '60%' }} 
                    />
                </div>
            )}
        </div>
    );
};

export default StatCard;