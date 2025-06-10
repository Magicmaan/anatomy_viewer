import { create } from "zustand";

import * as Fiber from "@react-three/fiber";

import * as THREE from "three";
import { AnatomyLayers, anatomyLayers } from "@/constants/localisation";
// import { AnatomyLayers } from "@/constants/localisation";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import createSceneUISlice, { SceneUIState } from "./sceneUISlice";
import { Scene } from "three";

interface StoreState {
  name: string;
  description: string;

  // store the gltf model loaded from the file
  _GLTF: (GLTF & Fiber.ObjectMap) | null;
  selected: THREE.Mesh | null;
  // defines which layer of the anatomy model is currently being displayed
  anatomyLayer: AnatomyLayers;
  // defines the mix of layers, so during transitions between layers, this value can be used to blend the visibility of different layers
  layerMix: number;

  setGLTF: (model: GLTF & Fiber.ObjectMap) => void;
  getModel: () => THREE.Group<THREE.Object3DEventMap>;
  setSelected: (object: THREE.Object3D | null) => void;
  setLayer: (value: number) => void;
}

const useScene = create<StoreState & SceneUIState>((set, get, ...props) => ({
  // SceneUIState properties
  ...createSceneUISlice(set, get, ...props),
  name: "Anatomy Model",
  description: "A 3D model of the human anatomy.",
  _GLTF: null,
  selected: null,
  anatomyLayer: "skin",
  layerMix: 0,

  setGLTF: (model) => set({ _GLTF: model }),
  getModel: () => {
    const state = get();
    if (!state._GLTF) {
      console.warn("GLTF model not set. Returning an empty group.");
      return new THREE.Group();
    }
    return state._GLTF.scene as THREE.Group<THREE.Object3DEventMap>;
  },
  setSelected: (object) => set({ selected: object }),
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
    isSidebarOpen: state.isSidebarOpen,
    selectedObjectId: state.selectedObjectId,
    setSidebarOpen: state.setSidebarOpen,
    setSelectedObjectId: state.setSelectedObjectId,
    three: state.three,
    setInfoBox: state.setInfoBox,
    setInfoBoxPosition: state.setInfoBoxPosition,
  };
};

export default useScene;
