import useScene from "@/store/store";
import { Outlines } from "@react-three/drei";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { request } from "http";
import { use, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const useCustomMaterial = (object?: THREE.Mesh) => {
  const customMaterialRef = useRef(
    new THREE.MeshStandardMaterial({
      name: "CustomMaterial",
      color: new THREE.Color("white"), // Red color
      // opacity: 1.0,
      transparent: true,
      emissive: new THREE.Color("white"),
      emissiveMap: null,
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
      map: null,
    })
  );

  useFrame(() => {
    if (!object) return;

    customMaterialRef.current.emissiveIntensity = 0.5;
    customMaterialRef.current.needsUpdate = true;
    // console.log("Emissive intensity:", customMaterialRef.current.emissiveIntensity);
  });

  useEffect(() => {
    if (!object) return;
    const modelMaterials: { [id: string]: THREE.Material } = {};

    customMaterialRef.current.map = (
      object.material as THREE.MeshStandardMaterial
    ).map;
    customMaterialRef.current.emissiveMap = (
      object.material as THREE.MeshStandardMaterial
    ).map;
    customMaterialRef.current.emissiveIntensity = 0;

    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        modelMaterials[child.id] = child.material;
      }
    });

    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = customMaterialRef.current;
      }
    });

    return () => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material =
            modelMaterials[child.id] || new THREE.MeshStandardMaterial();
          child.material.emissiveIntensity = 0;
          child.material.needsUpdate = true;
        }
      });
    };
  }, [object]);
};

interface SelectedProps {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

export default function Selected() {
  const selected = useScene((state) => state.selected);
  useCustomMaterial(selected as THREE.Mesh);
  const scene = useThree((state) => state.scene);
  const outline = useRef<THREE.LineSegments | null>(null);

  useEffect(() => {
    if (!selected) return;
    const position = selected.getWorldPosition(new THREE.Vector3());
    const rotation = selected.rotation.clone();

    const edges = new THREE.EdgesGeometry(selected.geometry, 90);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
    );
    line.position.copy(position);
    line.rotation.copy(rotation);
    line.rotation.y = Math.PI / 2;
    scene.add(line);
    outline.current = line;
    return () => {
      scene.remove(line);
      line.geometry.dispose();
      edges.dispose();
      line.material.dispose();
    };
  }, [selected, scene]);

  useFrame(() => {
    if (!selected || !outline.current) return;
    // update outline position and rotation

    // console.log("Outline position:", outline.current.position);
    outline.current.matrix.copy(selected.matrixWorld);
    outline.current.matrixAutoUpdate = false;
  });

  if (!selected) {
    return null;
  }
  return <group />;
}
