import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Color } from "three";

function hexToNormalizedRGB(hex) {
  hex = hex.replace("#", "");
  return [
    Number.parseInt(hex.slice(0, 2), 16) / 255,
    Number.parseInt(hex.slice(2, 4), 16) / 255,
    Number.parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uLightMode;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  float grain = rnd / 15.0 * uNoiseIntensity;
  vec3 result = uColor * pattern - vec3(grain);
if (uLightMode > 0.5) {
  float fold = smoothstep(0.28, 0.9, pattern);
  float specular = smoothstep(0.72, 0.98, pattern);
  vec3 shadowColor = uColor * 0.72;
  vec3 bodyColor = min(uColor * 1.18, vec3(1.0));
  vec3 lightBase = mix(shadowColor, bodyColor, fold);
  lightBase = mix(lightBase, vec3(1.0), specular * 0.92);
  float fineNoise = noise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
  float grainSignal = (rnd + fineNoise - 1.0);
  float grainStrength = clamp(uNoiseIntensity * 0.038, 0.0, 0.16);
  result = lightBase + grainSignal * grainStrength;
}
  gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
}
`;

const SilkPlane = forwardRef(({ uniforms }, reference) => {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (reference.current) {
      reference.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [reference, viewport]);

  useFrame((_, delta) => {
    reference.current.material.uniforms.uTime.value += 0.1 * delta;
  });

  return (
    <mesh ref={reference}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial fragmentShader={fragmentShader} uniforms={uniforms} vertexShader={vertexShader} />
    </mesh>
  );
});
SilkPlane.displayName = "SilkPlane";

function Silk({ color = "#7B7481", lightMode = false, noiseIntensity = 1.5, rotation = 0, scale = 1, speed = 5 }) {
  const meshReference = useRef();

  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uLightMode: { value: lightMode ? 1 : 0 },
      uNoiseIntensity: { value: noiseIntensity },
      uRotation: { value: rotation },
      uScale: { value: scale },
      uSpeed: { value: speed },
      uTime: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uSpeed.value = speed;
    uniforms.uScale.value = scale;
    uniforms.uNoiseIntensity.value = noiseIntensity;
    uniforms.uColor.value.setRGB(...hexToNormalizedRGB(color));
    uniforms.uRotation.value = rotation;
    uniforms.uLightMode.value = lightMode ? 1 : 0;
  }, [speed, scale, noiseIntensity, color, rotation, lightMode, uniforms]);

  return (
    <Canvas dpr={[1, 2]} frameloop="always">
      <SilkPlane ref={meshReference} uniforms={uniforms} />
    </Canvas>
  );
}

export { Silk };
