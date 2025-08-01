import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CognitiveCubeSimulation, CubeNode, CubeConnection } from '../types';

// Augment React's JSX interface to include react-three-fiber's elements
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

interface CognitiveCubeProps {
  simulation: CognitiveCubeSimulation;
}

const nodeColors: Record<CubeNode['type'], string> = {
    factor: '#a78bfa', // violet-400
    sentiment: '#34d399', // emerald-400
    risk: '#f87171', // red-400
    reward: '#60a5fa', // blue-400
    macro: '#facc15', // yellow-400
    catalyst: '#fb923c', // orange-400
    component: '#22d3ee', // cyan-400
    relationship: '#f472b6', // pink-400
};

const Node: React.FC<{ node: CubeNode; onClick: () => void; isHighlighted: boolean }> = ({ node, onClick, isHighlighted }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState(new THREE.Vector3(node.position.x, node.position.y, node.position.z));
  const [scale, setScale] = useState(0.1 + node.energy * 0.2);

  useEffect(() => {
    setPosition(new THREE.Vector3(node.position.x, node.position.y, node.position.z));
    setScale(0.1 + node.energy * 0.2);
  }, [node]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.lerp(position, 0.05);
    const targetScale = isHighlighted ? scale * 1.8 : (isHovered ? scale * 1.5 : scale);
    ref.current.scale.lerp(new THREE.Vector3(1, 1, 1).multiplyScalar(targetScale), 0.1);
    
    const time = state.clock.getElapsedTime();
    const seed = node.id ? node.id.charCodeAt(0) : Math.random() * 100;
    ref.current.position.x += Math.sin(time * 0.5 + seed) * 0.0005;
    ref.current.position.y += Math.cos(time * 0.3 + seed) * 0.0005;
  });

  return (
    <mesh
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={nodeColors[node.type]}
        emissive={nodeColors[node.type]}
        emissiveIntensity={node.energy * 1.5 + (isHighlighted ? 2.0 : (isHovered ? 1.5 : 0.5))}
        toneMapped={false}
      />
      <Text
        position={[0, scale * 1.3, 0]}
        visible={isHovered || isHighlighted}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
    </mesh>
  );
};

const Connections: React.FC<{ nodes: CubeNode[]; connections: CubeConnection[] }> = ({ nodes, connections }) => {
    const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n.position])), [nodes]);

    return (
        <group>
            {connections.map((conn, index) => {
                const fromPos = nodeMap.get(conn.from);
                const toPos = nodeMap.get(conn.to);
                if (!fromPos || !toPos) return null;

                const start = new THREE.Vector3(fromPos.x, fromPos.y, fromPos.z);
                const end = new THREE.Vector3(toPos.x, toPos.y, toPos.z);
                const color = conn.type === 'synergy' ? new THREE.Color('#34d399') : new THREE.Color('#f87171');

                return (
                    <Line
                        key={index}
                        points={[start, end]}
                        color={color}
                        lineWidth={conn.strength * 1.5}
                        dashed={conn.type === 'conflict'}
                        dashScale={10}
                        opacity={0.4}
                        transparent
                    />
                );
            })}
        </group>
    );
};

const Scene: React.FC<{ simulation: CognitiveCubeSimulation }> = ({ simulation }) => {
    const { finalState, activeTool } = simulation;
    const controls = useRef<any>(null);
    const [target, setTarget] = useState(new THREE.Vector3(0, 0, 0));

    // Map tool names to relevant node types for highlighting
    const toolNodeMap: Record<string, CubeNode['type'][]> = {
        runDrugDiscovery: ['component', 'catalyst'], // Drug discovery might highlight compound/target nodes
        runFinancialAnalysis: ['macro', 'sentiment', 'risk', 'reward'], // Financial analysis might highlight market factors
        runPerformanceAnalysis: ['component'], // Performance might highlight software components
        runSecurityAnalysis: ['component', 'risk'], // Security might highlight vulnerable components
    };

    const highlightedNodeTypes = activeTool ? toolNodeMap[activeTool] || [] : [];

    useFrame(() => {
        if (controls.current) {
            controls.current.target.lerp(target, 0.1);
            controls.current.update();
        }
    });

    const handleNodeClick = (nodePosition: { x: number, y: number, z: number }) => {
        setTarget(new THREE.Vector3(nodePosition.x, nodePosition.y, nodePosition.z));
    };
    
    return (
        <React.Fragment>
            <ambientLight intensity={0.1} />
            <pointLight position={[5, 5, 5]} intensity={0.5} />
            <OrbitControls ref={controls} enableDamping dampingFactor={0.1} />

            <mesh>
                 <boxGeometry args={[2.5, 2.5, 2.5]} />
                 <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.1} wireframe transparent opacity={0.15} />
            </mesh>

            <Connections nodes={finalState.nodes} connections={finalState.connections} />

            {finalState.nodes.map(node => (
                <Node 
                    key={node.id} 
                    node={node} 
                    onClick={() => handleNodeClick(node.position)} 
                    isHighlighted={highlightedNodeTypes.includes(node.type)}
                />
            ))}
        </React.Fragment>
    );
};


const CognitiveCube: React.FC<CognitiveCubeProps> = ({ simulation }) => {
    if (!simulation?.finalState?.nodes || !simulation?.finalState?.connections) {
        return <div className="text-red-400 flex items-center justify-center h-full">Invalid simulation data</div>;
    }
    const isChatMode = simulation.initialState === simulation.finalState;
    
    return (
        <div className={`border rounded-2xl transition-all duration-500 w-full h-full relative ${isChatMode ? 'border-violet-800/50 bg-transparent' : 'bg-gray-800/50 border-gray-700'}`}>
            <div className={`w-full h-full rounded-lg transition-shadow duration-1000 overflow-hidden ${isChatMode ? 'nebula-bg' : ''}`}>
                 <Canvas camera={{ position: [0, 0, 3.5], fov: 60 }}>
                    <Scene simulation={simulation} />
                    <EffectComposer>
                        <Bloom
                            intensity={0.4}
                            luminanceThreshold={0.3}
                            luminanceSmoothing={0.5}
                        />
                    </EffectComposer>
                </Canvas>
            </div>
             <p className="absolute bottom-2 left-4 text-gray-400/80 italic text-xs text-left max-w-sm">{simulation.simulationSummary}</p>
        </div>
    );
};

export default CognitiveCube;