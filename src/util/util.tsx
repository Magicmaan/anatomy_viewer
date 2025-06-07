import { RootState } from "@react-three/fiber";
import * as THREE from "three";

export const getCameraPosition = (state: RootState, position?: THREE.Vector3) =>
	state.camera.getWorldPosition(position || new THREE.Vector3());

export const getCameraQuaternion = (state: RootState, quaternion?: THREE.Quaternion) =>
	state.camera.getWorldQuaternion(quaternion || new THREE.Quaternion());

export const getCameraEuler = (state: RootState, euler?: THREE.Euler) =>
	euler?.setFromQuaternion(getCameraQuaternion(state)) ||
	new THREE.Euler().setFromQuaternion(getCameraQuaternion(state));
