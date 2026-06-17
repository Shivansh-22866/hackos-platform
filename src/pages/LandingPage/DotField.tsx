"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function DotField() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { camera } = useThree();
  
  const pointer = useThree((state) => state.pointer);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    []
  );

  const intersection = useRef(new THREE.Vector3());

  const targetMouse = useRef(new THREE.Vector2());
  const smoothMouse = useRef(new THREE.Vector2());

  const positions = useMemo(() => {
    const gridSize = 120;
    const spacing = 0.2;

    const data: number[] = [];

    for (let x = -gridSize / 2; x < gridSize / 2; x++) {
      for (let y = -gridSize / 2; y < gridSize / 2; y++) {
        data.push(x * spacing, y * spacing, 0);
      }
    }

    return new Float32Array(data);
  }, []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value =
      clock.getElapsedTime();

    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(
      plane,
      intersection.current
    );

    targetMouse.current.set(
      intersection.current.x,
      intersection.current.y
    );

    smoothMouse.current.lerp(
      targetMouse.current,
      0.1
    );

    materialRef.current.uniforms.uMouse.value.copy(
      smoothMouse.current
    );
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
}

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;

varying float vAlpha;
varying float vInfluence;

void main() {
    vec3 pos = position;

    vec2 diff = pos.xy - uMouse;

    float dist = length(diff);

    float radius = 2.0;

    float influence =
        1.0 -
        smoothstep(
            0.0,
            radius,
            dist
        );

    influence = pow(influence, 3.0);

    // Repulsion
    vec2 repel =
        normalize(diff + 0.0001)
        * influence
        * 1.2;

    pos.xy += repel;

    // Ripple ring
    float ripple =
        sin(
            dist * 12.0 -
            uTime * 8.0
        ) * influence;

    pos.z += ripple * 0.2;

    // Breathing
    float pulse =
        0.5 +
        0.5 *
        sin(
            uTime * 2.0 +
            position.x * 0.3 +
            position.y * 0.3
        );

    float glow =
        influence * 0.8;

    vAlpha =
        0.25 +
        pulse * 0.4 +
        glow;

    vInfluence = influence;

    vec4 mvPosition =
        modelViewMatrix *
        vec4(pos, 1.0);

    gl_Position =
        projectionMatrix *
        mvPosition;

    gl_PointSize =
        2.0 +
        influence * 5.0;
}
`;

const fragmentShader = `
varying float vAlpha;
varying float vInfluence;

void main() {
    vec2 uv =
        gl_PointCoord - 0.5;

    float dist =
        length(uv);

    float circle =
        1.0 -
        smoothstep(
            0.35,
            0.5,
            dist
        );

    float core =
        1.0 -
        smoothstep(
            0.0,
            0.15,
            dist
        );

    vec3 baseColor =
        vec3(
            0.65,
            0.85,
            1.0
        );

    vec3 color =
        mix(
            baseColor,
            vec3(1.0),
            core + vInfluence * 0.3
        );

    gl_FragColor =
        vec4(
            color,
            circle * vAlpha
        );
}
`;