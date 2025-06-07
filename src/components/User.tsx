import { useFrame } from "@react-three/fiber";
import { TeleportTarget, useXR, useXRInputSourceEvent, XROrigin } from "@react-three/xr";
import { useRef, useState } from "react";
import { Group, Object3DEventMap } from "three";
import * as THREE from "three";
import { getCameraEuler } from "@/util/util";
import { useEffect } from "react";
import Teleport from "./Teleport";
import { getCameraPosition } from "@/util/util";
import useScene from "@/store/store";
import ModelControl from "./ModelControl";

export default function User() {
	const ref = useRef<Group<Object3DEventMap>>(null!);
	const xr = useXR();
	// const cameraSceneOffset = useScene((state) => state.cameraSceneOffset);
	const groupRef = useRef<Group<Object3DEventMap>>(null!);
	let cameraEuler = new THREE.Euler(0, 0, 0);
	let cameraPosition = new THREE.Vector3(0, 0, 0);
	useFrame((state) => {
		cameraEuler = getCameraEuler(state, cameraEuler);
		cameraPosition = getCameraPosition(state, cameraPosition);
	});
	const [position, setPosition] = useState(new THREE.Vector3(0, 0, 2));

	return (
		<group position={[0, 0, 0]} ref={groupRef}>
			<XROrigin position={position} ref={ref} />

			<Teleport
				rayStartPosition={new THREE.Vector3(0, 0, 0)}
				rayDirection={new THREE.Vector3(180, -1, 0)}
				rayLength={25}
				setPosition={setPosition}
			/>
			<ModelControl
				rayStartPosition={new THREE.Vector3(0, 0, 0)}
				rayDirection={new THREE.Vector3(180, -1, 0)}
				rayLength={25}
				setPosition={setPosition}
			/>
		</group>
	);
}
