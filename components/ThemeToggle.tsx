import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check initial system preference or class
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-yellow-400 hover:scale-110 transition-transform z-50"
            aria-label="Toggle Theme"
        >
            {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
    );
};

export default ThemeToggle;