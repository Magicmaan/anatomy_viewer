import { create } from "zustand";

import * as Fiber from "@react-three/fiber";

import * as THREE from "three";
import {
	AnatomyLayers,
	anatomyLayers,
	AnatomyString_en,
	getAnatomyString,
} from "@/constants/localisation";
// import { AnatomyLayers } from "@/constants/localisation";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import createSceneUISlice, { SceneUIState } from "./sceneUISlice";
import { Scene } from "three";
import createThreeSceneStore, { ThreeSceneState } from "./sceneSlice";
import createUIActionSlice, { UIActionState } from "./UIActionSlice";
import { stripName } from "@/util/modelUtil";

interface StoreState {
	name: string;
	description: string;

	// store the gltf model loaded from the file
	_GLTF: (GLTF & Fiber.ObjectMap) | null;
	selected: {
		mesh: THREE.Object3D;
		layer: AnatomyLayers;
		name: string;
		readableName: string;
		description: string;
	} | null;
	// defines which layer of the anatomy model is currently being displayed
	anatomyLayer: AnatomyLayers;
	// defines the mix of layers, so during transitions between layers, this value can be used to blend the visibility of different layers
	layerMix: number;
	camera: THREE.PerspectiveCamera | null;

	setCamera: (camera: THREE.PerspectiveCamera | null) => void;

	setGLTF: (model: GLTF & Fiber.ObjectMap) => void;
	getModel: () => THREE.Group<THREE.Object3DEventMap>;
	setSelectedByMesh: (mesh: THREE.Object3D | null) => void;
	setLayer: (value: number) => void;
}

const useScene = create<
	StoreState & SceneUIState & ThreeSceneState & UIActionState
>((set, get, ...props) => ({
	// SceneUIState properties
	...createSceneUISlice(set, get, ...props),
	...createThreeSceneStore(set, get, ...props),
	...createUIActionSlice(set, get, ...props),
	name: "Anatomy Model",
	description: "A 3D model of the human anatomy.",
	_GLTF: null,
	selected: null,
	anatomyLayer: "skin",
	layerMix: 0,
	camera: null,
	setCamera: (camera) => set({ camera }),

	setGLTF: (model) => set({ _GLTF: model }),
	getModel: () => {
		const state = get();
		if (!state._GLTF) {
			console.warn("GLTF model not set. Returning an empty group.");
			return new THREE.Group();
		}
		return state._GLTF.scene as THREE.Group<THREE.Object3DEventMap>;
	},
	setSelectedByMesh: (mesh) => {
		if (!mesh) {
			set({ selected: null });
			return;
		}
		const name = mesh.name;
		const readableName = getAnatomyString(
			stripName(mesh.name) as keyof typeof AnatomyString_en
		);
		//TODO: add description to the mesh
		const description = `This is the ${readableName} part of the anatomy model.`;
		const layer = anatomyLayers.find((layer) =>
			mesh.name.toLowerCase().includes(layer.toLowerCase())
		);
		set({
			selected: {
				mesh,
				name: name,
				readableName: readableName,
				description: description,
				layer: layer || "skin", // Default to "skin" if no layer is found
			},
		});
	},
	setLayer: (value) => {
		const state = get();
		if (value < 0 || value > 1) {
			console.warn("Layer mix value must be between 0 and 1.");
			return;
		}

		// const anatomyLayers: AnatomyLayers[] = ["skin", "muscle", "skeleton", "organs"];
		const step = 1 / (anatomyLayers.length - 1);
		const roundedValue = Math.floor(value * (anatomyLayers.length - 1));
		if (roundedValue < 0 || roundedValue >= anatomyLayers.length) {
			console.warn("Invalid layer index calculated from value.");
			return;
		}

		const exactPosition = (value / step) % 1;
		// console.log("Setting anatomy layer to:", layers[roundedValue]);
		set({ anatomyLayer: anatomyLayers[roundedValue], layerMix: exactPosition });

		// console.log("Setting layer mix to:", exactPosition);
	},
}));

export const useUIScene = () => {
	const state = useScene();
	return {
		...state.threeUI,
		setInfoBox: state.setInfoBox,
		updateInfoBox: state.updateInfoBox,
		isSidebarOpen: state.isSidebarOpen,
		selectedObjectId: state.selectedObjectId,
	};
};

export default useScene;
