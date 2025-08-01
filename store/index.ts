import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { AppMode, DrugDiscoveryResult, SystemAnalysisResult, ChatState, SoftwareMimicryResult, FinancialAnalysisResult, ChatMessage } from '../types';
import { runDrugDiscovery, runSystemAnalysis, runConsciousnessChat, runSoftwareMimicry, runFinancialAnalysis } from '../services/geminiService';

interface AppState {
  mode: AppMode;
  query: string;
  isLoading: boolean;
  error: string | null;
  isPaid: boolean;
  drugResult: DrugDiscoveryResult | null;
  systemResult: SystemAnalysisResult | null;
  softwareResult: SoftwareMimicryResult | null;
  financialResult: FinancialAnalysisResult | null;
  chatState: ChatState | null;
  setMode: (mode: AppMode) => void;
  setQuery: (query: string) => void;
  handlePaymentSuccess: () => void;
  runChat: (message: string, activeTool?: string) => Promise<void>;
  runGenerateDrugCandidate: (properties: { molecularWeight: number; logP: number; tpsa: number; hBondDonors: number; hBondAcceptors: number; drugLikeness: number; synthesisScore: number; }) => Promise<void>;
  runAlgorithmicStrategy: (ticker: string, strategy: string) => Promise<void>;
  runPerformanceAnalysis: (softwareDescription: string) => Promise<void>;
  runSecurityAnalysis: (softwareDescription: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  mode: 'drug',
  query: '',
  isLoading: false,
  error: null,
  isPaid: localStorage.getItem('kaleidoscope_ai_paid') === 'true',
  drugResult: null,
  systemResult: null,
  softwareResult: null,
  financialResult: null,
  chatState: null,

  setMode: (mode) => set({ mode, query: '', error: null }),
  setQuery: (query) => set({ query }),

  handlePaymentSuccess: () => {
    localStorage.setItem('kaleidoscope_ai_paid', 'true');
    set({ isPaid: true });
  },

  runAnalysis: async () => {
    const { query, mode } = get();
    if (!query.trim()) return;

    set({ isLoading: true, error: null });

    try {
      if (mode === 'drug') {
        set({ drugResult: null });
        const results = await runDrugDiscovery(query);
        set({ drugResult: results });
      } else if (mode === 'systemMimicry') {
        set({ systemResult: null, softwareResult: null });
        const [systemRes, softwareRes] = await Promise.all([
          runSystemAnalysis(query),
          runSoftwareMimicry(`A software system that embodies the principles of: ${query}`),
        ]);
        set({ systemResult: systemRes, softwareResult: softwareRes });
      } else if (mode === 'financial') {
        set({ financialResult: null });
        const results = await runFinancialAnalysis(query);
        set({ financialResult: results });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  runChat: async (message, activeTool) => {
    set({ isLoading: true, error: null });

    const newMessage: ChatMessage = { id: Date.now().toString(), text: message, sender: 'user' };
    const currentHistory = get().chatState?.messages ?? [];
    set(state => ({
      chatState: {
        messages: [...(state.chatState?.messages ?? []), newMessage],
        cubeState: state.chatState?.cubeState ?? { nodes: [], connections: [] },
      },
    }));

    try {
      const { response, cubeState } = await runConsciousnessChat(message, currentHistory);
      const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: response, sender: 'ai' };
      set(state => ({
        chatState: { messages: [...(state.chatState?.messages ?? []), aiMessage], cubeState: { ...cubeState, activeTool } },
      }));
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred in chat.';
      set({ error: errorMessage });
      toast.error(errorMessage);
      const errorChatMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: "I seem to have encountered an error. Please try again.", sender: 'ai' };
      set(state => ({
        chatState: { messages: [...(state.chatState?.messages ?? []), errorChatMessage], cubeState: state.chatState?.cubeState! },
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  runGenerateDrugCandidate: async (properties) => {
    set({ isLoading: true, error: null });
    try {
      const newCompound = await generateDrugCandidate(properties);
      set(state => ({
        drugResult: state.drugResult ? { ...state.drugResult, generatedCompounds: [...(state.drugResult.generatedCompounds || []), newCompound] } : null,
      }));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate drug candidate.';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  runAlgorithmicStrategy: async (ticker, strategy) => {
    set({ isLoading: true, error: null });
    try {
      const result = await runAlgorithmicStrategy(ticker, strategy);
      set(state => ({
        financialResult: state.financialResult ? { ...state.financialResult, algorithmicStrategy: result } : null,
      }));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to run algorithmic strategy.';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
}));