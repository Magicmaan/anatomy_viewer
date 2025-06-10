import useScene, { useUIScene } from "@/store/store";
import {
  Billboard,
  MeshPortalMaterial,
  Clone,
  Outlines,
} from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface PartPreviewProps {
  position: [number, number, number];
}
export default function PartPreview({}: PartPreviewProps) {
  const selected = useScene((state) => state.selected);
  const portalMaterialRef = useRef<any>(null);
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);
  const UIScene = useUIScene();
  const position = UIScene.three.infoBox.position;

  useFrame((state, delta) => {
    const camera = state.camera;
    const pos = UIScene.three.infoBox.group.current?.getWorldPosition(
      new THREE.Vector3()
    );
    if (!pos) return;
    const distance = camera.position.distanceTo(pos);
    console.log("Distance to info box:", distance);
    meshRef.current?.scale.set(distance / 10, distance / 10, distance / 10);
    meshRef2.current?.scale.set(distance / 10, distance / 10, distance / 10);
  });

  const adjustedPosition = useMemo(() => {
    const vec = new THREE.Vector3(...position);
    // vec.y += UIScene.three.infoBox.size.y / 2 + 0.5; // Adjust Y position to be above the info box
    vec.z += UIScene.three.infoBox.size.x * 4 + 0.5; // Adjust Z position to be behind the info box
    return vec;
  }, [position, UIScene.three.infoBox.size]);
  if (!selected) return null;
  return (
    <Billboard
      follow
      ref={ref}
      position={position}
      scale={[0.5, 0.5, 0.5]}
      renderOrder={100}
    >
      <group
        position={new THREE.Vector3(UIScene.three.infoBox.size.x * 2.5, 0, 0)}
      >
        <mesh ref={meshRef}>
          <planeGeometry args={[2, 2]} />
          <MeshPortalMaterial
            blur={0.25}
            resolution={256}
            transparent
            //   alphaToCoverage={true}
            // stencilFunc={THREE.AlwaysStencilFunc}
            ref={portalMaterialRef}
          >
            <Clone
              ref={null}
              object={(() => {
                // Clone and center geometry at (0,0,0)
                const mesh = new THREE.Mesh(
                  selected.geometry.clone(),
                  selected.material
                );
                const offset = mesh.geometry.boundingBox?.getCenter(
                  new THREE.Vector3()
                );
                if (offset) {
                  mesh.geometry.translate(-offset.x, -offset.y, -offset.z);
                }
                mesh.position.set(0, 0, 0);
                mesh.rotation.set(0, 0, 0);
                return mesh;
              })()}
              position={[0, 0, 0]}
              rotation={[Math.PI / 16, -Math.PI + Math.PI / 4, 0]}
            />
            <mesh position={[0, -0.5, -0.25]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.25, 32]} />
              <meshBasicMaterial color="black" opacity={0.25} transparent />
            </mesh>
            <ambientLight intensity={2} />
          </MeshPortalMaterial>
        </mesh>
        <mesh ref={meshRef2}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="red" opacity={1} />
        </mesh>
      </group>
    </Billboard>
  );
}
