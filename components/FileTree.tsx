import React from 'react';
import { SoftwareMimicryResult } from '../types';
import { Icon, IconName } from './Icons';

const getFileIcon = (language: string): React.ReactNode => {
    // Basic for now, can be expanded
    switch (language.toLowerCase()) {
        case 'kotlin':
            return <span className="w-4 h-4 text-purple-400">KT</span>; // Consider creating a custom icon for Kotlin
        case 'xml':
            return <span className="w-4 h-4 text-orange-400">{'<>'}</span>; // Consider creating a custom icon for XML
        case 'groovy':
             return <span className="w-4 h-4 text-cyan-400">G</span>; // Consider creating a custom icon for Groovy
        default:
            return <Icon name="fileCode" className="w-4 h-4 text-gray-500" />;
    }
};

const FileTree: React.FC<{ summary: SoftwareMimicryResult['decompileSummary'] }> = ({ summary }) => {
    return (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="p-3 bg-gray-800/70 border-b border-gray-700">
                <h4 className="font-bold text-blue-300">Decompiled File Structure</h4>
                <p className="text-xs text-gray-400">{summary.totalFiles} files detected across {summary.languages.length} languages.</p>
            </div>
            <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
                {(summary.files ?? []).map((file, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm font-mono group">
                        <span className="text-blue-400/50">|</span>
                        <div className="flex-shrink-0">{getFileIcon(file.language)}</div>
                        <span className="text-gray-400 group-hover:text-white transition-colors">{file.path}</span>
                        <span className="flex-grow border-b border-dashed border-gray-700/50"></span>
                        <span className="text-gray-500">{file.lineCount} lines</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileTree;
