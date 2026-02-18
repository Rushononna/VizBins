import React, { useState, useMemo, useCallback } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { DEFAULT_PARAMETERS, ACTUAL_2023_DATA, SCENARIOS } from './constants';
import type { SimulationParameters, Scenario, QuarterlyData } from './types';
import Header from './components/Header';
import FormulaBreakdown from './components/FormulaBreakdown';
import StatCard from './components/StatCard';
import Tabs from './components/Tabs';
import ThemeToggle from './components/ThemeToggle';
import ForecastView from './components/views/ForecastView';
import ParametersView from './components/views/ParametersView';
import ScenariosView from './components/views/ScenariosView';
import DataTableView from './components/views/DataTableView';
import AnalysisView from './components/views/AnalysisView';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('Forecast');
    const [parameters, setParameters] = useState<SimulationParameters>(DEFAULT_PARAMETERS);
    const [scenarios, setScenarios] = useState<Scenario[]>(SCENARIOS);
    const [actualData, setActualData] = useState<QuarterlyData[]>(ACTUAL_2023_DATA);

    // Pass the last actual quarter to the simulation hook to anchor the forecast
    const forecastData = useSimulation(parameters, actualData[actualData.length - 1]);
    const fullData = useMemo(() => [...actualData, ...forecastData], [actualData, forecastData]);

    const handleParameterChange = useCallback((key: keyof SimulationParameters, value: number | number[]) => {
        setParameters(prev => ({ ...prev, [key]: value }));
    }, []);

    const resetParameters = useCallback(() => {
        setParameters(DEFAULT_PARAMETERS);
    }, []);

    const handleAddScenario = (name: string, description: string) => {
        if (scenarios.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            alert(`A scenario with the name "${name}" already exists.`);
            return;
        }
        const newScenario: Scenario = {
            name,
            description,
            parameters,
            color: '#14b8a6', // teal-500
            isCustom: true,
        };
        setScenarios(prev => [...prev, newScenario]);
        setActiveTab('Scenarios');
    };

    const handleDeleteScenario = useCallback((scenarioName: string) => {
        setScenarios(prev => prev.filter(s => s.name !== scenarioName));
    }, []);

    const handleApplyScenario = useCallback((scenario: Scenario) => {
        setParameters(scenario.parameters);
        setActiveTab('Forecast');
    }, []);

    const handleUploadData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                if (!text) return;

                try {
                    const lines = text.split('\n').filter(l => l.trim());
                    if (lines.length < 2) return;

                    const headers = lines[0].split(',').map(h => h.trim());
                    const parsedData: QuarterlyData[] = [];

                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',');
                        if (values.length < headers.length) continue;

                        const row: any = {};
                        headers.forEach((h, index) => {
                            const val = values[index]?.trim();
                            if (h === 'quarter' || h === 'type') {
                                row[h] = val;
                            } else {
                                const num = parseFloat(val);
                                row[h] = isNaN(num) ? undefined : num; // Use undefined for missing nums to trigger calcs
                            }
                        });
                        
                        // Default undefined numbers to 0 for core fields if missing
                        row.newDirect = row.newDirect ?? 0;
                        row.oldDirect = row.oldDirect ?? 0;
                        row.oldMeta = row.oldMeta ?? 0;
                        row.total = row.total ?? (row.newDirect + row.oldDirect + row.oldMeta);

                        if (row.type === 'Actual' || !row.type) { // Assume Actual if type missing
                            row.type = 'Actual';
                            parsedData.push(row as QuarterlyData);
                        }
                    }

                    // Post-process to calculate derived metrics (QoQ, %, etc.) if they were missing in CSV
                    const processedData = parsedData.map((row, index) => {
                        const prev = index > 0 ? parsedData[index - 1] : null;

                        // 1. Calculate Percentages if missing
                        if (row.total > 0) {
                            if (row.newPercent === undefined) row.newPercent = (row.newDirect / row.total) * 100;
                            if (row.oldDirectPercent === undefined) row.oldDirectPercent = (row.oldDirect / row.total) * 100;
                            if (row.oldMetaPercent === undefined) row.oldMetaPercent = (row.oldMeta / row.total) * 100;
                        }

                        // 2. Calculate Sub-segment Percentages
                        if (row.newOfDirectPercent === undefined && (row.newDirect + row.oldDirect) > 0) {
                            row.newOfDirectPercent = (row.newDirect / (row.newDirect + row.oldDirect)) * 100;
                        }
                        if (row.newOfMetaPercent === undefined && (row.newDirect + row.oldMeta) > 0) {
                            row.newOfMetaPercent = (row.newDirect / (row.newDirect + row.oldMeta)) * 100;
                        }

                        // 3. Calculate QoQ Growth
                        if (row.qoqGrowth === undefined) {
                            if (prev && prev.total > 0) {
                                row.qoqGrowth = ((row.total - prev.total) / prev.total) * 100;
                            } else {
                                row.qoqGrowth = 0;
                            }
                        }

                        return row;
                    });

                    if (processedData.length > 0) {
                        setActualData(processedData);
                        alert(`Successfully loaded ${processedData.length} actual data rows.`);
                    }
                } catch (error) {
                    console.error("Failed to parse CSV", error);
                    alert("Failed to parse CSV file. Please check the format.");
                }
            };
            reader.readAsText(file);
        }
    }, []);

    const handleExportCSV = useCallback(() => {
        if (fullData.length === 0) {
            alert("No data available to export.");
            return;
        }

        const headers = Object.keys(fullData[0]);
        const csvContent = [
            headers.join(','),
            ...fullData.map(row => 
                headers.map(header => {
                    const cell = row[header as keyof QuarterlyData];
                    // Handle potential commas in string data by quoting them
                    if (typeof cell === 'string' && cell.includes(',')) {
                        return `"${cell}"`;
                    }
                    return cell !== undefined && cell !== null ? cell : '';
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'simulation_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [fullData]);
    
    const firstForecastQuarter = forecastData[0];
    const lastActualQuarter = actualData[actualData.length - 1];

    const totalOrdersGrowth = firstForecastQuarter && lastActualQuarter ? ((firstForecastQuarter.total - lastActualQuarter.total) / lastActualQuarter.total) * 100 : 0;
    const newOrdersGrowth = firstForecastQuarter && lastActualQuarter ? ((firstForecastQuarter.newDirect - lastActualQuarter.newDirect) / lastActualQuarter.newDirect) * 100 : 0;
    const oldDirectOrdersGrowth = firstForecastQuarter && lastActualQuarter ? ((firstForecastQuarter.oldDirect - lastActualQuarter.oldDirect) / lastActualQuarter.oldDirect) * 100 : 0;
    const oldMetaOrdersGrowth = firstForecastQuarter && lastActualQuarter ? ((firstForecastQuarter.oldMeta - lastActualQuarter.oldMeta) / lastActualQuarter.oldMeta) * 100 : 0;

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Parameters':
                return (
                    <ParametersView 
                        parameters={parameters} 
                        onParameterChange={handleParameterChange} 
                        onReset={resetParameters} 
                        onSaveScenario={handleAddScenario} 
                    />
                );
            case 'Scenarios':
                return (
                    <ScenariosView 
                        scenarios={scenarios} 
                        onDeleteScenario={handleDeleteScenario} 
                        onApplyScenario={handleApplyScenario}
                    />
                );
            case 'Data Table':
                return <DataTableView data={fullData} />;
            case 'Analysis':
                 return <AnalysisView baseParameters={parameters} />;
            case 'Forecast':
            default:
                return <ForecastView data={fullData} />;
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-sans transition-colors duration-200 min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <Header onExportCSV={handleExportCSV} onUploadData={handleUploadData} />
                <FormulaBreakdown />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title={`Total Orders (${firstForecastQuarter ? firstForecastQuarter.quarter : 'Forecast'})`}
                        value={firstForecastQuarter?.total} 
                        growth={totalOrdersGrowth} 
                        isMain
                    />
                    <StatCard 
                        title="New Direct Orders" 
                        value={firstForecastQuarter?.newDirect} 
                        growth={newOrdersGrowth} 
                        color="blue" 
                    />
                    <StatCard 
                        title="Old Direct Orders" 
                        value={firstForecastQuarter?.oldDirect} 
                        growth={oldDirectOrdersGrowth} 
                        color="purple" 
                    />
                    <StatCard 
                        title="Old Meta Orders" 
                        value={firstForecastQuarter?.oldMeta} 
                        growth={oldMetaOrdersGrowth} 
                        color="pink" 
                    />
                </div>

                <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-lg overflow-hidden">
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="p-4 md:p-6 min-h-[500px]">
                        {renderActiveTab()}
                    </div>
                </div>
            </div>
            <ThemeToggle />
        </div>
    );
};

export default App;