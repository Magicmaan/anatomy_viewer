import { StateCreator } from "zustand";
import { ThreeSceneState } from "./sceneSlice";
import { SceneUIState } from "./sceneUISlice";
import * as THREE from "three";
import { RefObject } from "react";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";
import { group } from "console";
import { stat } from "fs";
export interface UIActionState {
	setInfoBox: (
		group: React.RefObject<THREE.Group<THREE.Object3DEventMap> | null>,
		html: React.RefObject<HTMLDivElement | null>
	) => void;
	updateInfoBox: (
		group: React.RefObject<THREE.Group<THREE.Object3DEventMap> | null>,
		html: React.RefObject<HTMLDivElement | null>
	) => void;
}

export const createUIActionSlice: StateCreator<
	UIActionState & SceneUIState & ThreeSceneState,
	[],
	[],
	UIActionState
> = (set, get) => ({
	setInfoBox: (group, html) => {
		// error handling
		if (!get().isInitialized) {
			console.warn("Scene is not initialized. Cannot set info box.");
			return;
		}
		const camera = get().camera;
		if (!camera) {
			console.warn("Camera is not set. Cannot calculate info box position.");
			return;
		}
		const size = get().size;
		if (!size) {
			console.warn("Size is not set. Cannot calculate info box position.");
			return;
		}
		if (!group.current || !html.current) {
			console.warn("Group or HTML reference is not set. Cannot set info box.");
			return;
		}

		console.log("Setting info box with group:", group.current, "and html:", html.current);

		const htmlGroup = group.current.children[0] as THREE.Group | null;
		if (!htmlGroup) return;

		// calculate scene position, distance, and size
		const worldPosition =
			group.current.getWorldPosition(new THREE.Vector3()) || new THREE.Vector3(0, 0, 0);
		const worldRotation = htmlGroup.rotation;
		const distance = camera.position.distanceTo(worldPosition) || 0;

		// Calculate world width/height
		const fov = (camera.fov * Math.PI) / 180;
		const visibleHeight = 2 * Math.tan(fov / 2) * distance;
		const aspect = size.width / size.height;
		const visibleWidth = visibleHeight * aspect;

		const rect = html.current.getBoundingClientRect();
		const worldWidth = (rect.width / size.width) * visibleWidth;
		const worldHeight = (rect.height / size.height) * visibleHeight;

		set((state) => ({
			...state,
			threeUI: {
				...state.threeUI,
				infoBox: {
					group,
					html,
					worldPosition,
					screenPosition: new THREE.Vector2(
						html.current?.offsetLeft,
						html.current?.offsetHeight
					), // This will be updated later
					distance,
					rotation: worldRotation,
					size: new THREE.Vector2(worldWidth, worldHeight),
				},
			},
		}));
		console.log("Info box set with:", {
			group: group.current,
			html: html.current,
			worldPosition,
			screenPosition: new THREE.Vector2(
				html.current?.offsetLeft || 0,
				html.current?.offsetHeight || 0
			),
			distance,
			rotation: worldRotation,
			size: new THREE.Vector2(worldWidth, worldHeight),
		});
		const val = get().threeUI;
		console.log("Current ThreeUI state:", val);
	},
	updateInfoBox: (group, html) => {
		if (!get().isInitialized) {
			console.warn("Scene is not initialized. Cannot update info box.");
			return;
		}

		if (!get().threeUI) {
			console.warn("ThreeUI is not initialized. trying to set info box.");
			console.log(get().threeUI);
			console.log(group, html);
			get().setInfoBox(group, html);
			return;
		}
		const { threeUI } = get();
		const { infoBox } = threeUI || {};
		if (!infoBox?.group?.current || !infoBox.html.current) {
			console.warn(
				"Info box group or HTML reference is not set. Cannot update info box."
			);
			return;
		}

		const htmlGroup = infoBox.group.current.children[0] as THREE.Group | null;
		if (!htmlGroup) return;

		const camera = get().camera;
		if (!camera) {
			console.warn("Camera is not set. Cannot update info box position.");
			return;
		}

		const size = get().size;
		if (!size) {
			console.warn("Size is not set. Cannot update info box position.");
			return;
		}

		// Calculate new values
		const newWorldPosition = new THREE.Vector3();
		infoBox.group.current.children[0].getWorldPosition(newWorldPosition);

		const newDistance = camera.position.distanceTo(newWorldPosition);

		const newRotation = htmlGroup.rotation.clone();

		// Calculate updated dimensions
		const fov = (camera.fov * Math.PI) / 180;
		const visibleHeight = 2 * Math.tan(fov / 2) * newDistance;
		const aspect = size.width / size.height;
		const visibleWidth = visibleHeight * aspect;
		const rect = infoBox.html.current.getBoundingClientRect();
		console.log("HTML element rect:", rect);
		console.log("Visible dimensions:", {
			visibleWidth,
			visibleHeight,
		});
		console.log("Size dimensions:", size);

		// Check if the HTML element has non-zero dimensions
		// If the element has zero width or height, use a default minimum size
		// This prevents issues when the element hasn't fully rendered yet
		const elementWidth = rect.width > 0 ? rect.width : 100; // Default width if zero
		const elementHeight = rect.height > 0 ? rect.height : 50; // Default height if zero

		// Calculate world dimensions based on element size and visible area
		const worldWidth = (elementWidth / size.width) * visibleWidth;
		const worldHeight = (elementHeight / size.height) * visibleHeight;

		const newSize = get().threeUI?.infoBox?.size || new THREE.Vector2(0, 0);
		newSize.set(worldWidth, worldHeight);
		console.log("New size:", newSize);

		const newScreenPosition = new THREE.Vector2(
			infoBox.html.current?.offsetLeft || 0,
			infoBox.html.current?.offsetHeight || 0
		);
		const current = get().threeUI?.infoBox;
		current?.worldPosition.set(
			newWorldPosition.x,
			newWorldPosition.y,
			newWorldPosition.z
		);
		current?.screenPosition.set(newScreenPosition.x, newScreenPosition.y);
		current?.rotation.set(newRotation.x, newRotation.y, newRotation.z);
		current?.size.set(newSize.x, newSize.y);
		// Update state using set()
		// set((state) => ({
		// 	...state,
		// 	threeUI: {
		// 		...state.threeUI,
		// 		infoBox: state.threeUI?.infoBox
		// 			? {
		// 					...state.threeUI.infoBox,
		// 					worldPosition: newWorldPosition,
		// 					distance: newDistance,
		// 					rotation: newRotation,
		// 					size: newSize,
		// 					screenPosition: newScreenPosition,
		// 				}
		// 			: {
		// 					group: infoBox.group,
		// 					html: infoBox.html,
		// 					worldPosition: newWorldPosition,
		// 					distance: newDistance,
		// 					rotation: newRotation,
		// 					size: newSize,
		// 					screenPosition: newScreenPosition,
		// 				},
		// 	},
		// }));

		console.log("Updated info box:", get().threeUI?.infoBox);
	},
});

export default createUIActionSlice;
