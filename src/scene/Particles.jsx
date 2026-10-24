import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Vector3,
} from "three";
import { useFrame } from "@react-three/fiber";
import { useThemeColors } from "./ThemeBridge.jsx";

const particleVertexShader = `
  uniform float uSize;
  uniform float uTime;
  varying float vPulse;
  varying float vAngle;
  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * (260.0 / max(1.0, -viewPosition.z));
    vPulse = 0.74 + 0.26 * sin(uTime * 1.8 + position.x * 3.0 + position.y * 2.0);
    vAngle = uTime * 0.35 + position.x * 0.8;
  }
`;

const particleFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uWind;
  varying float vPulse;
  varying float vAngle;
  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float angle = vAngle * uWind;
    point = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * point;
    float dist = length(vec2(point.x * mix(1.0, 1.9, uWind), point.y));
    float halo = 1.0 - smoothstep(0.08, mix(0.5, 0.42, uWind), dist);
    float core = 1.0 - smoothstep(0.0, mix(0.14, 0.07, uWind), dist);
    float alpha = halo * uOpacity * vPulse;
    gl_FragColor = vec4(uColor * (0.55 + core * 1.8), alpha);
  }
`;

function seedParticles(count) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 15;
    positions[index * 3 + 1] = Math.random() * 5 - 1.1;
    positions[index * 3 + 2] = (Math.random() - 0.5) * 12 - 1;
    velocities[index * 3] = (Math.random() - 0.5) * 0.08;
    velocities[index * 3 + 1] = 0.03 + Math.random() * 0.07;
    velocities[index * 3 + 2] = (Math.random() - 0.5) * 0.06;
  }
  return { positions, velocities };
}

export default function Particles({ cursor, style, lowPower, reducedMotion }) {
  const pointsRef = useRef(null);
  const theme = useThemeColors();
  const count = lowPower ? 64 : 220;
  const { geometry, positions, velocities } = useMemo(() => {
    const seeded = seedParticles(count);
    const buffer = new BufferGeometry();
    buffer.setAttribute("position", new BufferAttribute(seeded.positions, 3));
    return { geometry: buffer, ...seeded };
  }, [count]);
  const color = useMemo(() => new Color("#BFE8FF"), []);
  const pointerPosition = useMemo(() => new Vector3(), []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;
    const time = clock.elapsedTime;
    const targetColor = style === "flame" ? theme.current.primary : theme.current.highlight;
    color.lerp(targetColor, 0.03);
    const uniforms = pointsRef.current.material.uniforms;
    uniforms.uColor.value.copy(color);
    uniforms.uTime.value = time;
    uniforms.uOpacity.value = style === "flame" ? 0.88 : 0.62;
    uniforms.uWind.value = style === "wind" ? 1 : 0;
    if (reducedMotion) {
      uniforms.uTime.value = 0;
      return;
    }
    pointerPosition.set(cursor.current.x * 5.5, 1.2, -cursor.current.y * 4.2);

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const dx = positions[offset] - pointerPosition.x;
      const dy = positions[offset + 1] - pointerPosition.y;
      const dz = positions[offset + 2] - pointerPosition.z;
      const distanceSq = dx * dx + dy * dy + dz * dz;
      if (distanceSq < 2.2) {
        const push = ((2.2 - distanceSq) / 2.2) * delta * 1.8;
        positions[offset] += dx * push;
        positions[offset + 1] += dy * push;
        positions[offset + 2] += dz * push;
      }

      if (style === "wind") {
        const angle = delta * 0.09;
        const x = positions[offset];
        const z = positions[offset + 2];
        positions[offset] = x * Math.cos(angle) - z * Math.sin(angle);
        positions[offset + 2] = x * Math.sin(angle) + z * Math.cos(angle);
        positions[offset + 1] += Math.sin(time + index) * delta * 0.08;
      } else if (style === "flame") {
        positions[offset + 1] += delta * (0.12 + (index % 5) * 0.015);
      } else {
        positions[offset + 1] += Math.sin(time * 0.5 + index * 0.17) * delta * 0.025;
      }

      positions[offset] += velocities[offset] * delta;
      positions[offset + 1] += velocities[offset + 1] * delta;
      positions[offset + 2] += velocities[offset + 2] * delta;

      if (positions[offset + 1] > 4.5) {
        positions[offset + 1] = -1.4;
        positions[offset] = (Math.random() - 0.5) * 15;
      }
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={{
          uColor: { value: color.clone() },
          uTime: { value: 0 },
          uSize: { value: lowPower ? 0.12 : 0.15 },
          uOpacity: { value: style === "flame" ? 0.88 : 0.62 },
          uWind: { value: style === "wind" ? 1 : 0 },
        }}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
