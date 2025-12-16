import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * 0.5 + uTime * 0.2) * 0.2
                    + sin(modelPosition.y * 0.3 + uTime * 0.1) * 0.2;

    modelPosition.y += elevation;
    modelPosition.z += sin(modelPosition.x * 1.0 + uTime * 0.3) * 0.1;

    vElevation = elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uOpacity;
  
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    float mixStrength = (vElevation + 0.4) * 1.5;
    
    vec3 color = mix(uColor1, uColor2, vUv.x);
    color = mix(color, uColor3, vUv.y);
    color = mix(color, uColor4, smoothstep(0.0, 1.0, mixStrength));

    gl_FragColor = vec4(color, uOpacity);
  }
`;

interface GradientMeshProps {
  colors?: [string, string, string, string];
  opacity?: number;
}

export default function GradientMesh({ 
  colors = ['#4a1d96', '#ff00cc', '#ff9900', '#00ccff'], 
  opacity = 1.0 
}: GradientMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(colors[0]) },
      uColor2: { value: new THREE.Color(colors[1]) },
      uColor3: { value: new THREE.Color(colors[2]) },
      uColor4: { value: new THREE.Color(colors[3]) },
      uOpacity: { value: opacity },
    }),
    [colors, opacity]
  );

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} scale={1.5}>
      <planeGeometry args={[10, 10, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent={true}
      />
    </mesh>
  );
}
