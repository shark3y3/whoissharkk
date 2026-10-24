import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, FogExp2, Vector3 } from "three";
import Katana from "./Katana.jsx";
import Water from "./Water.jsx";
import Particles from "./Particles.jsx";
import { useThemeColors } from "./ThemeBridge.jsx";

const Effects = lazy(() => import("./Effects.jsx"));

function Moon() {
  const moonRef = useRef(null);
  const haloRef = useRef(null);
  const lightRef = useRef(null);
  const theme = useThemeColors();
  const tint = useMemo(() => new Color("#DDF2FF"), []);

  useFrame(() => {
    tint.lerp(theme.current.highlight, 0.02);
    if (moonRef.current) moonRef.current.material.color.copy(tint);
    if (haloRef.current) {
      haloRef.current.material.uniforms.uGlow.value.copy(tint);
    }
    if (lightRef.current) lightRef.current.color.copy(tint);
  });

  return (
    <group position={[-3.35, 2.45, -6.5]}>
      <mesh ref={haloRef} position={[0, 0, -0.08]} scale={[4.8, 4.8, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={{ uGlow: { value: tint.clone() } }}
          vertexShader="varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
          fragmentShader="uniform vec3 uGlow; varying vec2 vUv; void main(){float d=distance(vUv,vec2(0.5)); float glow=exp(-d*d*8.0); gl_FragColor=vec4(uGlow*glow,glow*0.28);}"
        />
      </mesh>
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.76, 48, 48]} />
        <meshBasicMaterial color={tint} toneMapped={false} />
      </mesh>
      <pointLight ref={lightRef} color={tint} intensity={8} distance={20} decay={2} />
    </group>
  );
}

function Backdrop() {
  return (
    <mesh scale={80}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        side={2}
        depthWrite={false}
        vertexShader="varying vec3 vPosition; void main(){vPosition=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
        fragmentShader="varying vec3 vPosition; void main(){float t=smoothstep(-0.8,0.75,normalize(vPosition).y); vec3 low=vec3(0.008,0.02,0.055); vec3 high=vec3(0.025,0.08,0.16); gl_FragColor=vec4(mix(low,high,t),1.0);}"
      />
    </mesh>
  );
}

function SceneRig({ cursor, scrollProgress, style, lowPower, reducedMotion }) {
  const { camera, scene, size } = useThree();
  const theme = useThemeColors();
  const fogColor = useMemo(() => new Color("#0B1D3A"), []);
  const primary = useMemo(() => new Color("#2E8BC0"), []);
  const fillRef = useRef(null);
  const rimRef = useRef(null);
  const pointerLightRef = useRef(null);
  const lightningRef = useRef(null);
  const cameraTarget = useMemo(() => new Vector3(), []);
  const lookTarget = useMemo(() => new Vector3(), []);
  const scrollRef = useRef(0);

  useEffect(() => {
    scene.fog = new FogExp2(fogColor, 0.035);
    return () => {
      scene.fog = null;
    };
  }, [fogColor, scene]);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handlePointer = (event) => {
      cursor.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      cursor.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, [cursor]);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    fogColor.lerp(theme.current.background, 0.035);
    primary.lerp(theme.current.primary, 0.035);
    if (scene.fog) scene.fog.color.copy(fogColor);
    if (fillRef.current) fillRef.current.color.copy(primary);
    if (rimRef.current) rimRef.current.color.copy(theme.current.highlight);
    if (pointerLightRef.current) {
      pointerLightRef.current.position.set(cursor.current.x * 4.2, 1.2 + cursor.current.y * 2, 2.2);
      pointerLightRef.current.color.lerp(theme.current.primary, 0.035);
    }

    const scroll = reducedMotion ? 0 : scrollProgress.current;
    const portrait = size.width / size.height < 0.75;
    cameraTarget.set(scroll * 0.45, 1.15 + scroll * 0.24, portrait ? 11.5 : 7.7 - scroll * 0.85);
    if (reducedMotion) {
      camera.position.copy(cameraTarget);
    } else {
      camera.position.lerp(cameraTarget, 1 - Math.exp(-delta * 1.5));
    }
    lookTarget.set(scroll * 0.25, 0.15, 0);
    camera.lookAt(lookTarget);

    if (lightningRef.current) {
      const pulse = !reducedMotion && style === "thunder" && Math.sin(time * 0.52) > 0.998;
      lightningRef.current.intensity +=
        ((pulse ? 3.5 : 0) - lightningRef.current.intensity) *
        Math.min(delta * (pulse ? 18 : 5), 1);
    }
  });

  return (
    <>
      <color attach="background" args={["#071326"]} />
      <Backdrop />
      <ambientLight intensity={0.42} />
      <directionalLight ref={rimRef} position={[-4, 5, -3]} intensity={2.2} />
      <directionalLight ref={fillRef} position={[4, 2, 4]} intensity={0.6} />
      <pointLight ref={pointerLightRef} intensity={0.48} distance={8} />
      <pointLight ref={lightningRef} color="#FFF8D6" position={[0, 5, -3]} distance={18} intensity={0} />
      <Moon />
      <Water cursor={cursor} reducedMotion={reducedMotion} />
      <Katana cursor={cursor} reducedMotion={reducedMotion} />
      <Particles cursor={cursor} style={style} lowPower={lowPower} reducedMotion={reducedMotion} />
      {!lowPower && !reducedMotion ? <Environment preset="night" /> : null}
      {!lowPower && !reducedMotion ? (
        <Suspense fallback={null}>
          <Effects />
        </Suspense>
      ) : null}
    </>
  );
}

export default function Scene({
  cursor,
  scrollProgress,
  style,
  lowPower,
  reducedMotion,
}) {
  return (
    <SceneRig
      cursor={cursor}
      scrollProgress={scrollProgress}
      style={style}
      lowPower={lowPower}
      reducedMotion={reducedMotion}
    />
  );
}
