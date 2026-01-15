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
      // DNA PALETTE: Split Rungs (Red/Teal) + Blue Backbone
      if (strandIndex < 2) {
        targetColor.set("#4facfe"); // Deep Blue Backbone
      } else if (strandIndex < 7) {
        targetColor.set("#ff4444"); // Left Rungs (Red)
      } else {
        targetColor.set("#ff4444"); // Right Rungs (Red) - All rungs red as requested
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
          // DNA DOUBLE HELIX + CONNECTED RUNGS
          const helixRadius = 1.8;
          const twistFreq = 0.4; // Tighter twist
          const dnaSpeed = time * 0.4;

          // Calculate helix positions for this segment t
          // Strand A
          const angleA = x * twistFreq + dnaSpeed;
          const yA = Math.sin(angleA) * helixRadius;
          const zA = Math.cos(angleA) * helixRadius;

          // Strand B (180 deg offset)
          const angleB = angleA + Math.PI;
          const yB = Math.sin(angleB) * helixRadius;
          const zB = Math.cos(angleB) * helixRadius;

          // BACKBONES (Strands 0 & 1)
          if (strandIndex < 2) {
            if (strandIndex === 0) {
              y = yA;
              z = zA;
            } else {
              y = yB;
              z = zB;
            }
            // Add slight organic movement
            y += Math.sin(x + time) * 0.1;
          }
          // RUNG STRANDS (2..11)
          else {
            // Distribute 10 rung strands along the helix.
            // We want them to form distinct "bridges" between A and B.
            // Each strandIndex can represent a "bridge position" along the wave?
            // No, we want them to draw the LINES connecting A and B.

            // To make a solid rung, we can interpolate between Position A and Position B
            // at a specific X.
            // Since we are drawing a tube along X, we can't make vertical rungs easily with one tube
            // unless the tube ITSELF goes across.
            // BUT, our loop iterates 'x'. This draws lines parallel to X-axis roughly.

            // TRICK: making horizontal rungs with longitudinal tubes?
            // VISUAL ILLUSION:
            // We want short segments connecting A and B.
            // If we use the strands to be "floating segments" that align with the normal?

            // ALTERNATIVE:
            // Use the strands as "floating genes" that orbit in the middle.
            // OR use them as "secondary helices" that are tighter?

            // "fix the DNA" usually means "make it look like a ladder".
            // Since we are drawing continuous lines (NeuroStrand is a tube), we cannot draw discrete rungs easily
            // unless we zigzag the tube back and forth between A and B? That looks messy.

            // BETTER VISUAL:
            // Make strands 2-6 follow Helix A but slightly offset (thickening A)
            // Make strands 7-11 follow Helix B but slightly offset (thickening B)
            // AND periodically "reach out".

            // LET'S TRY:
            // Draw strands that spiral IN BETWEEN A and B.
            // Like a 3rd and 4th helix that are tighter?

            // User wants "DNA". The classic look is the ladder.
            // Let's approximate rungs by having these strands oscilate RAPIDLY between A and B?
            // No, that looks like noise.

            // Let's use them to form a "Ghost Cylinder" in the middle,
            // representing the base pairs.
            // 10 strands clustered in the center, rotating?
            // Distribute them radially inside the helix?

            // Let's do INTERPOLATION based on X.
            // At specific X intervals (the rungs), bring opacity to 1?
            // We can't change opacity per vertex only per mesh.

            // REFINED APPROACH:
            // Make the inner strands travel closer to the center line (radius 0),
            // but modulated to look like "bases" pairing up.

            // Let's stick to the previous "partial rung" idea but improve it.
            // Have them originate from Helix A or B and extend inwards.

            const isLeft = strandIndex < 7; // attached to A

            const sourceY = isLeft ? yA : yB;
            const sourceZ = isLeft ? zA : zB;

            const targetY = isLeft ? yB : yA;
            const targetZ = isLeft ? zB : zA;

            // Animate them reaching out
            // Use a square wave or sharp sine to strictly define "Rung exist here".
            const rungFreq = 2.0; // Fewer, clearer rungs
            const rungPhase = x * rungFreq;

            // Rung width check
            const rungCheck = Math.sin(rungPhase);

            if (rungCheck > 0.8) {
              // Rung Zone! Connect fully!
              // But we are drawing a continuous line.
              // It will lock into a rung shape.
              // Lerp fully to center?
              y = (sourceY + targetY) * 0.5;
              z = (sourceZ + targetZ) * 0.5;
              // "small line is vibrating" -> replaced Random with deterministic noise
              // Use sine waves based on X and Time to creates organic "glitch" without frame-by-frame chaos
              const noise =
                Math.sin(x * 23.0 + time * 5.0) * Math.cos(x * 17.0);
              y += noise * 0.15;
            } else {
              // Hide inside the backbone
              y = sourceY * 0.9;
              z = sourceZ * 0.9;
            }
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

          const vDir = new THREE.Vector3(dirX, dirY, dirZ).normalize();
          const tempUp = new THREE.Vector3(0, 1, 0);
          if (Math.abs(dirY) > 0.9) tempUp.set(1, 0, 0);
          const vUp = tempUp;
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
