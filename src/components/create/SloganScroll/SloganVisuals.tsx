import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Environment } from "@react-three/drei";
import styles from "./SloganVisuals.module.scss";
import { useThreeOptimization } from "@/hooks/useThreeOptimization";
import { SLOGAN_ITEMS, VisualParams } from "./sloganConfig";

// Increased strand count to 12 for dense loom look
const STRAND_COUNT = 12;

function NeuroStrand({
  activeIndex,
  strandIndex,
}: {
  activeIndex: number;
  strandIndex: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Current state (mutable for lerping)
  const currentParams = useRef<VisualParams>({ ...SLOGAN_ITEMS[0].visual });

  // Initial Curve
  // We create a new instance every render (overhead) but useRef ignores it after mount.
  // This avoids "accessing ref during render" linter errors.
  const pathRef = useRef(
    new THREE.CatmullRomCurve3(
      Array.from({ length: 51 }, () => new THREE.Vector3(0, 0, 0))
    )
  );

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current || !pathRef.current) return;

    const targetItem =
      SLOGAN_ITEMS[activeIndex % SLOGAN_ITEMS.length] || SLOGAN_ITEMS[0];
    const target = targetItem.visual;
    const type = target.type;

    // --- VISIBILITY & ACTIVITY LOGIC ---
    // Fluid: All 12 strands
    // Weave: All 12 strands (Dense Loom)
    // Pulse: 3 strands (Center + 2 Echoes)
    // Noise: 5 strands (Chaotic)
    // Structure: 1 strand (Solid)
    let isActive = true;
    if (type === "structure") isActive = true; // Use all strands for the lattice
    if (type === "dna") isActive = true; // Use all strands for DNA
    if (type === "pulse" && strandIndex > 2) isActive = false;
    if (type === "noise" && strandIndex > 4) isActive = false;

    const targetOpacity = isActive ? 1.0 : 0.0;

    // 1. Interpolate Params
    // Fix for glitch on resume: Clamp delta to avoid large jumps
    const safeDelta = Math.min(delta, 0.1);
    const lerpFactor = safeDelta * 4.0; // Responsive speed

    currentParams.current.speed = THREE.MathUtils.lerp(
      currentParams.current.speed,
      target.speed,
      lerpFactor
    );
    currentParams.current.noiseScale = THREE.MathUtils.lerp(
      currentParams.current.noiseScale,
      target.noiseScale,
      lerpFactor
    );
    currentParams.current.amplitude = THREE.MathUtils.lerp(
      currentParams.current.amplitude,
      target.amplitude,
      lerpFactor
    );

    // Thickness Adjustments for Density
    let targetThickness = target.thickness;
    if (type === "fluid") targetThickness *= 0.4; // Thinner for 12 lines
    if (type === "weave") targetThickness *= 0.3; // Very thin threads for loom
    if (type === "pulse" && strandIndex > 0) targetThickness *= 0.3;

    currentParams.current.thickness = THREE.MathUtils.lerp(
      currentParams.current.thickness,
      targetThickness,
      lerpFactor
    );
    currentParams.current.distort = THREE.MathUtils.lerp(
      currentParams.current.distort,
      target.distort,
      lerpFactor
    );

    // Color & Palette Logic
    const targetColor = new THREE.Color(target.color);

    if (type === "weave") {
      // Loom Palette: Orange, White, Gold alternating
      if (strandIndex % 3 === 0) targetColor.set("#ff6b00"); // Orange
      else if (strandIndex % 3 === 1) targetColor.set("#ffffff"); // White
      else targetColor.set("#fee140"); // Gold
    } else if (type === "structure") {
      // FOUNDATION PALETTE:
      if (strandIndex % 3 === 0) targetColor.set("#00f2fe"); // Cyan
      else if (strandIndex % 3 === 1) targetColor.set("#ffffff"); // White
      else targetColor.set("#4facfe"); // Deep Blue/Teal
    } else if (type === "dna") {
      // DNA PALETTE: Split Rungs (Red/Teal) + White Backbone
      if (strandIndex < 2) {
        targetColor.set("#FFFFFF"); // White Backbone
      } else if (strandIndex < 7) {
        targetColor.set("#FF6B6B"); // Left Rungs (Red)
      } else {
        targetColor.set("#4ECDC4"); // Right Rungs (Teal)
      }
    } else if (strandIndex > 0) {
      // Dimmer outer strands for depth
      targetColor.offsetHSL(0, 0, -0.05 * strandIndex);
    }

    materialRef.current.color.lerp(targetColor, lerpFactor);
    materialRef.current.emissive.lerp(targetColor, lerpFactor);

    // Fade in/out
    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity,
      targetOpacity,
      lerpFactor
    );
    materialRef.current.transparent = true;

    // 2. Animate Curve Points
    const time = state.clock.getElapsedTime();
    const tOffset = time + strandIndex * 0.2; // Offset time per strand

    const { speed, noiseScale, amplitude, distort, thickness } =
      currentParams.current;

    const points: THREE.Vector3[] = [];
    const width = 20;
    const segments = 100;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      let x = (t - 0.5) * width;

      let y = 0;
      let z = 0;

      switch (type) {
        case "fluid":
          // Parallel ripples
          const fluidPhase = strandIndex * 0.3;
          y =
            Math.sin(t * Math.PI * 1.5 + tOffset * speed + fluidPhase) *
            amplitude;
          z =
            Math.cos(t * Math.PI * 2 + tOffset * speed * 0.5 + fluidPhase) * 2;
          z += (strandIndex - STRAND_COUNT / 2) * 0.8; // Spread Z
          break;

        case "weave":
          // LOOM CROSS-HATCH
          // Alternating direction for even/odd strands
          const dir = strandIndex % 2 === 0 ? 1 : -1;

          // Tight, high-frequency weave
          y = Math.sin(x * noiseScale * 5 + time * speed) * amplitude * dir;
          z = Math.cos(x * noiseScale * 5 + time * speed) * 0.3 * dir;

          // Vertical stacking (Y) to look like a wall of threads?
          // Or Z stacking? Let's stack in Y slightly to fill volume.
          const stackY = (strandIndex - STRAND_COUNT / 2) * 0.3;
          y += stackY;

          // Slight Z spread
          z += ((strandIndex % 3) - 1) * 0.2;
          break;

        case "pulse":
          let pulseAmp = amplitude;
          let pulseBeat = Math.pow(Math.sin(time * 3), 10);
          if (strandIndex > 0) {
            const lag = strandIndex * 0.2;
            pulseBeat = Math.pow(Math.sin((time - lag) * 3), 10);
            pulseAmp *= 1.5;
          }
          y = Math.sin(t * Math.PI * 3 + time * speed) * pulseAmp;
          y *= 0.8 + pulseBeat * 0.5;
          z = pulseBeat * 2 * (strandIndex + 1);
          break;

        case "noise":
          const seed = strandIndex * 137;
          y = Math.sin(x * 10 + tOffset * speed) * amplitude;
          y += Math.sin(x * 37 + seed) * distort;
          z = Math.cos(x * 15 + time + seed) * distort;
          z += (strandIndex - 2) * 1.5;
          break;

        case "dna":
          // DNA DOUBLE HELIX + SPLIT RUNGS

          const helixRadius = 2.0;
          const twistFreq = 0.5;
          const dnaSpeed = time * 0.5;

          // BACKBONES (Strands 0 & 1)
          if (strandIndex < 2) {
            let phase = x * twistFreq + dnaSpeed;
            if (strandIndex === 1) phase += Math.PI; // Helix B

            y = Math.sin(phase) * helixRadius;
            z = Math.cos(phase) * helixRadius;

            y += Math.sin(x + time) * 0.1;
          }
          // RUNG STRANDS (2..11)
          else {
            // Calculate phases for Backbone A and B at this X
            const phaseA = x * twistFreq + dnaSpeed;
            const phaseB = phaseA + Math.PI;

            const ay = Math.sin(phaseA) * helixRadius;
            const az = Math.cos(phaseA) * helixRadius;

            const by = Math.sin(phaseB) * helixRadius;
            const bz = Math.cos(phaseB) * helixRadius;

            // Rung Logic:
            // 5 Pairs of Red/Teal strands.
            // Left Rungs (2-6): Red. Start at A, go to center.
            // Right Rungs (7-11): Teal. Start at B, go to center.

            const isLeft = strandIndex < 7;
            const pairIndex = (strandIndex - 2) % 5; // 0..4

            const rungFreq = 8.0;
            // Synchronize phases: Pair 0 (Left) and Pair 0 (Right) must have same phase offset
            const rungPhase = x * rungFreq + pairIndex * (Math.PI / 2.5);

            // Step Function
            // signal > 0.9 ? Extend : Retract
            const signal = Math.sin(rungPhase);

            // Smooth transition to 0.45 extension (meeting in middle-ish)
            let extension = 0;
            const threshold = 0.5;

            if (signal > threshold) {
              // Max extension is 0.45 (leaving 10% gap in middle)
              extension = 0.45;
            }

            // Smooth step for nicer visuals
            const k = 10.0;
            let smoothExt = 0.45 / (1 + Math.exp(-k * (signal - threshold)));

            // Interpolate
            // Left: A -> B (0 -> 1)
            // Right: B -> A (0 -> 1)

            if (isLeft) {
              // From A towards B
              y = THREE.MathUtils.lerp(ay, by, smoothExt);
              z = THREE.MathUtils.lerp(az, bz, smoothExt);
            } else {
              // From B towards A
              y = THREE.MathUtils.lerp(by, ay, smoothExt);
              z = THREE.MathUtils.lerp(bz, az, smoothExt);
            }

            y += Math.sin(x + time) * 0.1;
          }

          break;

        case "structure":
          // SPIRAL GALAXY BLOOM
          // Expand from center with helical motion.

          // 1. Calculate Main Direction (Spherical Distribution)
          const goldenRatio = (1 + Math.sqrt(5)) / 2;
          const z_dir = 1 - (2 * strandIndex) / (STRAND_COUNT - 1);
          const radius_dir = Math.sqrt(1 - z_dir * z_dir);
          const theta_dir = 2 * Math.PI * strandIndex * goldenRatio;

          const dirX = radius_dir * Math.cos(theta_dir);
          const dirY = radius_dir * Math.sin(theta_dir);
          const dirZ = z_dir;

          // 2. Compute Basis Vectors for Spiral (Perpendicular to Dir)
          const vDir = new THREE.Vector3(dirX, dirY, dirZ).normalize();
          let vUp = new THREE.Vector3(0, 1, 0);
          if (Math.abs(dirY) > 0.9) vUp.set(1, 0, 0);
          const vRight = new THREE.Vector3()
            .crossVectors(vDir, vUp)
            .normalize();
          const vTrueUp = new THREE.Vector3()
            .crossVectors(vRight, vDir)
            .normalize();

          // 3. Expansion Logic
          const pulse = (Math.sin(time * 0.5) + 1.0) * 0.5; // Slow pulse
          const currentR = 1.0 + pulse * 6.0;

          // 4. Build Points along the Helical Ray
          const dist = t * currentR;

          // Spiral factors
          const spiralFreq = 3.0; // Turns per unit distance?
          const spiralRad = dist * 0.25; // Cone shape (wider at ends)

          const angle = dist * spiralFreq + time * 2.0; // Rotate over time

          // Calculate Spiral Offset in Local Space (Right, TrueUp)
          const offU = Math.cos(angle) * spiralRad;
          const offV = Math.sin(angle) * spiralRad;

          // Combine: Origin + (Dist * Dir) + (OffsetU * Right) + (OffsetV * TrueUp)
          x = dirX * dist + vRight.x * offU + vTrueUp.x * offV;
          y = dirY * dist + vRight.y * offU + vTrueUp.y * offV;
          z = dirZ * dist + vRight.z * offU + vTrueUp.z * offV;

          break;

        default:
          y = Math.sin(t * Math.PI + time * speed) * amplitude;
      }

      if (type !== "structure" && type !== "noise" && type !== "weave") {
        y += Math.sin(x * noiseScale + time) * (0.2 * distort);
      }

      points.push(new THREE.Vector3(x, y, z));
    }

    pathRef.current.points = points;

    // UPDATE GEOMETRY
    if (meshRef.current.geometry) meshRef.current.geometry.dispose();

    // Custom rotations/thickness for structure
    let finalThickness = thickness * (isActive ? 1 : 0.01);

    // Customize thickness for lattice parts
    if (type === "structure") {
      finalThickness = 0.12; // Sleek lines
      if (!isActive) finalThickness = 0;
    }

    if (type === "dna") {
      // Backbone (0, 1) Thick White Ribbon
      if (strandIndex < 2) finalThickness = 0.5;
      // Rungs (2+) Thin
      else finalThickness = 0.15;
    }

    meshRef.current.geometry = new THREE.TubeGeometry(
      pathRef.current,
      segments,
      finalThickness,
      type === "structure" || type === "dna" ? 8 : 8, // Round profile for everything now
      false
    );

    // Rotate mesh
    if (type === "structure") {
      meshRef.current.rotation.x = time * 0.05;
      meshRef.current.rotation.z = 0;
    } else if (type === "dna") {
      meshRef.current.rotation.set(0, 0, 0); // DNA rotates via phase calculation in points
    } else {
      meshRef.current.rotation.set(0, 0, 0);
    }

    // Visibility toggle
    if (!isActive && materialRef.current.opacity < 0.01)
      meshRef.current.visible = false;
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

export default function SloganVisuals({
  activeIndex,
}: {
  activeIndex: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameloop = useThreeOptimization(
    containerRef as React.RefObject<HTMLElement>
  );

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
