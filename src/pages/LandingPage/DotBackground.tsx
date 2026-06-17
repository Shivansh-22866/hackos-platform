import { Canvas } from "@react-three/fiber";
import { DotField } from "./DotField";

export default function DotBackground() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 40,
        }}
      >
        <DotField />
      </Canvas>
    </div>
  );
}