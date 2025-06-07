import { Line } from "@react-three/drei";
import * as THREE from "three";

interface RagdollControlProps {
	model: THREE.Group<THREE.Object3DEventMap>;
}

export const useRagdoll = ({ model }: RagdollControlProps) => {
	const onClick = (event: THREE.Event) => {
		console.log("Ragdoll clicked", event);
	};

	return {
		onClick,
	};
};

export default useRagdoll;
