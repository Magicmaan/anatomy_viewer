import { Outlines } from "@react-three/drei";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { request } from "http";
import { use, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const useCustomMaterial = (object: THREE.Mesh) => {
	const customMaterialRef = useRef(
		new THREE.MeshStandardMaterial({
			name: "CustomMaterial",
			color: new THREE.Color("white"), // Red color
			// opacity: 1.0,
			transparent: true,
			emissive: new THREE.Color("white"),
			emissiveMap: (object.material as THREE.MeshStandardMaterial).map || null,
			emissiveIntensity: 0.5,
			side: THREE.DoubleSide,
			map: (object.material as THREE.MeshStandardMaterial).map || null,
		})
	);

	useFrame(() => {
		if (!object) return;
		if (customMaterialRef.current.emissiveIntensity >= 1.0) return;
		customMaterialRef.current.emissiveIntensity += 0.01;

		customMaterialRef.current.needsUpdate = true;
		// console.log("Emissive intensity:", customMaterialRef.current.emissiveIntensity);
	});

	useEffect(() => {
		if (!object) return;
		const modelMaterials: { [id: string]: THREE.Material } = {};

		customMaterialRef.current.map =
			(object.material as THREE.MeshStandardMaterial).map || null;
		customMaterialRef.current.emissiveMap =
			(object.material as THREE.MeshStandardMaterial).map || null;
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
					child.material = modelMaterials[child.id] || new THREE.MeshStandardMaterial();
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

export default function Selected({ mesh, position, rotation }: SelectedProps) {
	useCustomMaterial(mesh || new THREE.Mesh());
	const scene = useThree((state) => state.scene);
	const outline = useRef<THREE.LineSegments | null>(null);

	useEffect(() => {
		if (!mesh) return;
		const edges = new THREE.EdgesGeometry(mesh.geometry, 90);
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
	}, [mesh, scene, position, rotation]);

	useFrame(() => {
		// update outline position and rotation
		if (outline.current) {
			console.log("Outline position:", outline.current.position);
			outline.current.matrix.copy(mesh.matrixWorld);
			outline.current.matrixAutoUpdate = false;
		}
	});

	if (!mesh) {
		return null;
	}
	return <group />;
}
