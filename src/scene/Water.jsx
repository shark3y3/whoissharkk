import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector2 } from "three";
import { useThemeColors } from "./ThemeBridge.jsx";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uCursor;
  uniform vec3 uPrimary;
  uniform vec3 uHighlight;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float waveA = sin((uv.y * 32.0) + uTime * 0.65 + sin(uv.x * 12.0)) * 0.008;
    float waveB = sin((uv.x * 19.0) - uTime * 0.36) * 0.004;
    float shimmer = 1.0 - smoothstep(0.0, 0.012, abs(uv.y - 0.69 + waveA + waveB));
    float moonPath = exp(-pow((uv.x - 0.72) * 10.0, 2.0));
    float reflection = moonPath * shimmer;
    float horizon = smoothstep(0.82, 0.24, uv.y);

    float cursorDistance = distance(uv * vec2(1.55, 1.0), uCursor * vec2(1.55, 1.0));
    float rippleWave = sin(cursorDistance * 180.0 - uTime * 4.4);
    float rippleMask = smoothstep(0.38, 0.02, cursorDistance) * smoothstep(0.62, 0.02, cursorDistance);
    float ripple = pow(max(rippleWave, 0.0), 8.0) * rippleMask;

    vec3 deep = vec3(0.008, 0.026, 0.068);
    vec3 water = mix(deep, uPrimary * 0.23, horizon);
    water += uHighlight * (reflection * 0.72 + ripple * 0.18);
    water += uPrimary * (0.04 + abs(waveA + waveB) * 1.8);
    gl_FragColor = vec4(water, 0.9);
  }
`;

export default function Water({ cursor, reducedMotion }) {
  const material = useRef(null);
  const theme = useThemeColors();

  useEffect(() => {
    if (!material.current) return;
    material.current.uniforms.uPrimary.value.copy(theme.current.primary);
    material.current.uniforms.uHighlight.value.copy(theme.current.highlight);
  }, [theme]);

  useFrame(({ clock }) => {
    if (!material.current) return;
    const uniforms = material.current.uniforms;
    uniforms.uTime.value = reducedMotion ? 0 : clock.elapsedTime;
    uniforms.uCursor.value.set(0.5 + cursor.current.x * 0.46, 0.5 + cursor.current.y * 0.32);
    uniforms.uPrimary.value.lerp(theme.current.primary, 0.025);
    uniforms.uHighlight.value.lerp(theme.current.highlight, 0.025);
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, -10]}>
      <planeGeometry args={[28, 42, 1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uCursor: { value: new Vector2(0.5, 0.5) },
          uPrimary: { value: theme.current.primary.clone() },
          uHighlight: { value: theme.current.highlight.clone() },
        }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
