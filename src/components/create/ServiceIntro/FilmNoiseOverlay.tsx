"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Film grain shader that mimics dusty old film look
const FilmGrainShader = {
  uniforms: {
    uTime: { value: 0 },
    uIntensity: { value: 0.4 },
    uDustAmount: { value: 0.15 },
    uScratchAmount: { value: 0.1 },
    uLightLeakIntensity: { value: 0.3 },
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
    uniform float uIntensity;
    uniform float uDustAmount;
    uniform float uScratchAmount;
    uniform float uLightLeakIntensity;
    
    varying vec2 vUv;
    
    // Hash functions for randomness
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    float hash2(vec2 p) {
      return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453123);
    }
    
    // 2D noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    // Film grain - fine random dots
    float filmGrain(vec2 uv, float time) {
      vec2 grainUv = uv * 500.0 + time * 10.0;
      return hash(floor(grainUv)) * uIntensity;
    }
    
    // Dust particles - larger random spots
    float dustParticles(vec2 uv, float time) {
      float dust = 0.0;
      
      // Multiple layers of dust at different scales
      for (float i = 0.0; i < 3.0; i++) {
        vec2 dustUv = uv * (50.0 + i * 30.0) + vec2(time * 0.5, time * 0.3) * (i + 1.0);
        float d = hash(floor(dustUv));
        
        // Only show occasional bright dust specks
        if (d > 0.97 - uDustAmount * 0.1) {
          vec2 center = fract(dustUv);
          float dist = length(center - 0.5);
          dust += smoothstep(0.1 + i * 0.05, 0.0, dist) * (1.0 - i * 0.2);
        }
      }
      
      return dust;
    }
    
    // Scratches - thin vertical/diagonal lines
    float scratches(vec2 uv, float time) {
      float scratch = 0.0;
      
      // Vertical scratches
      float scratchX = hash(vec2(floor(uv.x * 100.0), floor(time * 2.0)));
      if (scratchX > 0.98 - uScratchAmount * 0.05) {
        float width = hash2(vec2(floor(uv.x * 100.0), 0.0)) * 0.002 + 0.001;
        float xPos = fract(uv.x * 100.0);
        scratch += smoothstep(width, 0.0, abs(xPos - 0.5)) * 0.5;
      }
      
      return scratch;
    }
    
    // Light leak - warm glow from edge
    vec3 lightLeak(vec2 uv) {
      // Left side warm light leak
      float leak = smoothstep(0.4, 0.0, uv.x);
      leak *= smoothstep(1.0, 0.3, uv.y) * smoothstep(0.0, 0.3, uv.y);
      leak = pow(leak, 1.5);
      
      vec3 warmColor = vec3(1.0, 0.6, 0.2); // Orange/amber
      return warmColor * leak * uLightLeakIntensity;
    }
    
    void main() {
      float time = uTime;
      
      // Film grain base
      float grain = filmGrain(vUv, time);
      
      // Dust particles
      float dust = dustParticles(vUv, time);
      
      // Scratches
      float scratch = scratches(vUv, time);
      
      // Combine grain effects (white specks)
      float combined = grain * 0.3 + dust + scratch * 0.5;
      
      // Light leak color
      vec3 leak = lightLeak(vUv);
      
      // Final color: white grain/dust with warm light leak
      vec3 color = vec3(combined) + leak;
      
      // Alpha based on grain intensity
      float alpha = combined * 0.8 + length(leak) * 0.5;
      
      gl_FragColor = vec4(color, alpha);
    }
  `,
};

function NoiseQuad() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0.4 },
      uDustAmount: { value: 0.15 },
      uScratchAmount: { value: 0.1 },
      uLightLeakIntensity: { value: 0.25 },
    }),
    [],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={FilmGrainShader.vertexShader}
        fragmentShader={FilmGrainShader.fragmentShader}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

interface FilmNoiseOverlayProps {
  className?: string;
}

export default function FilmNoiseOverlay({ className }: FilmNoiseOverlayProps) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1], near: 0.1, far: 10 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: false }}
      >
        <NoiseQuad />
      </Canvas>
    </div>
  );
}
