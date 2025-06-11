import { create, StateCreator } from "zustand";
import * as THREE from "three";

export interface ThreeSceneState {
	scene: THREE.Scene | null;
	camera: THREE.PerspectiveCamera | null;
	renderer: THREE.WebGLRenderer | null;
	size: {
		width: number;
		height: number;
		top: number;
		left: number;
	} | null;
	animationId: number | null;
	isInitialized: boolean;

	// Actions
	initSceneStore: (
		scene: THREE.Scene,
		camera: THREE.PerspectiveCamera,
		renderer: THREE.WebGLRenderer,
		size: {
			width: number;
			height: number;
			top: number;
			left: number;
		}
	) => void;
}

export const createThreeSceneStore: StateCreator<
	ThreeSceneState,
	[],
	[],
	ThreeSceneState
> = (set, get) => ({
	scene: null,
	camera: null,
	renderer: null,
	size: null,
	animationId: null,
	isInitialized: false,

	initSceneStore: (scene, camera, renderer, size) => {
		if (get().isInitialized) {
			console.warn("Scene is already initialized. Skipping initialization.");
			return;
		}
		if (!scene || !camera || !renderer || !size) {
			console.error("Invalid parameters provided for scene initialization.");
			return;
		}
		set({
			scene,
			camera,
			renderer,
			size,
			isInitialized: true,
		});
		console.log("Scene store initialized with:", {
			scene,
			camera,
			renderer,
			size,
			isInitialized: true,
		});
	},
});

export default createThreeSceneStore;
