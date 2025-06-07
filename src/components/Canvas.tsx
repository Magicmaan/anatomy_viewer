import * as Fiber from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
	VRButton,
	ARButton,
	XR,
	createXRStore,
	IfInSessionMode,
	XRDomOverlay,
	XRHandModel,
	PointerEvents,
} from "@react-three/xr";
import { JSX } from "react";
import { Fullscreen, Root } from "@react-three/uikit";

interface CanvasProps {
	children?: JSX.Element[] | JSX.Element;
}

export const Canvas = (props: CanvasProps) => {
	const store = createXRStore({
		hand: { teleportPointer: true },
		controller: { teleportPointer: true },
	});

	const bool = true;
	return (
		<>
			<button
				onClick={() => {
					store.enterVR();
				}}>
				Enter VR
			</button>
			<Fiber.Canvas>
				<XR store={store}>
					<PointerEvents />
					<ambientLight intensity={0.5} />
					<directionalLight position={[10, 10, 5]} intensity={1} />

					<IfInSessionMode deny={["immersive-ar", "immersive-vr"]}>
						<PerspectiveCamera />
						<OrbitControls />
					</IfInSessionMode>

					{/* <Controllers rayMaterial={{ color: "blue" }} /> */}
					{/* <TeleportationIndicator /> */}
					{/* <DefaultXRDevUI /> */}
					{props.children}
				</XR>
			</Fiber.Canvas>
		</>
	);
};
