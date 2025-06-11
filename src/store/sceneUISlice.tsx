import { create, StateCreator } from "zustand";
import * as THREE from "three";
import { RefObject } from "react";

interface ThreeUI {
	infoBox: {
		group: RefObject<THREE.Group<THREE.Object3DEventMap> | null>;
		html: RefObject<HTMLDivElement | null>;
		distance: number;
		worldPosition: THREE.Vector3;
		screenPosition: THREE.Vector2;
		rotation: THREE.Euler;
		size: THREE.Vector2;
	};
}

export interface SceneUIState {
	isSidebarOpen: boolean;
	selectedObjectId: string | null;

	threeUI: ThreeUI | null;
}

export const createSceneUISlice: StateCreator<SceneUIState, [], [], SceneUIState> = (
	set: any,
	get: any
) => ({
	isSidebarOpen: false,
	selectedObjectId: null,

	threeUI: null,
});

export default createSceneUISlice;
