import { create, StateCreator } from "zustand";
import * as THREE from "three";
import { RefObject } from "react";

export interface SceneUIState {
  isSidebarOpen: boolean;
  selectedObjectId: string | null;
  setSidebarOpen: (open: boolean) => void;
  setSelectedObjectId: (id: string | null) => void;

  three: {
    infoBox: {
      group: RefObject<THREE.Group<THREE.Object3DEventMap> | null>;
      html: RefObject<HTMLDivElement | null>;
      position: THREE.Vector3;
      rotation: THREE.Euler;
      size: THREE.Vector2;
    };
  };

  setInfoBox: (
    group: RefObject<THREE.Group<THREE.Object3DEventMap> | null>,
    html: RefObject<HTMLDivElement | null>,
    position: THREE.Vector3,
    rotation: THREE.Euler,
    size: THREE.Vector2
  ) => void;
  setInfoBoxPosition: (
    position: THREE.Vector3,
    rotation: THREE.Euler,
    size: THREE.Vector2
  ) => void;
}

export const createSceneUISlice: StateCreator<
  SceneUIState,
  [],
  [],
  SceneUIState
> = (set: any, get: any) => ({
  isSidebarOpen: false,
  selectedObjectId: null,

  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
  setSelectedObjectId: (id: string | null) => set({ selectedObjectId: id }),

  three: {
    infoBox: {
      group: { current: null },
      html: { current: null },
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      size: new THREE.Vector2(200, 100),
    },
  },

  setInfoBox: (
    group: RefObject<THREE.Group<THREE.Object3DEventMap> | null>,
    html: RefObject<HTMLDivElement | null>,
    position: THREE.Vector3,
    rotation: THREE.Euler,
    size: THREE.Vector2
  ) => {
    set((state: SceneUIState) => ({
      three: {
        ...state.three,
        infoBox: {
          group,
          html,
          position,
          rotation,
          size,
        },
      },
    }));
  },
  setInfoBoxPosition: (
    position: THREE.Vector3,
    rotation: THREE.Euler,
    size: THREE.Vector2
  ) => {
    set((state: SceneUIState) => ({
      three: {
        ...state.three,
        infoBox: {
          ...state.three.infoBox,
          position,
          rotation,
          size,
        },
      },
    }));
  },
});

export default createSceneUISlice;
