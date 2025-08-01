import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ChatState, ChatMessage } from '../types';
import CognitiveCube from './CognitiveCube';
import { Icon } from './Icons';


// Custom hook for streaming text effect
const useTypingEffect = (text: string, speed = 20) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        if (!text) {
            setDisplayedText('');
            return;
        }
        setDisplayedText(''); // Reset on new text
        let i = 0;
        
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed]);

    return displayedText;
};

const AIMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const displayText = useTypingEffect(message.text);
    return <p>{displayText}</p>;
};

const ToolMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const toolOutput = JSON.parse(message.text);
    return (
        <div className="bg-gray-700/50 p-3 rounded-lg text-xs font-mono text-gray-300 overflow-x-auto">
            <p className="text-blue-300 font-bold mb-1">Tool Used: {toolOutput.toolName}</p>
            <pre className="whitespace-pre-wrap">{JSON.stringify(toolOutput.result, null, 2)}</pre>
        </div>
    );
};

const ConsciousnessChat: React.FC<{
    chatState: ChatState | null;
    onSendMessage: (message: string, activeTool?: string) => void; // Updated signature
    isLoading: boolean;
}> = ({ chatState, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useLayoutEffect(() => {
        scrollToBottom();
    }, [chatState?.messages]);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };
    
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    const lastMessage = chatState?.messages?.[chatState.messages.length - 1];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Cognitive Cube Side */}
            <div className="flex flex-col h-[75vh]">
                <h2 className="text-3xl font-bold mb-4 text-violet-300 flex items-center gap-3">
                    <Icon name="brainCircuit" className="w-8 h-8" />
                    Live Consciousness
                </h2>
                <div className="flex-grow min-h-0">
                    {chatState?.cubeState ? (
                        <CognitiveCube simulation={{ ...chatState.cubeState, simulationSummary: "Real-time state of the AI's cognitive model as it processes your conversation." }} />
                    ) : (
                        <div className="w-full h-full bg-gray-900/30 border border-violet-800/50 rounded-2xl flex items-center justify-center nebula-bg">
                            <p className="text-gray-400 text-lg">Consciousness awaits. Send a message.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Side */}
            <div className="flex flex-col bg-black/30 border border-violet-800/50 rounded-2xl max-h-[75vh] backdrop-blur-sm">
                 <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
                    <div className="space-y-6">
                        {(chatState?.messages ?? []).map((msg) => (
                             <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                 {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0 flex items-center justify-center shadow-lg"><Icon name="brainCircuit" className="w-5 h-5 text-white" /></div>}
                                <div className={`max-w-md p-3 px-4 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-br-lg' : 'bg-gray-800/80 text-gray-200 rounded-bl-lg'}`}>
                                    {msg.sender === 'ai' && msg.id === lastMessage?.id ? <AIMessage message={msg} /> : <p>{msg.text}</p>}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3 justify-start">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0 flex items-center justify-center shadow-lg"><Icon name="brainCircuit" className="w-5 h-5 text-white" /></div>
                                <div className="max-w-md p-4 rounded-2xl bg-gray-800/80 text-gray-200 rounded-bl-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 italic">Thinking...</span>
                                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                 <div className="p-4 border-t border-violet-800/50">
                     <div className="relative rounded-full transition-all duration-300 input-pulse-glow">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Converse with the AI..."
                            className="w-full pl-5 pr-14 py-3 text-base bg-gray-900/80 border border-gray-600 rounded-full focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-300"
                            disabled={isLoading}
                        />
                         <button onClick={handleSend} disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold p-2.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 disabled:scale-100">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsciousnessChat;