import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function MycenaeanShip({ contingent }) {
  const shipGroup = useRef();
  const oarsGroup = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (shipGroup.current) {
      shipGroup.current.rotation.z = Math.sin(t * 1.2) * 0.04;
      shipGroup.current.rotation.x = Math.cos(t * 0.8) * 0.02;
      shipGroup.current.position.y = Math.sin(t * 1.5) * 0.15;
    }
    if (oarsGroup.current) {
      oarsGroup.current.children.forEach((oar, i) => {
        oar.rotation.z = Math.sin(t * 2 + i * 0.2) * 0.15;
      });
    }
  });

  const primaryColor = contingent?.color || "#dc2626";

  return (
    <group ref={shipGroup} position={[0, 0, 0]}>
      {/* HULL */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.6, 12, 16]} />
        <meshStandardMaterial 
          color="#2a1a08" 
          roughness={0.7} 
          metalness={0.1}
          rotation={[Math.PI / 2, 0, 0]} 
        />
      </mesh>

      {/* CRIMSON PROW */}
      <mesh position={[0, 1.2, 5.8]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.4, 3, 12]} />
        <meshStandardMaterial color={primaryColor} roughness={0.4} />
      </mesh>

      {/* BOW ORNAMENT */}
      <mesh position={[0, 2.6, 6.2]} rotation={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color={primaryColor} roughness={0.3} />
      </mesh>

      {/* STERN */}
      <mesh position={[0, 1.8, -5.8]} rotation={[-0.6, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.35, 3.5, 12]} />
        <meshStandardMaterial color="#3d2314" roughness={0.5} />
      </mesh>

      {/* DECK & BENCHES */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.2, 10]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.8} />
      </mesh>

      {/* MAST & SAIL */}
      <group position={[0, 2.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.16, 6, 12]} />
          <meshStandardMaterial color="#4a2e16" roughness={0.6} />
        </mesh>
        <mesh position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 6.5, 12]} />
          <meshStandardMaterial color="#4a2e16" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.8, 0.1]}>
          <planeGeometry args={[6, 3.5]} />
          <meshStandardMaterial 
            color="#f5f5f4" 
            side={THREE.DoubleSide} 
            roughness={0.9} 
          />
        </mesh>
        <mesh position={[0, 0.8, 0.12]}>
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial color={primaryColor} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* STEERING OARS */}
      <group position={[-0.8, -0.4, -4.8]} rotation={[0.3, 0.2, -0.4]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 3.5]} />
          <meshStandardMaterial color="#3d2314" />
        </mesh>
        <mesh position={[0, -1.5, 0]}>
          <boxGeometry args={[0.3, 1, 0.05]} />
          <meshStandardMaterial color="#2a1a08" />
        </mesh>
      </group>
      <group position={[0.8, -0.4, -4.8]} rotation={[0.3, -0.2, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 3.5]} />
          <meshStandardMaterial color="#3d2314" />
        </mesh>
        <mesh position={[0, -1.5, 0]}>
          <boxGeometry args={[0.3, 1, 0.05]} />
          <meshStandardMaterial color="#2a1a08" />
        </mesh>
      </group>

      {/* OARS */}
      <group ref={oarsGroup}>
        {Array.from({ length: 12 }).map((_, i) => {
          const zPos = -4 + i * 0.7;
          return (
            <React.Fragment key={i}>
              <group position={[-0.9, 0.2, zPos]} rotation={[0, 0, -0.4]}>
                <mesh position={[-1.2, -0.5, 0]} rotation={[0, 0, 0.8]}>
                  <cylinderGeometry args={[0.03, 0.03, 3]} />
                  <meshStandardMaterial color="#854d0e" />
                </mesh>
              </group>
              <group position={[0.9, 0.2, zPos]} rotation={[0, 0, 0.4]}>
                <mesh position={[1.2, -0.5, 0]} rotation={[0, 0, -0.8]}>
                  <cylinderGeometry args={[0.03, 0.03, 3]} />
                  <meshStandardMaterial color="#854d0e" />
                </mesh>
              </group>
            </React.Fragment>
          );
        })}
      </group>

      {/* WATER SURFACE */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          color="#0e7490" 
          transparent 
          opacity={0.7} 
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

export default function ShipViewer3D({ selectedContingent }) {
  return (
    <div className="w-full h-[480px] bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-slate-700 text-slate-200 text-xs">
        <h4 className="font-bold text-amber-400 text-sm">{selectedContingent?.name || "Mycenaean Galley"}</h4>
        <p>Type: {selectedContingent?.shipType || "Pentekonter"}</p>
        <p>Ships: {selectedContingent?.ships || 50} Galleys</p>
        <p className="text-slate-400 mt-1 italic">3D WebGL Interactive Render (Drag to Rotate, Scroll to Zoom)</p>
      </div>

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 5, 10]} fov={45} />
        <OrbitControls enablePan={true} minDistance={5} maxDistance={20} maxPolarAngle={Math.PI / 2 - 0.05} />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#38bdf8" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <MycenaeanShip contingent={selectedContingent} />
        </Float>

        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
