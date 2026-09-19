import type { FC } from "react";

interface SilkProperties {
  color?: string;
  lightMode?: boolean;
  noiseIntensity?: number;
  rotation?: number;
  scale?: number;
  speed?: number;
}

export declare const Silk: FC<SilkProperties>;
