import React, { useState } from 'react';
import { FinancialAnalysisResult, AlgorithmicStrategyResult } from '../types';
import { Icon, IconName } from './Icons';
import CandlestickChart from './CandlestickChart';
import IndicatorGauges from './IndicatorGauges';
import { useStore } from '../store';

const InfoCard: React.FC<{ title: string; children: React.ReactNode; iconName: IconName }> = ({ title, children, iconName }) => (
    <div className="bg-stone-800/50 border border-stone-700/80 rounded-2xl p-6">
        <h3 className="flex items-center gap-2 text-xl font-bold text-amber-300 mb-4">
            <Icon name={iconName} className="w-6 h-6" />
            {title}
        </h3>
        {children}
    </div>
);

const FinancialResults: React.FC<{ result: FinancialAnalysisResult }> = ({ result }) => {
    const { prediction, technicalAnalysis, fundamentalAnalysis, priceHistory, companyName, ticker, algorithmicStrategy } = result;
    const [strategyInput, setStrategyInput] = useState('');
    const { runAlgorithmicStrategy, isLoading } = useStore();

    const handleRunStrategy = () => {
        if (strategyInput.trim()) {
            runAlgorithmicStrategy(ticker, strategyInput);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-4xl font-extrabold text-amber-300">{companyName} ({ticker})</h2>
                <p className="text-lg text-gray-400 mt-1">{prediction.thesis}</p>
            </div>
            
            {/* Key Prediction Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-stone-800/60 p-6 rounded-2xl border border-stone-700">
                    <p className="text-sm text-gray-400">Price Target</p>
                    <p className="text-4xl font-bold text-white">${prediction.priceTarget.toFixed(2)}</p>
                </div>
                <div className="bg-stone-800/60 p-6 rounded-2xl border border-stone-700">
                    <p className="text-sm text-gray-400">Timeframe</p>
                    <p className="text-4xl font-bold text-white">{prediction.timeframe}</p>
                </div>
                <div className="bg-stone-800/60 p-6 rounded-2xl border border-stone-700">
                    <p className="text-sm text-gray-400">Confidence</p>
                     <div className="w-full bg-gray-700 rounded-full h-8 mt-3">
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-8 rounded-full text-center text-sm text-black font-bold flex items-center justify-center" style={{ width: `${prediction.confidence * 100}%` }}>
                            {(prediction.confidence * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Chart and Technical Analysis */}
                <div className="lg:col-span-2 space-y-8">
                    <InfoCard title="Price History" iconName="barChart">
                        <CandlestickChart data={priceHistory} />
                    </InfoCard>
                    <InfoCard title="Technical Analysis" iconName="activity">
                         <p className="text-gray-300 mb-6">{technicalAnalysis.summary}</p>
                        <IndicatorGauges indicators={technicalAnalysis.indicators} />
                    </InfoCard>
                </div>

                {/* Right Column: Fundamental Analysis */}
                <div className="space-y-8">
                     <InfoCard title="Fundamental Analysis" iconName="scale">
                        <p className="text-gray-300 mb-4">{fundamentalAnalysis.summary}</p>
                        <div className="flex justify-around text-center mb-6">
                            <div>
                                <p className="text-sm text-gray-400">P/E Ratio</p>
                                <p className="text-2xl font-bold text-white">{fundamentalAnalysis.peRatio.toFixed(1)}</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-400">Revenue Growth</p>
                                <p className="text-2xl font-bold text-white">{fundamentalAnalysis.revenueGrowth.toFixed(1)}%</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="flex items-center gap-2 text-lg font-semibold text-green-400 mb-2"><Icon name="trendingUp" className="w-5 h-5"/> Strengths</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-300">
                                    {fundamentalAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="flex items-center gap-2 text-lg font-semibold text-red-400 mb-2"><Icon name="alertTriangle" className="w-5 h-5"/> Weaknesses</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-300">
                                     {fundamentalAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard title="Algorithmic Strategy Backtesting" iconName="activity">
                        <p className="text-gray-300 mb-4">Define a simple trading strategy to backtest against historical data.</p>
                        <input
                            type="text"
                            placeholder="e.g., 'Buy when RSI < 30, Sell when RSI > 70'"
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white mb-4"
                            value={strategyInput}
                            onChange={(e) => setStrategyInput(e.target.value)}
                        />
                        <button 
                            onClick={handleRunStrategy}
                            disabled={isLoading || !strategyInput.trim()}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Running Backtest...' : 'Run Strategy Backtest'}
                        </button>

                        {result.algorithmicStrategy && (
                            <div className="mt-6 space-y-3">
                                <h5 className="font-bold text-lg text-amber-300">{result.algorithmicStrategy.strategyName} Results:</h5>
                                <p className="text-gray-300 text-sm">{result.algorithmicStrategy.summary}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                                    <span>CAGR: <span className="font-semibold text-white">{(result.algorithmicStrategy.performanceMetrics.cagr * 100).toFixed(2)}%</span></span>
                                    <span>Sharpe Ratio: <span className="font-semibold text-white">{result.algorithmicStrategy.performanceMetrics.sharpeRatio.toFixed(2)}</span></span>
                                    <span>Max Drawdown: <span className="font-semibold text-white">{(result.algorithmicStrategy.performanceMetrics.maxDrawdown * 100).toFixed(2)}%</span></span>
                                    <span>Volatility: <span className="font-semibold text-white">{(result.algorithmicStrategy.performanceMetrics.volatility * 100).toFixed(2)}%</span></span>
                                </div>
                                {result.algorithmicStrategy.trades.length > 0 && (
                                    <div className="mt-4">
                                        <h6 className="font-semibold text-gray-300">Sample Trades:</h6>
                                        <ul className="list-disc list-inside text-xs text-gray-400">
                                            {result.algorithmicStrategy.trades.map((trade, i) => (
                                                <li key={i}>{trade.date}: {trade.type} {trade.quantity} shares at ${trade.price.toFixed(2)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default FinancialResults;