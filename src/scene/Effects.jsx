import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";

export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.55}
        luminanceThreshold={0.76}
        luminanceSmoothing={0.22}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.18} darkness={0.72} />
      <Noise opacity={0.018} />
    </EffectComposer>
  );
}
