import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';

interface HeadMeshProps {
  imageSrc: string;
}

const HeadAndEyesMesh: React.FC<HeadMeshProps> = ({ imageSrc }) => {
  const headGroupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imageSrc, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, [imageSrc]);

  useFrame((state) => {
    if (!headGroupRef.current) return;
    const { x, y } = state.pointer; // Mouse coords normalized -1 to 1

    // 1. 3D Head Rotation Tracking (Pitch, Yaw, Roll)
    const targetRotY = x * 0.55; // Left/Right head turn
    const targetRotX = -y * 0.40; // Up/Down head pitch
    const targetRotZ = -x * 0.12; // Head tilt

    headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, targetRotY, 0.08);
    headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, targetRotX, 0.08);
    headGroupRef.current.rotation.z = THREE.MathUtils.lerp(headGroupRef.current.rotation.z, targetRotZ, 0.08);

    // 3D Parallax translation
    headGroupRef.current.position.x = THREE.MathUtils.lerp(headGroupRef.current.position.x, x * 0.4, 0.08);
    headGroupRef.current.position.y = THREE.MathUtils.lerp(headGroupRef.current.position.y, y * 0.3, 0.08);

    // 2. Eye Iris/Pupil Tracking (Locked directly onto cursor pointer)
    const eyeOffsetX = x * 0.06;
    const eyeOffsetY = y * 0.05;

    if (leftEyeRef.current) {
      leftEyeRef.current.position.x = THREE.MathUtils.lerp(leftEyeRef.current.position.x, -0.22 + eyeOffsetX, 0.15);
      leftEyeRef.current.position.y = THREE.MathUtils.lerp(leftEyeRef.current.position.y, 0.85 + eyeOffsetY, 0.15);
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.position.x = THREE.MathUtils.lerp(rightEyeRef.current.position.x, 0.22 + eyeOffsetX, 0.15);
      rightEyeRef.current.position.y = THREE.MathUtils.lerp(rightEyeRef.current.position.y, 0.85 + eyeOffsetY, 0.15);
    }
  });

  if (!texture) return null;

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.25}>
        <group ref={headGroupRef} position={[0, -0.2, 0]}>
          {/* Main 3D Head Mesh Plane */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[3.4, 4.4]} />
            <meshBasicMaterial
              map={texture}
              transparent={true}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Interactive Eye Tracking Specular Pupils */}
          <mesh ref={leftEyeRef} position={[-0.22, 0.85, 0.02]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color="#E6D5B8" opacity={0.85} transparent />
          </mesh>

          <mesh ref={rightEyeRef} position={[0.22, 0.85, 0.02]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color="#E6D5B8" opacity={0.85} transparent />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

export const InteractiveTacticalHead: React.FC<{ imageSrc: string }> = ({ imageSrc }) => {
  return (
    <div className="w-full h-full relative cursor-crosshair overflow-hidden">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 4.2]} fov={45} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 5, 4]} intensity={1.5} />
        <directionalLight position={[-4, -2, -2]} intensity={0.5} color="#E6D5B8" />

        <HeadAndEyesMesh imageSrc={imageSrc} />
      </Canvas>

      {/* Motion & Eye Tracking Indicator */}
      <div className="absolute bottom-4 right-4 bg-[#1C1A17]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E6D5B8]/30 font-mono-tech text-[10px] text-[#E6D5B8] flex items-center gap-2 pointer-events-none shadow-[0_0_15px_rgba(230,213,184,0.15)]">
        <span className="w-2 h-2 rounded-full bg-[#E6D5B8] animate-ping" />
        <span>3D CURSOR INTERACTION</span>
      </div>
    </div>
  );
};
