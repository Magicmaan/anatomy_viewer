import { ARButton, VRButton } from "@react-three/xr";
// import { Canvas } from "@/components/Canvas";

import Model from "@/components/Model";
import { Canvas } from "@react-three/fiber";
import {
	CameraControls,
	Html,
	Line,
	PerspectiveCamera,
} from "@react-three/drei";
import UIController from "./components/ui/UIController";
import SelectedInfoBox from "./components/ui/infoBox";
import ToolBar from "./components/ui/ToolBar";
import { HumanModel } from "./components/HumanModel";
import LayerSelector from "./components/ui/LayerSelector";
import { Mesh } from "three";
import { useRef } from "react";
import { CircleX, Info } from "lucide-react";
import useScene from "./store/store";
import * as THREE from "three";

export default function App() {
	const htmlRef = useRef<HTMLDivElement>(null);
	// const store = useScene();
	const scene = useScene();
	const initSceneStore = scene.initSceneStore;
	return (
		<>
			<UIController />
			<Canvas
				className="w-full h-full bg-gray-300"
				onPointerMissed={() => {
					scene.setSelectedByMesh(null);
				}}
				onCreated={(state) => {
					state.gl.setPixelRatio(window.devicePixelRatio);
					state.gl.setSize(window.innerWidth, window.innerHeight);
					state.setEvents({
						filter: (intersections) =>
							// add raycast filter to only include visible objects
							// don't know why this isn't the default behavior...
							intersections.filter((i) => {
								if (!(i.object instanceof Mesh)) return;

								if (i.object.visible === false) return;
								// filter if opacity is less than 0.25
								if (i.object.material.opacity < 0.25) return;
								if (i.object.material.visible === false) return;

								if (i.object.material instanceof Array) {
									return i.object.material.some(
										(m) => m.visible && m.opacity > 0
									);
								}
								return i;
							}),
					});
					initSceneStore(
						state.scene,
						state.camera as THREE.PerspectiveCamera,
						state.gl,
						state.size
					);
				}}
			>
				<PerspectiveCamera
					makeDefault
					position={[0, 0, 5]}
					fov={75}
					aspect={1.778}
				/>

				<ambientLight intensity={1.25} />

				<CameraControls makeDefault />

				<Model model="/models/skeleton.gltf" />
				<SelectedInfoBox />
			</Canvas>
		</>
	);
}
