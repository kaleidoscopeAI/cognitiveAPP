import React, { useEffect, useMemo, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store';
import { AppMode } from './types';
import Paywall from './components/Paywall';
import { Icon } from './components/Icons';

const DiscoveryPipeline = React.lazy(() => import('./components/DiscoveryPipeline'));
const SystemResults = React.lazy(() => import('./components/SystemResults'));
const ConsciousnessChat = React.lazy(() => import('./components/ConsciousnessChat'));
const FinancialResults = React.lazy(() => import('./components/FinancialResults'));

const loadingTexts: Record<AppMode, string[]> = {
    drug: ["Analyzing disease pathways...", "Identifying protein targets...", "Running virtual screening...", "Simulating molecular docking..."],
    systemMimicry: ["Deconstructing system...", "Initializing Cognitive Cube...", "Simulating software architecture...", "Synthesizing key insights..."],
    chat: ["Waking consciousness...", "Calibrating neural pathways...", "Formulating response..."],
    financial: ["Fetching market data...", "Calculating technical indicators...", "Analyzing fundamental health...", "Generating price prediction..."]
};

const AnimatedLoader: React.FC<{ mode: AppMode }> = ({ mode }) => {
    const [index, setIndex] = React.useState(0);
    const texts = loadingTexts[mode];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 2200);
        return () => clearInterval(interval);
    }, [texts]);
    
    const accentColor = useMemo(() => {
        switch(mode) {
            case 'drug': return 'border-teal-400';
            case 'systemMimicry': return 'border-slate-400';
            case 'chat': return 'border-violet-400';
            case 'financial': return 'border-amber-400';
            default: return 'border-gray-400';
        }
    }, [mode]);

    return (
        <div className="flex flex-col items-center justify-center text-center gap-4 p-8">
            <div className={`animate-spin rounded-full h-16 w-16 border-b-2 ${accentColor}`}></div>
            <p className="text-xl text-gray-300 transition-opacity duration-500">{texts[index]}</p>
            <p className="text-gray-500">Kaleidoscope AI is processing your request.</p>
        </div>
    );
};

