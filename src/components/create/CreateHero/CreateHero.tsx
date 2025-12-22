'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import styles from './CreateHero.module.scss';
import { useThreeOptimization } from '@/hooks/useThreeOptimization';

// --- SHADER DEFINITION ---
const ParticleFlowShader = {
    uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) } // Normalized 0..1
    },
    vertexShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;

        varying vec3 vColor;
        varying float vAlpha;
        
        attribute vec3 aColor;      // Instance color
        attribute float aSpeed;     // Speed multiplier
        attribute float aOffset;    // Time offset (0..1)
        attribute vec3 aRandom;     // Random vector for curve variation
        attribute float aRiverID;   // 0.0 for Gombak, 1.0 for Klang
        attribute vec3 aScale;      // Instance scale (x=length, y=width)

        // Cubic Bezier Curve
        vec3 bezier(vec3 p0, vec3 p1, vec3 p2, vec3 p3, float t) {
            float oneMinusT = 1.0 - t;
            return oneMinusT * oneMinusT * oneMinusT * p0 +
                   3.0 * oneMinusT * oneMinusT * t * p1 +
                   3.0 * oneMinusT * t * t * p2 +
                   t * t * t * p3;
        }

        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

        float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m;
            m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            // 1. Calculate Instance Progress
            // tInstance is the normalized progress (0 to 1) of the center of the particle
            float tInstance = fract(uTime * aSpeed + aOffset);
            
            // 2. Define River Paths
            vec3 p0, p1, p2, p3;
            float spread = 0.3; 
            
            // Align exit height for horizontal flow
            float exitY = 0.1 + aRandom.y * 0.4;

            if (aRiverID < 0.5) {
                // Gombak (Top Left)
                p0 = vec3(-2.2, 2.0, 0.0);
                p1 = vec3(-0.5 + aRandom.x * spread, 0.1 + aRandom.y * spread, 0.0);
                p2 = vec3(1.0 + aRandom.z * spread, exitY, 0.0); 
                p3 = vec3(2.5, exitY, 0.0);
            } else {
                // Klang (Bottom Left)
                p0 = vec3(-2.2, -2.0, 0.0);
                p1 = vec3(-0.5 + aRandom.x * spread, -0.1 + aRandom.y * spread, 0.0);
                p2 = vec3(1.0 + aRandom.z * spread, exitY, 0.0);
                p3 = vec3(2.5, exitY, 0.0);
            }

            // 3. CURVED GEOMETRY DEFORMATION
            // We deform the mesh along the curve.
            // position.x ranges from -width/2 to +width/2 (local space)
            // We map this local X to a time offset along the Bezier curve.
            
            // Scale factor determines how "long" the particle is on the curve
            float tOffset = position.x * aScale.x * 0.2; 
            float tVertex = tInstance + tOffset;
            
            // Calculate bezier position for THIS vertex
            vec3 centerPos = bezier(p0, p1, p2, p3, tVertex);
            
            // Calculate tangent for orientation at this vertex
            // Look slightly ahead to get direction
            vec3 nextPos = bezier(p0, p1, p2, p3, tVertex + 0.01);
            vec3 dir = normalize(nextPos - centerPos);
            
            // Calculate "Right" vector for width expansion
            // In 2D plane (XY), perpendicular is (-y, x)
            vec3 right = vec3(-dir.y, dir.x, 0.0);

            // 4. Apply Width Expansion
            // Expand vertex perpendicular to the curve
            // position.y is the width coordinate
            vec3 finalPos = centerPos + right * position.y * aScale.y;

            // 5. Subtle Organic Turbulence
            float noiseScale = 1.0;
            float noiseSpeed = 0.2;
            float turbulence = 0.03;
            
            float n1 = snoise(finalPos.xy * noiseScale - uTime * noiseSpeed);
            finalPos.y += n1 * turbulence; 

            // 6. Interaction Distortion (Mouse push)
            // Simple radial push
            // vec2 screenPos = finalPos.xy;
            // float distToMouse = distance(screenPos.xy, vec2(uMouse.x * 2.0 - 1.0, uMouse.y * 2.0 - 1.0)); 
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
            
            // 7. Color Blending
            // Mix towards average color at the end
            vec3 targetColor = vec3(0.875, 0.78, 0.62); // Beige
            float mixFactor = smoothstep(0.6, 0.95, tVertex);
            vColor = mix(aColor, targetColor, mixFactor);
            
            // 8. Alpha Fade
            vAlpha = smoothstep(0.0, 0.15, tInstance) * smoothstep(1.0, 0.85, tInstance);
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
            vec3 col = vColor;
            col *= 1.2; // slight brightness boost
            gl_FragColor = vec4(col, vAlpha);
        }
    `
};

function InstancedParticles() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size } = useThree();
    
    // Config
    const COUNT = 1600;
    
    // Generate Instance Data
    const attributes = useMemo(() => {
        const colorArray = new Float32Array(COUNT * 3);
        const speedArray = new Float32Array(COUNT);
        const offsetArray = new Float32Array(COUNT);
        const randomArray = new Float32Array(COUNT * 3);
        const scaleArray = new Float32Array(COUNT * 3);
        const riverIDArray = new Float32Array(COUNT);
        
        const gombakColor = new THREE.Color('#F5E6D3'); // Cream
        const klangColor = new THREE.Color('#C9A86C');  // Gold
        
        for (let i = 0; i < COUNT; i++) {
            // River Choice
            const isGombak = i < COUNT / 2;
            riverIDArray[i] = isGombak ? 0.0 : 1.0;
            
            // Color
            const baseColor = isGombak ? gombakColor : klangColor;
            colorArray[i * 3 + 0] = baseColor.r + (Math.random() - 0.5) * 0.1;
            colorArray[i * 3 + 1] = baseColor.g + (Math.random() - 0.5) * 0.1;
            colorArray[i * 3 + 2] = baseColor.b + (Math.random() - 0.5) * 0.1;
            
            // Speed
            speedArray[i] = 0.03 + Math.random() * 0.08;
            
            // Offset
            offsetArray[i] = Math.random();
            
            // Random vector
            randomArray[i * 3 + 0] = (Math.random() - 0.5) * 2.0; 
            randomArray[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
            randomArray[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
            
            // Scale
            scaleArray[i * 3 + 0] = 0.5 + Math.random() * 2.5; // Length
            scaleArray[i * 3 + 1] = 0.5 + Math.random() * 0.8; // Width
            scaleArray[i * 3 + 2] = 1.0;
        }
        
        return {
            colors: colorArray,
            speeds: speedArray,
            offsets: offsetArray,
            randoms: randomArray,
            scales: scaleArray,
            riverIDs: riverIDArray
        };
    }, []);
    
    // Init Geometry
    useEffect(() => {
        if (meshRef.current) {
            const dummy = new THREE.Object3D();
            for (let i = 0; i < COUNT; i++) {
                dummy.position.set(0, 0, 0); 
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [attributes]);

    // Loop
    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
            materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
            {/* Segmented Plane for curving: width=0.3, height=0.005, widthSegments=16, heightSegments=1 */}
            <planeGeometry args={[0.3, 0.005, 16, 1]} /> 
            <shaderMaterial
                ref={materialRef}
                uniforms={ParticleFlowShader.uniforms}
                vertexShader={ParticleFlowShader.vertexShader}
                fragmentShader={ParticleFlowShader.fragmentShader}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
            
            <instancedBufferAttribute attach="geometry-attributes-aColor" args={[attributes.colors, 3]} />
            <instancedBufferAttribute attach="geometry-attributes-aSpeed" args={[attributes.speeds, 1]} />
            <instancedBufferAttribute attach="geometry-attributes-aOffset" args={[attributes.offsets, 1]} />
            <instancedBufferAttribute attach="geometry-attributes-aRandom" args={[attributes.randoms, 3]} />
            <instancedBufferAttribute attach="geometry-attributes-aScale" args={[attributes.scales, 3]} />
            <instancedBufferAttribute attach="geometry-attributes-aRiverID" args={[attributes.riverIDs, 1]} />
        </instancedMesh>
    );
}

// --- RIVER BED MESH ---
function RiverBed() {
    const { size } = useThree();
    
    const curves = useMemo(() => {
        // Match shader bezier points (average)
        // Gombak (Top Left)
        const gombakCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-2.2, 2.0, -0.1), // Slightly behind particles
            new THREE.Vector3(-0.5, 0.1, -0.1),
            new THREE.Vector3(1.0, 0.1, -0.1),
            new THREE.Vector3(2.5, 0.1, -0.1)
        );

        // Klang (Bottom Left)
        const klangCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-2.2, -2.0, -0.1),
            new THREE.Vector3(-0.5, -0.1, -0.1),
            new THREE.Vector3(1.0, 0.1, -0.1),
            new THREE.Vector3(2.5, 0.1, -0.1)
        );

        return [gombakCurve, klangCurve];
    }, []);

    return (
        <group>
            {curves.map((curve, i) => (
                <mesh key={i} position={[0,0,-0.05]} scale={[1, 1, 0.15]}> 
                    <tubeGeometry args={[curve, 64, 0.6, 8, false]} />
                    {/* "Half Transparent" Solid River Bed */}
                    <meshPhysicalMaterial 
                        color={i === 0 ? "#F5E6D3" : "#C9A86C"} 
                        transparent 
                        opacity={0.4} // Half-transparent-ish (0.4-0.5)
                        roughness={0.2}
                        metalness={0.1}
                        transmission={0.0} // Ensure it's not fully glass, just transparent
                        depthWrite={false} // Prevent z-fighting
                        side={THREE.DoubleSide}
                        // wireframe={false} // Removed to make it a "mesh/surface"
                    />
                </mesh>
            ))}
            
            {/* Overlay Wireframe for "Like a Mesh" texture */}
            {curves.map((curve, i) => (
                <mesh key={`grid-${i}`} position={[0,0,-0.04]} scale={[1, 1, 0.16]}> 
                     <tubeGeometry args={[curve, 64, 0.61, 8, false]} />
                     <meshBasicMaterial
                        color={i === 0 ? "#ffffff" : "#ffffff"}
                        transparent
                        opacity={0.1}
                        wireframe={true}
                        depthWrite={false}
                     />
                </mesh>
            ))}
        </group>
    );
}

// ... existing InstancedParticles ...

export default function CreateHero() {
    // Fixed ref type with assertion
    const containerRef = useRef<HTMLElement>(null!); 
    const frameloop = useThreeOptimization(containerRef);

    return (
        <section className={styles.container} ref={containerRef} aria-label="River Confluence Animation">
            <div className={styles.canvasContainer} aria-hidden="true" style={{ background: '#000000' }}>
                <Canvas camera={{ position: [0, 0, 2], fov: 60 }} frameloop={frameloop}>
                    <RiverBed />
                    <InstancedParticles />
                </Canvas>
            </div>
            
            <div className={styles.overlay}>
                <h1 className={styles.title}>Where Rivers Meet.<br/>Ideas Flow.</h1>
                <p className={styles.subtitle}>
                    Like the Klang and Gombak rivers that gave Kuala Lumpur its name, 
                    creativity flows from the confluence of technology, art, and vision. 
                    From this meeting point, new possibilities emerge.
                </p>
            </div>
        </section>
    );
}
