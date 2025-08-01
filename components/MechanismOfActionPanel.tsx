import React from 'react';
import { MechanismOfAction } from '../types';
import { Icon } from './Icons';

const isValidMOA = (moa: MechanismOfAction): boolean => {
  return (
    moa != null &&
    typeof moa.summary === 'string' &&
    typeof moa.bindingType === 'string' &&
    Array.isArray(moa.downstreamEffects) &&
    moa.downstreamEffects.every((effect) => typeof effect === 'string')
  );
};

const MechanismOfActionPanel: React.FC<{ moa: MechanismOfAction }> = ({ moa }) => {
  if (!isValidMOA(moa)) {
    return (
      <div className="text-red-400 text-center" role="alert">
        Invalid mechanism of action data
      </div>
    );
  }

  return (
    <div
      className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700 grid md:grid-cols-2 gap-6"
      role="region"
      aria-label="Mechanism of Action"
    >
      <div className="space-y-4">
        <h4 className="font-bold text-lg text-teal-300 flex items-center gap-2">
          <Icon name="gitBranch" className="w-5 h-5" />
          Mechanism Summary
        </h4>
        <p className="text-gray-300">{moa.summary}</p>
        <div className="bg-gray-900/50 p-3 rounded-lg">
          <span className="text-sm text-gray-400">Binding Type</span>
          <p className="text-lg font-semibold text-white">{moa.bindingType}</p>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="font-bold text-lg text-teal-300">Predicted Downstream Effects</h4>
        {moa.downstreamEffects.length > 0 ? (
          <ul className="space-y-2" role="list" aria-label="Predicted Downstream Effects">
            {moa.downstreamEffects.map((effect, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-300">
                <Icon name="checkCircle" className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>{effect}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No downstream effects predicted.</p>
        )}
      </div>
    </div>
  );
};

export default MechanismOfActionPanel;
