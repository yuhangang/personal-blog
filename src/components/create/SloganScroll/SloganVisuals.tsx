import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';
import styles from './SloganVisuals.module.scss';
import { useThreeOptimization } from '@/hooks/useThreeOptimization';
import { SLOGAN_ITEMS, VisualParams } from './sloganConfig';

// Increased strand count to 12 for dense loom look
const STRAND_COUNT = 12;

function NeuroStrand({ activeIndex, strandIndex }: { activeIndex: number, strandIndex: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    
    // Current state (mutable for lerping)
    const currentParams = useRef<VisualParams>({ ...SLOGAN_ITEMS[0].visual });

    // Initial Curve
    const path = useMemo(() => {
        const points = [];
        for (let i = 0; i <= 50; i++) points.push(new THREE.Vector3(0,0,0));
        return new THREE.CatmullRomCurve3(points);
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current || !materialRef.current) return;

        const targetItem = SLOGAN_ITEMS[activeIndex % SLOGAN_ITEMS.length] || SLOGAN_ITEMS[0];
        const target = targetItem.visual;
        const type = target.type;
        
        // --- VISIBILITY & ACTIVITY LOGIC ---
        // Fluid: All 12 strands
        // Weave: All 12 strands (Dense Loom)
        // Pulse: 3 strands (Center + 2 Echoes)
        // Noise: 5 strands (Chaotic)
        // Structure: 1 strand (Solid)
        let isActive = true;
        if (type === 'structure' && strandIndex > 0) isActive = false;
        if (type === 'pulse' && strandIndex > 2) isActive = false;
        if (type === 'noise' && strandIndex > 4) isActive = false;
        
        const targetOpacity = isActive ? 1.0 : 0.0;
        
        // 1. Interpolate Params
        const lerpFactor = delta * 2.0; // Responsive speed
        
        currentParams.current.speed = THREE.MathUtils.lerp(currentParams.current.speed, target.speed, lerpFactor);
        currentParams.current.noiseScale = THREE.MathUtils.lerp(currentParams.current.noiseScale, target.noiseScale, lerpFactor);
        currentParams.current.amplitude = THREE.MathUtils.lerp(currentParams.current.amplitude, target.amplitude, lerpFactor);
        
        // Thickness Adjustments for Density
        let targetThickness = target.thickness;
        if (type === 'fluid') targetThickness *= 0.4; // Thinner for 12 lines
        if (type === 'weave') targetThickness *= 0.3; // Very thin threads for loom
        if (type === 'pulse' && strandIndex > 0) targetThickness *= 0.3; 
        
        currentParams.current.thickness = THREE.MathUtils.lerp(currentParams.current.thickness, targetThickness, lerpFactor);
        currentParams.current.distort = THREE.MathUtils.lerp(currentParams.current.distort, target.distort, lerpFactor);
        
        // Color & Palette Logic
        const targetColor = new THREE.Color(target.color);
        
        if (type === 'weave') {
             // Loom Palette: Orange, White, Gold alternating
             if (strandIndex % 3 === 0) targetColor.set('#ff6b00'); // Orange
             else if (strandIndex % 3 === 1) targetColor.set('#ffffff'); // White
             else targetColor.set('#fee140'); // Gold
        }
        else if (strandIndex > 0 && type !== 'structure') {
             // Dimmer outer strands for depth
             targetColor.offsetHSL(0, 0, -0.05 * strandIndex); 
        }
        
        materialRef.current.color.lerp(targetColor, lerpFactor);
        materialRef.current.emissive.lerp(targetColor, lerpFactor);
        
        // Fade in/out
        materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, lerpFactor);
        materialRef.current.transparent = true;

        // 2. Animate Curve Points
        const time = state.clock.getElapsedTime();
        const tOffset = time + (strandIndex * 0.2); // Offset time per strand
        
        const { speed, noiseScale, amplitude, distort, thickness } = currentParams.current;

        const points: THREE.Vector3[] = [];
        const width = 20; 
        const segments = 100;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = (t - 0.5) * width;
            
            let y = 0;
            let z = 0;

            switch (type) {
                case 'fluid': 
                     // Parallel ripples
                     const fluidPhase = strandIndex * 0.3;
                     y = Math.sin(t * Math.PI * 1.5 + tOffset * speed + fluidPhase) * amplitude;
                     z = Math.cos(t * Math.PI * 2 + tOffset * speed * 0.5 + fluidPhase) * 2;
                     z += (strandIndex - (STRAND_COUNT/2)) * 0.8; // Spread Z
                     break;

                case 'weave': 
                     // LOOM CROSS-HATCH
                     // Alternating direction for even/odd strands
                     const dir = (strandIndex % 2 === 0) ? 1 : -1;
                     
                     // Tight, high-frequency weave
                     y = Math.sin((x * noiseScale * 5) + (time * speed)) * amplitude * dir;
                     z = Math.cos((x * noiseScale * 5) + (time * speed)) * 0.3 * dir;
                     
                     // Vertical stacking (Y) to look like a wall of threads? 
                     // Or Z stacking? Let's stack in Y slightly to fill volume.
                     const stackY = (strandIndex - (STRAND_COUNT/2)) * 0.3;
                     y += stackY;
                     
                     // Slight Z spread
                     z += (strandIndex % 3 - 1) * 0.2; 
                     break;

                case 'pulse': 
                     let pulseAmp = amplitude;
                     let pulseBeat = Math.pow(Math.sin(time * 3), 10);
                     if (strandIndex > 0) {
                         const lag = strandIndex * 0.2;
                         pulseBeat = Math.pow(Math.sin((time - lag) * 3), 10);
                         pulseAmp *= 1.5; 
                     }
                     y = Math.sin(t * Math.PI * 3 + time * speed) * pulseAmp;
                     y *= (0.8 + pulseBeat * 0.5); 
                     z = pulseBeat * 2 * (strandIndex + 1); 
                     break;

                case 'noise': 
                     const seed = strandIndex * 137; 
                     y = Math.sin(x * 10 + tOffset * speed) * amplitude;
                     y += Math.sin(x * 37 + seed) * distort; 
                     z = Math.cos(x * 15 + time + seed) * distort;
                     z += (strandIndex - 2) * 1.5;
                     break;

                case 'structure': 
                     y = 0;
                     z = Math.sin(time * 0.2) * 1; 
                     break;
                     
                default: 
                     y = Math.sin(t * Math.PI + time * speed) * amplitude;
            }

            if (type !== 'structure' && type !== 'noise' && type !== 'weave') {
                 y += Math.sin(x * noiseScale + time) * (0.2 * distort);
            }

            points.push(new THREE.Vector3(x, y, z));
        }
        
        path.points = points;
        
        // UPDATE GEOMETRY
        if (meshRef.current.geometry) meshRef.current.geometry.dispose();
        
        meshRef.current.geometry = new THREE.TubeGeometry(
            path, 
            segments, 
            thickness * (isActive ? 1 : 0.01), 
            type === 'structure' ? 4 : 8, 
            false
        );
        
        // Visibility toggle
        if (!isActive && materialRef.current.opacity < 0.01) meshRef.current.visible = false;
        else meshRef.current.visible = true;
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <meshStandardMaterial 
                ref={materialRef} 
                roughness={0.2} 
                metalness={0.9} 
                emissiveIntensity={0.6}
            />
        </mesh>
    );
}

export default function SloganVisuals({ activeIndex }: { activeIndex: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameloop = useThreeOptimization(containerRef as React.RefObject<HTMLElement>);

    return (
        <div className={styles.container} ref={containerRef}>
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }} frameloop={frameloop}>
                <Environment preset="city" /> 
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -5, -5]} intensity={0.5} color="#4facfe" />
                
                {Array.from({ length: STRAND_COUNT }).map((_, i) => (
                    <NeuroStrand key={i} activeIndex={activeIndex} strandIndex={i} />
                ))}
            </Canvas>
        </div>
    );
}
