"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Hook to detect screen size and calculate dynamic font settings
function useResponsiveSettings() {
  const [settings, setSettings] = useState({
    fontSize: 1.2,
    maxWidth: 12,
    zoom: 50,
  });

  useEffect(() => {
    const updateSettings = () => {
      const width = window.innerWidth;

      // Dynamic Calculation:
      // Base Font Size: width / 1000 (approx)
      // Clamped between min and max values for usability

      let newFontSize = width / 1100;
      if (newFontSize < 0.6) newFontSize = 0.6; // Min font size
      if (newFontSize > 1.6) newFontSize = 1.6; // Max font size

      // Zoom: Inverse relationship?
      // Actually standard zoom 50 is fine usually, let's just tune maxWidth

      // Max Width: Percentage of screen width in ThreeJS units (~20 units is full width at zoom 50)
      let newMaxWidth = (width / 1600) * 16;
      if (newMaxWidth < 6) newMaxWidth = 6;
      if (newMaxWidth > 14) newMaxWidth = 14;

      setSettings({
        fontSize: newFontSize,
        maxWidth: newMaxWidth,
        zoom: 50, // Constant zoom usually stable
      });
    };

    updateSettings();
    window.addEventListener("resize", updateSettings);
    return () => window.removeEventListener("resize", updateSettings);
  }, []);

  return settings;
}

// Shader definition
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  // Simple noise function
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x); 
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;

    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));

    return dot(n, vec3(70.0));
  }

  void main() {
    // Water ripple effect using multiple sine waves and noise
    vec2 uv = vUv * 2.0;
    
    // Animate coordinates
    float time = uTime * 0.5;
    
    // Create wave patterns
    float wave1 = sin(uv.x * 5.0 + time + noise(uv * 2.0 + time)) * 0.5;
    float wave2 = sin(uv.y * 3.0 - time * 0.8 + noise(uv * 3.0 - time)) * 0.5;
    float wave3 = sin((uv.x + uv.y) * 4.0 + time * 1.2) * 0.3;
    
    float combinedWaves = wave1 + wave2 + wave3;
    
    // Color mapping based on wave height
    // Color mapping based on wave height
    // Reduced saturation - more metallic/greyish silver
    vec3 deepSilver = vec3(0.5, 0.5, 0.55);
    vec3 midSilver = vec3(0.7, 0.7, 0.75);
    vec3 lightSilver = vec3(0.9, 0.9, 0.95);
    vec3 highlight = vec3(1.0, 1.0, 1.0);
    
    vec3 color = mix(deepSilver, midSilver, smoothstep(-1.0, 0.0, combinedWaves));
    color = mix(color, lightSilver, smoothstep(0.0, 0.8, combinedWaves));
    color = mix(color, highlight, smoothstep(0.8, 1.2, combinedWaves));
    
    // Add some noise texture for foam/detail
    float grain = noise(uv * 10.0 + time * 2.0) * 0.1;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function WaveText({
  text,
  fontSize,
  maxWidth,
}: {
  text: string;
  fontSize: number;
  maxWidth: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  return (
    <Text
      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZs.woff"
      fontSize={fontSize}
      maxWidth={maxWidth}
      lineHeight={1.2}
      letterSpacing={0.02}
      anchorX="center"
      anchorY="middle"
      fontWeight="bold"
    >
      {text}
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </Text>
  );
}

export default function WaterWaveText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const { fontSize, maxWidth, zoom } = useResponsiveSettings();

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        style={{ pointerEvents: "none" }}
        orthographic
        camera={{
          zoom: zoom,
          position: [0, 0, 100],
          near: 0.1,
          far: 1000,
        }}
      >
        <WaveText text={text} fontSize={fontSize} maxWidth={maxWidth} />
      </Canvas>
    </div>
  );
}