const App: React.FC = () => {
    const {
        mode, query, isLoading, error, isPaid,
        drugResult, systemResult, softwareResult, financialResult, chatState,
        setMode, setQuery, handlePaymentSuccess, runAnalysis, runChat
    } = useStore();

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && mode !== 'chat') {
            runAnalysis();
        }
    };

    const activeModeDetails = useMemo(() => {
        switch(mode) {
            case 'drug': return { accent: 'teal', placeholder: "Enter a disease (e.g., Alzheimer's)", iconName: "flask", title: 'Molecular Modeling', bg: 'to-teal-900/30' };
            case 'systemMimicry': return { accent: 'slate', placeholder: "Describe a system to analyze (e.g., 'the EV market')", iconName: "share2", title: 'System Mimicry (Beta)', bg: 'to-slate-900/30' };
            case 'chat': return { accent: 'violet', placeholder: "Converse with the AI...", iconName: "sparkles", title: 'Consciousness Chat', bg: 'to-violet-900/40' };
            case 'financial': return { accent: 'amber', placeholder: "Enter a stock ticker (e.g., AAPL)", iconName: "dollarSign", title: 'Financial Modeling', bg: 'to-amber-900/30' };
            default: return { accent: 'gray', placeholder: "Enter query...", iconName: "brainCircuit", title: 'Kaleidoscope AI', bg: 'to-gray-900/30' };
        }
    }, [mode]);

    const renderResults = () => {
        if (isLoading) return <AnimatedLoader mode={mode} />;
        if (error) return null; // Errors are now handled by react-hot-toast

        switch(mode) {
            case 'drug':
                return drugResult && <DiscoveryPipeline result={drugResult} />;
            case 'systemMimicry':
                return (systemResult || softwareResult) && <SystemResults systemResult={systemResult} softwareResult={softwareResult} />;
            case 'chat':
                return <ConsciousnessChat chatState={chatState} onSendMessage={(msg) => runChat(msg, chatState?.cubeState?.activeTool)} isLoading={isLoading} />;
            case 'financial':
                return financialResult && <FinancialResults result={financialResult} />;
            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-stone-950 via-stone-950 ${activeModeDetails.bg} text-white p-4 sm:p-8 transition-colors duration-500`}>
            <Toaster position="bottom-center" toastOptions={{ style: { background: '#222', color: 'white' } }} />
            {!isPaid && <Paywall onPaymentSuccess={handlePaymentSuccess} />}
            <style>{`
              @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
              .animate-fade-in { animation: fade-in 0.8s ease-in-out forwards; }
              @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
              .animate-fade-in-up { animation: fade-in-up 0.6s ease-in-out forwards; opacity: 0; }
            `}</style>
            <div className={`max-w-7xl mx-auto ${!isPaid ? 'pointer-events-none filter blur-sm' : ''}`}>
                <header className="mb-8 sm:mb-12">
                     <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                         <div className="inline-flex items-center gap-4">
                            <Icon name={activeModeDetails.iconName} className={`w-12 h-12 sm:w-16 sm:h-16 text-${activeModeDetails.accent}-400 transition-colors duration-500`} />
                            <div>
                                <h1 className={`text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-${activeModeDetails.accent}-300 to-cyan-500 transition-all duration-500`}>
                                    Kaleidoscope AI
                                </h1>
                                <p className="text-md sm:text-lg text-gray-400">{activeModeDetails.title}</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-gray-800/80 border border-gray-700 rounded-full p-1 self-center">
                            <button onClick={() => setMode('drug')} className={`px-3 py-1.5 text-xs sm:px-4 sm:text-sm font-semibold rounded-full transition-colors ${mode === 'drug' ? 'bg-teal-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>Drug Discovery</button>
                            <button onClick={() => setMode('financial')} className={`px-3 py-1.5 text-xs sm:px-4 sm:text-sm font-semibold rounded-full transition-colors ${mode === 'financial' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>Financial</button>
                            <button onClick={() => setMode('systemMimicry')} className={`relative px-3 py-1.5 text-xs sm:px-4 sm:text-sm font-semibold rounded-full transition-colors ${mode === 'systemMimicry' ? 'bg-slate-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                                System Mimicry
                                <span className="absolute -top-1 -right-1.5 bg-blue-500 text-white text-[10px] font-bold px-1.5 rounded-full">Beta</span>
                            </button>
                            <button onClick={() => setMode('chat')} className={`px-3 py-1.5 text-xs sm:px-4 sm:text-sm font-semibold rounded-full transition-colors ${mode === 'chat' ? 'bg-violet-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>Chat</button>
                        </div>
                    </div>
                </header>

                <main>
                    {mode !== 'chat' && (
                         <div className="max-w-3xl mx-auto mb-12">
                            <div className="relative">
                                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={handleKeyPress} placeholder={activeModeDetails.placeholder}
                                    className={`w-full pl-5 pr-32 py-4 text-lg bg-gray-800/80 border-2 border-gray-700 rounded-full focus:ring-2 focus:ring-${activeModeDetails.accent}-500 focus:border-${activeModeDetails.accent}-500 outline-none transition-all duration-300`}
                                    disabled={isLoading}/>
                                <button onClick={runAnalysis} disabled={isLoading || !query.trim()}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-${activeModeDetails.accent}-500 to-cyan-600 hover:from-${activeModeDetails.accent}-600 hover:to-cyan-700 text-white font-bold py-2.5 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105`}>
                                    {isLoading ? 'Analyzing...' : 'Analyze'}
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-8">
                        <Suspense fallback={<AnimatedLoader mode={mode} />}>
                            {renderResults()}
                        </Suspense>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;