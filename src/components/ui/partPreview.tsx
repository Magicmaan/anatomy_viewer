import useScene, { useUIScene } from "@/store/store";
import {
	Billboard,
	MeshPortalMaterial,
	Clone,
	Outlines,
	PerspectiveCamera,
	RoundedBox,
	RenderTexture,
	Html,
} from "@react-three/drei";
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { create } from "domain";
import { createPortal } from "react-dom";

export default function PartPreview({
	htmlRef,
}: {
	htmlRef: React.RefObject<HTMLDivElement | null>;
}) {
	const selectedObject = useScene((state) => state.selected);
	const selected = selectedObject?.mesh as THREE.Mesh | null;
	const ref = useRef<THREE.Group>(null);
	const meshRef2 = useRef<THREE.Mesh>(null);
	const UIScene = useUIScene();
	const infoBoxPosition = UIScene.infoBox?.worldPosition;
	const infoBox = UIScene.infoBox;
	const cameraRef = useRef<THREE.PerspectiveCamera>(null);
	const panelSize: [number, number, number] = [0.75, 0.75, 0];
	const baseScale = 7.5;

	// A simple rotating animation for the preview cube
	const cubeRef = useRef<THREE.Mesh>(null);
	useFrame(({ clock }) => {
		if (cubeRef.current) {
			cubeRef.current.rotation.y = clock.getElapsedTime() * 0.5;
			cubeRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.5;
		}
	});

	return (
		<group position={[0, 0, 0]} scale={[baseScale, baseScale, baseScale]}>
			{/* Render the preview as a plane with RenderTexture */}
			<mesh>
				<planeGeometry args={[1, 1]} />
				<meshBasicMaterial transparent alphaToCoverage>
					<RenderTexture attach="map">
						<PerspectiveCamera
							ref={cameraRef}
							makeDefault
							position={[0, 0, 2]}
							fov={50}
							near={0.1}
							far={10}
						/>
						{/* <color attach="background" args={["#000000"]} /> */}
						<ambientLight intensity={1.5} />
						<directionalLight position={[10, 10, 5]} />

						{/* If there's a meshRef provided, we would clone it here instead of showing the cube */}
						{selected && (
							<Clone
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
						)}
					</RenderTexture>
				</meshBasicMaterial>
			</mesh>
		</group>
	);
}
