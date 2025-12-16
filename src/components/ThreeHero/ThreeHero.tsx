'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Text, Html, ContactShadows, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import styles from './ThreeHero.module.scss';
import { motion } from 'framer-motion';

function MountainRidge({ 
    z, 
    color, 
    width, 
    yOffset, 
    speed, 
    scale 
}: { 
    z: number; 
    color: string; 
    width: number; 
    yOffset: number; 
    speed: number; 
    scale: number; 
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Create a curve based on sine waves (guaranteed to generate valid points)
    const curve = useMemo(() => {
        const points = [];
        const segments = 100;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = (t - 0.5) * width; // Center x around 0
            
            // Simulating jagged peaks with high-frequency sines
            // Base arch
            let y = Math.sin(t * Math.PI) * 2; 
            // "Noise" details
            y += Math.sin(x * 0.5 * scale) * 2;
            y += Math.abs(Math.sin(x * 1.5 * scale)) * 1.5; // Abs adds sharpness (ridges)
            y += Math.sin(x * 3.0 * scale) * 0.5;

            points.push(new THREE.Vector3(x, y + yOffset, z));
        }
        return new THREE.CatmullRomCurve3(points);
    }, [z, width, yOffset, scale]);

    return (
        <mesh ref={meshRef} position={[0, -5, 0]}>
            <tubeGeometry args={[curve, 200, 0.2, 8, false]} /> {/* tube radius 0.2 ensures visibility */}
            <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
    );
}

const GradientShader = {
    uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColor1: { value: new THREE.Color('#4facfe') }, // Vibrant Sky Blue
        uColor2: { value: new THREE.Color('#00f2fe') }, // Electric Cyan
        uColor3: { value: new THREE.Color('#fa709a') }, // Vibrant Pink
        uColor4: { value: new THREE.Color('#fee140') }, // Warm Yellow/Gold
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }, // Normalized mouse position
        uStrength: { value: 0 }, // Press strength (0 to 1)
        uResolution: { value: new THREE.Vector2(1, 1) }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        uniform vec2 uMouse;
        uniform float uStrength;
        uniform vec2 uResolution;
        varying vec2 vUv;

        // Gradient Noise Implementation
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
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

        // Helper to get pattern for a specific UV
        vec3 getPattern(vec2 p, float time, float scroll) {
            float n1 = snoise(p + vec2(time * 0.5, time * 0.5 - scroll));
            vec2 q = vec2(n1, n1 + time * 0.2);

            float n2 = snoise(p + q * 3.0 + vec2(time, time - scroll));
            vec2 r = vec2(n2, n2);

            float n3 = snoise(p + r * 5.0 + vec2(0.0, time * 1.2));

            vec3 c = mix(uColor1, uColor2, smoothstep(-0.5, 0.5, n1 + n2));
            c = mix(c, uColor3, smoothstep(-0.5, 0.5, n2 + n3));
            c = mix(c, uColor4, n3 * n3);

            // Add gloss
            float shine = smoothstep(0.4, 0.6, n3 * n2 + q.x * 0.2);
            c += vec3(shine * 0.3);

            return c;
        }

        void main() {
            vec2 uv = vUv;
            float time = uTime * 0.2;
            float scroll = uScroll * 0.0005;

            // --- Interaction Physics ---
            float aspect = uResolution.x / uResolution.y;
            vec2 aspectUV = vec2(uv.x * aspect, uv.y);
            vec2 aspectMouse = vec2(uMouse.x * aspect, uMouse.y);
            vec2 toMouse = aspectUV - aspectMouse;
            float dist = length(toMouse);

            // "Lens" Influence
            // Smooth, broad falloff
            float influence = exp(-dist * 1.5) * uStrength; // Significantly wider radius (was 3.0)
            vec2 lensDir = normalize(toMouse);
            
            // Chromatic Aberration Amount
            // We distort R, G, B channels by slightly different amounts
            vec2 distortR = lensDir * influence * 0.03;
            vec2 distortG = lensDir * influence * 0.015;
            vec2 distortB = lensDir * influence * 0.005;
            
            // Base UV
            vec2 p = uv * 1.5;
            
            // Fetch Separated Channels
            // Looking up the pattern at shifted coordinates
            vec3 colorR = getPattern(p - distortR, time, scroll);
            vec3 colorG = getPattern(p - distortG, time, scroll);
            vec3 colorB = getPattern(p - distortB, time, scroll);
            
            // Recombine
            vec3 finalColor = vec3(colorR.r, colorG.g, colorB.b);
            
            // Boost brightness in interaction zone (light focusing)
            finalColor += vec3(influence * 0.1);

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
};

function GradientPlane() {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { viewport, size } = useThree();

    // Interaction State
    const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
    const targetStrength = useRef(0);
    const currentStrength = useRef(0);

    useFrame((state) => {
        if (materialRef.current) {
            // Update Uniforms
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
            materialRef.current.uniforms.uScroll.value = window.scrollY;
            materialRef.current.uniforms.uResolution.value.set(size.width, size.height);

            // Smooth Interpolation for fluidity
            currentStrength.current = THREE.MathUtils.lerp(currentStrength.current, targetStrength.current, 0.1);
            materialRef.current.uniforms.uStrength.value = currentStrength.current;

            // Smooth Mouse Follow
            materialRef.current.uniforms.uMouse.value.lerp(mouseRef.current, 0.1);
        }
    });

    const handlePointerMove = (e: any) => {
        if (e.uv) {
            mouseRef.current.set(e.uv.x, e.uv.y);
            targetStrength.current = 1.0;
        }
    };

    const handlePointerLeave = () => {
        targetStrength.current = 0;
    };

    return (
        <mesh
            ref={meshRef}
            scale={[viewport.width, viewport.height, 1]}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={materialRef}
                args={[GradientShader]}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

import { useThreeOptimization } from '@/hooks/useThreeOptimization';

export default function ThreeHero() {
    const containerRef = useRef<HTMLElement>(null);
    const frameloop = useThreeOptimization(containerRef as React.RefObject<HTMLElement>);

    return (
        <section className={styles.container} ref={containerRef}>
            <div className={styles.canvasContainer}>
                <Canvas camera={{ position: [0, 0, 1], fov: 75 }} resize={{ scroll: false }} frameloop={frameloop}> 
                    <GradientPlane />
                </Canvas>
            </div>
            
            <div className={styles.overlay}>
                 <motion.h1 
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Yu Hang Ang
                </motion.h1>
                <motion.p 
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Developer & Creator
                </motion.p>
            </div>

            <div className={styles.scrollIndicator}>
                Scroll to explore
            </div>
        </section>
    );
}
