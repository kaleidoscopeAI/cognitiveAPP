import React from 'react';
import { ArchitectureAnalysis, ArchitectureComponent } from '../types';
import { Icon, IconName } from './Icons';

interface ArchComponentProps {
  iconName: IconName;
  name: string;
  description: string;
  className?: string;
}

const ArchComponent: React.FC<ArchComponentProps> = ({ iconName, name, description, className = '' }) => (
  <div className={`flex flex-col items-center text-center p-4 bg-gray-800/70 border border-gray-700 rounded-lg shadow-lg ${className}`}>
    <div className="mb-2 p-3 bg-blue-900/50 text-blue-300 rounded-full"><Icon name={iconName} className="w-6 h-6" /></div>
    <p className="font-bold text-white">{name}</p>
    <p className="text-xs text-gray-400">{description}</p>
  </div>
);

const FlowArrow: React.FC<{ isVertical?: boolean }> = ({ isVertical = false }) => (
    <svg className={`flex-shrink-0 text-gray-600 ${isVertical ? 'transform rotate-90' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const isValidAnalysis = (analysis: ArchitectureAnalysis): boolean => {
  return (
    analysis &&
    typeof analysis.style === 'string' &&
    Array.isArray(analysis.dataFlow) &&
    analysis.components.every(c => c.type && c.name && c.description)
  );
};


const ArchitectureDiagram: React.FC<{ analysis: ArchitectureAnalysis }> = ({ analysis }) => {
    if (!isValidAnalysis(analysis)) {
        return <div className="text-red-400 text-center flex items-center justify-center h-full">Invalid architecture analysis data</div>;
    }

    const orderedComponents = analysis.dataFlow
        .map(type => analysis.components.find(c => c.type === type))
        .filter(Boolean) as ArchitectureComponent[];

    const iconMap: Record<ArchitectureComponent['type'], IconName> = {
        frontend: "smartphone",
        service: "server",
        backend: "server",
        api: "database",
        database: "database",
        library: "codeBrackets",
    };

    return (
        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700" role="figure" aria-label={`Architecture Diagram for ${analysis.style}`}>
            <h3 className="sr-only">{analysis.style} Architecture Diagram</h3>
            <h4 className="text-center font-bold text-lg text-blue-300 mb-2">Architecture Style: {analysis.style}</h4>
            <p className="text-center text-sm text-gray-400 mb-6 italic">Data Flow: {analysis.dataFlow.join(' → ')}</p>
            
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-center space-x-4">
                {orderedComponents.map((component, index) => (
                    <React.Fragment key={component.name + index}>
                        <ArchComponent
                            iconName={iconMap[component.type] || "server"}
                            name={component.name}
                            description={component.description}
                            className="w-40"
                        />
                        {index < orderedComponents.length - 1 && <FlowArrow />}
                    </React.Fragment>
                ))}
            </div>
            
            {/* Vertical Layout for Mobile */}
            <div className="flex flex-col md:hidden items-center space-y-4">
                 {orderedComponents.map((component, index) => (
                    <React.Fragment key={component.name + index}>
                        <ArchComponent
                           iconName={iconMap[component.type] || "server"}
                           name={component.name}
                           description={component.description}
                           className="w-48"
                        />
                        {index < orderedComponents.length - 1 && <FlowArrow isVertical={true} />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default ArchitectureDiagram;