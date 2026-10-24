import { Component, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Box3,
  BufferGeometry,
  CatmullRomCurve3,
  Shape,
  Vector3,
} from "three";
import { useThemeColors } from "./ThemeBridge.jsx";

const MODEL_PATH = "/models/demon_slayer_kokushibo_sword.glb";

function ModelKatana({ cursor, reducedMotion }) {
  const { scene } = useGLTF(MODEL_PATH);
  const group = useRef(null);
  const glowRef = useRef(null);
  const theme = useThemeColors();
  const { size } = useThree();
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new Box3().setFromObject(clone);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    clone.position.sub(center);
    clone.rotation.x = Math.PI / 2;
    // Adjust MODEL_PATH and this target length to fit a replacement katana GLB.
    clone.scale.setScalar(2.8 / Math.max(size.x, size.y, size.z, 0.001));
    return clone;
  }, [scene]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const time = clock.elapsedTime;
    const portrait = size.width / size.height < 0.75;
    group.current.position.x = portrait ? 1.65 : 2.1;
    if (!reducedMotion) {
      group.current.position.y = 0.08 + Math.sin(time * 0.55) * 0.12;
      group.current.rotation.y += delta * 0.08;
      group.current.rotation.z +=
        ((-0.16 + cursor.current.y * -0.13) - group.current.rotation.z) *
        (1 - Math.exp(-delta * 2.5));
      group.current.rotation.x +=
        ((cursor.current.x * 0.11) - group.current.rotation.x) *
        (1 - Math.exp(-delta * 2.5));
    }
    if (glowRef.current) glowRef.current.color.lerp(theme.current.highlight, 0.035);
  });

  return (
    <group ref={group} position={[2.1, 0.05, 0]} rotation={[0.12, 0.28, -0.18]}>
      <primitive object={model} />
      <pointLight ref={glowRef} color="#BFE8FF" intensity={0.75} distance={3.5} position={[0.5, 0.1, 0.4]} />
    </group>
  );
}

function ProceduralKatana({ cursor, reducedMotion }) {
  const group = useRef(null);
  const bladeRef = useRef(null);
  const hamonRef = useRef(null);
  const theme = useThemeColors();
  const { size } = useThree();
  const bladeShape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.055, 0);
    shape.lineTo(0.055, 0);
    shape.bezierCurveTo(0.075, 0.65, 0.03, 1.7, 0.09, 2.45);
    shape.lineTo(-0.005, 2.4);
    shape.bezierCurveTo(-0.07, 1.65, -0.02, 0.55, -0.055, 0);
    shape.closePath();
    return shape;
  }, []);
  const bladeCurve = useMemo(
    () => new CatmullRomCurve3([
      new Vector3(-0.035, 0.02, 0),
      new Vector3(-0.02, 0.48, 0),
      new Vector3(0.018, 1.2, 0),
      new Vector3(0.075, 2.35, 0),
    ]),
    [],
  );
  const hamonPoints = useMemo(() => bladeCurve.getPoints(36), [bladeCurve]);
  const hamonGeometry = useMemo(
    () => new BufferGeometry().setFromPoints(hamonPoints),
    [hamonPoints],
  );

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const time = clock.elapsedTime;
    const portrait = size.width / size.height < 0.75;
    group.current.position.x = portrait ? 1.65 : 2.1;
    if (!reducedMotion) {
      group.current.position.y = 0.08 + Math.sin(time * 0.55) * 0.12;
      group.current.rotation.y += delta * 0.08;
      group.current.rotation.z +=
        ((-0.16 + cursor.current.y * -0.13) - group.current.rotation.z) *
        (1 - Math.exp(-delta * 2.5));
      group.current.rotation.x +=
        (cursor.current.x * 0.11 - group.current.rotation.x) *
        (1 - Math.exp(-delta * 2.5));
    }
    if (bladeRef.current) {
      bladeRef.current.material.color.lerp(theme.current.highlight, 0.025);
      bladeRef.current.material.emissive.lerp(theme.current.primary, 0.025);
    }
    if (hamonRef.current) {
      hamonRef.current.material.color.lerp(theme.current.highlight, 0.025);
    }
  });

  return (
    <group ref={group} position={[2.1, 0.05, 0]} rotation={[0.12, 0.28, -0.18]}>
      <mesh ref={bladeRef} position={[0, 0, -0.018]}>
        <extrudeGeometry
          args={[bladeShape, {
            depth: 0.036,
            bevelEnabled: true,
            bevelThickness: 0.008,
            bevelSize: 0.008,
            bevelSegments: 2,
            curveSegments: 12,
          }]}
        />
        <meshPhysicalMaterial
          color="#BFE8FF"
          metalness={0.92}
          roughness={0.16}
          clearcoat={0.8}
          emissive={theme.current.primary}
          emissiveIntensity={0.035}
        />
      </mesh>
      <mesh position={[0, -0.07, 0]}>
        <torusGeometry args={[0.2, 0.035, 8, 36]} />
        <meshStandardMaterial color="#A9C6D8" metalness={0.82} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.075, 0.055, 0.85, 12]} />
        <meshStandardMaterial color="#111A26" roughness={0.7} />
      </mesh>
      {Array.from({ length: 9 }, (_, index) => (
        <mesh key={index} position={[0, -0.9 + index * 0.085, 0.02]} rotation={[0, 0, index % 2 ? 0.65 : -0.65]}>
          <boxGeometry args={[0.13, 0.018, 0.035]} />
          <meshStandardMaterial color="#BFE8FF" roughness={0.48} />
        </mesh>
      ))}
      <mesh position={[0, -1.02, 0]}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshStandardMaterial color="#9B2638" metalness={0.55} roughness={0.35} />
      </mesh>
      <line ref={hamonRef} geometry={hamonGeometry} position={[0, 0, 0.025]}>
        <lineBasicMaterial color="#BFE8FF" />
      </line>
      <pointLight color={theme.current.highlight} intensity={0.7} distance={3.5} position={[0.3, 0.7, 0.45]} />
    </group>
  );
}

export default function Katana({ cursor, reducedMotion }) {
  return (
    <KatanaModelBoundary fallback={<ProceduralKatana cursor={cursor} reducedMotion={reducedMotion} />}>
      <ModelKatana cursor={cursor} reducedMotion={reducedMotion} />
    </KatanaModelBoundary>
  );
}

class KatanaModelBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("Katana GLB could not be loaded; rendering the procedural fallback.", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

useGLTF.preload(MODEL_PATH);
