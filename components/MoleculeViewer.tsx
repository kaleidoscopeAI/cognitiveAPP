import React, { useEffect, useState } from 'react';

declare global {
    interface Window { initRDKitModule: () => Promise<any>; }
}

const MoleculeViewer: React.FC<{ name: string; smiles: string }> = ({ name, smiles }) => {
    const [svg, setSvg] = useState<string | null>(null);
    const [rdKitError, setRdKitError] = useState<string | null>(null);
    const [rdKitLoaded, setRdKitLoaded] = useState(false);

    useEffect(() => {
        window.initRDKitModule()
            .then(() => {
                setRdKitLoaded(true);
            })
            .catch(() => {
                setRdKitError('Error loading RDKit module. Cannot display molecule.');
            });
    }, []);

    useEffect(() => {
        if (!rdKitLoaded || !smiles) return;

        try {
            const mol = window.RDKit.get_mol(smiles);
            if (mol) {
                const generatedSvg = mol.get_svg();
                setSvg(generatedSvg);
                setRdKitError(null);
            } else {
                setRdKitError(`Invalid SMILES string: ${smiles}`);
                setSvg(null);
            }
        } catch (error) {
            setRdKitError('An unexpected error occurred while generating the molecule.');
            setSvg(null);
        }

    }, [smiles, rdKitLoaded]);

    return (
        <div className="w-full h-80 bg-gray-900/50 rounded-2xl flex items-center justify-center relative overflow-hidden p-4 border border-gray-700">
            {rdKitError ? (
                <div className="text-center text-red-400">
                    <p><strong>Molecule Generation Failed</strong></p>
                    <p className="text-sm">{rdKitError}</p>
                </div>
            ) : svg ? (
                <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svg }} />
            ) : (
                <div className="text-center text-gray-400">Loading RDKit...</div>
            )}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm p-2 rounded-md">
                <h4 className="font-bold text-teal-300 text-lg">{name}</h4>
                <p className="text-xs text-gray-400">SMILES: {smiles}</p>
            </div>
        </div>
    );
};

export default MoleculeViewer;

