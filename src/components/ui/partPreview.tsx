import useScene, { useUIScene } from "@/store/store";
import {
	Billboard,
	MeshPortalMaterial,
	Clone,
	Outlines,
	PerspectiveCamera,
	RoundedBox,
	RenderTexture,
} from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function PartPreview({
	meshRef,
}: {
	meshRef?: React.RefObject<THREE.Mesh | null>;
}) {
	const selected = useScene((state) => state.selected);
	const portalMaterialRef = useRef<any>(null);
	const ref = useRef<THREE.Group>(null);
	// const meshRef = useRef<THREE.Mesh>(null);
	const meshRef2 = useRef<THREE.Mesh>(null);
	const UIScene = useUIScene();
	const infoBoxPosition = UIScene.infoBox?.worldPosition;
	// const distance = UIScene.infoBox?.distance || 0;
	const infoBox = UIScene.infoBox;
	const portalMaterialCamera = useRef<THREE.PerspectiveCamera>(null);
	const panelSize: [number, number, number] = [0.75, 0.75, 0];

	const baseScale = 7.5;
	const spacing = 0.07; // Spacing between the info box and the preview mesh

	useFrame((state, delta) => {
		if (!infoBoxPosition || !selected || !infoBox) return;
		const camera = state.camera;
		console.log("infoBoxPosition:", infoBoxPosition);
		const distance = camera.position.distanceTo(infoBoxPosition);
		console.log("Distance to info box:", distance);
		meshRef?.current?.position.set(
			((UIScene.infoBox?.size?.x || 1) * distance) / 10,
			0,
			0
		);
		// meshRef.current?.scale.set(0.5 * distance, 0.5 * distance, 0.5);
		// meshRef2.current?.scale.set(0.5 * distance, 0.5 * distance, 0.5);
		// meshRef.current?.parent?.position.setX(
		// 	((UIScene.infoBox?.size?.x || 0) * 4.625 * (1 - baseScale) + spacing) * distance
		// );
		// meshRef.current?.parent?.scale.set(
		// 	baseScale * distance,
		// 	baseScale * distance,
		// 	baseScale
		// );
		// meshRef2.current?.parent?.position.setY(-0.04 * distance);
		meshRef2.current?.updateMatrix();
		meshRef.current?.updateMatrix();
	});

	if (!selected) return null;
	return (
		<>
			{/* // follow
			// ref={ref}
			// position={infoBoxPosition}
			// scale={[baseScale, baseScale, baseScale]}
			// renderOrder={1000}> */}
			<Billboard
				// position={new THREE.Vector3((UIScene.infoBox?.size?.x || -1) * 10, -0.1, 0)}
				// position={[(UIScene.infoBox?.size.x || -1) * 8.5, 0, 0]}
				scale={[baseScale, baseScale, baseScale]}>
				<mesh
					position={[UIScene.infoBox?.size.x || -1, 0, 0]}
					ref={meshRef}
					matrixAutoUpdate={false}
					// args={panelSize} // Width, height, depth. Default is [1, 1, 1]
					// radius={0.05} // Radius of the rounded corners. Default is 0.05
					// smoothness={4} // The number of curve segments. Default is 4
					// bevelSegments={4} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
					// creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
				>
					<planeGeometry args={[panelSize[0], panelSize[1]]} />
					<meshStandardMaterial transparent alphaToCoverage>
						<RenderTexture
							attach="map"
							width={256}
							height={256}

							// blur={0.25}
							// resolution={256}
							// transparent
							//   alphaToCoverage={true}
							// stencilFunc={THREE.AlwaysStencilFunc}
						>
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
							<mesh position={[0, -0.5, -0.25]} rotation={[-Math.PI / 2, 0, 0]}>
								<circleGeometry args={[0.25, 32]} />
								<meshBasicMaterial color="black" opacity={0.25} transparent />
							</mesh>
							<ambientLight intensity={10} />
							<PerspectiveCamera
								makeDefault
								position={[0, 0.2, 2.5]}
								lookAt={[0, 0, 0]}
								fov={45}
							/>
						</RenderTexture>
					</meshStandardMaterial>
				</mesh>
				{/* <RoundedBox
					position={[0, 0, -0.05]}
					ref={meshRef2}
					matrixAutoUpdate={false}
					args={panelSize} // Width, height, depth. Default is [1, 1, 1]
					radius={0.05} // Radius of the rounded corners. Default is 0.05
					smoothness={4} // The number of curve segments. Default is 4
					bevelSegments={4} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
					creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
				>
					<meshBasicMaterial color="white" opacity={0.5} transparent /> */}
				{/* </RoundedBox> */}
			</Billboard>
		</>
	);
}
