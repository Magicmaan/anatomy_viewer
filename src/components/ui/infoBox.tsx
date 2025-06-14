import useScene, { useUIScene } from "@/store/store";
import { Html, View } from "@react-three/drei";
import {
	Billboard,
	CameraControls,
	Clone,
	Line,
	MeshPortalMaterial,
	OrbitControls,
	RenderTexture,
} from "@react-three/drei/core";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Info, CircleX, Camera } from "lucide-react";
import { createElement, RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import PartPreview from "./partPreview";
import { group } from "console";
import { AnatomyIcons } from "@/constants/icons";

interface ThreeLineAnimationProps {
	lineRef?: RefObject<THREE.Line>;
	duration?: number; // Duration of the animation in seconds
}

const useThreeLineAnimation = ({
	lineRef,
	duration = 0.5, // Default duration of the animation
}: ThreeLineAnimationProps) => {
	// custom hook to handle the threejs line animation
	// this hook is used to animate the line in the 3d scene
	const progress = useRef(0);
	const [finished, setFinished] = useState(false);
	const dt = useRef(0); // delta time counter to track the time elapsed since the animation started
	const endPoint = lineRef?.current?.geometry.attributes.instanceStart.array; // get line points
	useEffect(() => {
		return () => {
			if (finished) {
				// Cleanup function to reset progress and delta time when the component unmounts
				// happens when changing selection etc
				progress.current = 0;
				dt.current = 0; // Reset delta time
			}
		};
	}, [finished]);
	useFrame((_, delta) => {
		if (!lineRef?.current) {
			console.warn("lineRef is not defined");
			return; // Ensure lineRef is defined before accessing it
		}
		if (progress.current >= 1) {
			if (!finished) {
				// indicate to react the 3d anim is done
				setFinished(true); // Set the state to true when animation is done
			}
			return; // Stop updating if progress is complete
		}
		if (!endPoint) {
			console.warn("endPoint is not defined");
			return; // Ensure endPoint is defined before accessing it
		}
		dt.current += delta;
		progress.current = dt.current / duration; // Calculate progress based on delta time

		// get points of line
		// structure is [x1, y1, z1, x2, y2, z2, ...]
		const array = lineRef.current.geometry.attributes.instanceStart.array;
		// modify z value of last point
		array[3] = progress.current * endPoint[3]; // Update the x value of the last point based on progress
		array[4] = progress.current * endPoint[4]; // Update the y value of the last point based on progress
		array[5] = progress.current * endPoint[5]; // Update the z value of the last point based on progress
		lineRef.current.geometry.attributes.instanceStart.needsUpdate = true;
	});

	return { finished, setFinished };
};

export default function SelectedInfoBox() {
	const selectedObject = useScene((state) => state.selected);
	const hasSelected = selectedObject !== null && selectedObject !== undefined; // Check if an object is selected

	const UIScene = useUIScene();
	const groupRef = useRef<THREE.Group>(null); // Reference to the group containing the HTML element and line
	const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
	const htmlPosition = new THREE.Vector3(0, 1, 2); // Position of the HTML element relative to the group
	const lineRef = useRef<THREE.Line>(null!);
	const lineColor = "#e97d17"; // Define the color for the line
	const lineOpacity = 0.5; // Define the opacity for the line

	const { finished: threeLineAnimationDone, setFinished } =
		useThreeLineAnimation({ lineRef, duration: 0.5 }); // Custom hook to handle the line animation

	useEffect(() => {
		setFinished(false); // Reset the animation state when a new object is selected
	}, [selectedObject, setFinished]);

	const htmlRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useFrame(() => {
		if (groupRef.current && htmlRef.current && contentRef.current) {
			if (!UIScene) {
				console.warn("UIScene is not initialized");
				return; // Ensure UIScene is initialized before proceeding
			}
			// update store data
			UIScene.updateInfoBox(groupRef, htmlRef);
			if (!selectedObject) {
				groupRef.current.visible = false; // Hide the group if no object is selected
			} else {
				groupRef.current.visible = true; // Show the group if an object is selected
			}
		}
	});
	const Icon =
		AnatomyIcons[selectedObject?.layer as keyof typeof AnatomyIcons] || null;
	return (
		<>
			<group position={position} ref={groupRef}>
				<Html
					userData={{ type: "info-box" }}
					name={"info-box-container"}
					ref={htmlRef}
					visible={selectedObject ? true : false} // Only show the HTML when an object is selected
					// center
					//   distanceFactor={10}
					// translate="yes"
					position={htmlPosition}
					// renderOrder={-1}

					//   occlusionTest={false}
					//   occlude={bilboardRef}
					// transform={true}
					className="pointer-events-none "
				>
					<div
						className="absolute w-auto h-auto overflow-visible -translate-y-0.5 min-w-64 "
						style={{
							visibility: hasSelected ? "visible" : "hidden",
						}}
						ref={contentRef}
					>
						<span className="absolute left-0 right-0 h-10 flex flex-row items-center justify-between gap-2 -mt-12 text-2xl text-black/50 ">
							<span
								className="w-full h-10 transition-width duration-500 ease-in-out origin-left"
								style={{
									width: threeLineAnimationDone && hasSelected ? "100%" : "0%",
								}}
							>
								<p className="glass rounded-lg w-full max-w-48 h-10 p-0.5 pl-2 overflow-hidden items-center justify-start flex flex-row gap-2 text-nowrap ">
									{selectedObject?.layer && (
										<Icon className="text-black min-w-6 min-h-6" />
									)}

									{selectedObject?.readableName}
								</p>
							</span>
							<div
								className="flex items-center justify-center h-10 gap-2 p-1 rounded-lg glass duration-250 ease-in-out "
								style={{
									transform:
										threeLineAnimationDone && hasSelected
											? "translateX(0)"
											: "translateX(-100%)",
									opacity: threeLineAnimationDone && hasSelected ? 1 : 0,
								}}
							>
								<Info />
								<CircleX />
							</div>
						</span>

						<div
							className="absolute w-32 ml-2 -mt-12 rounded-lg aspect-square left-full glass ease-in-out origin-left duration-250 delay-250 transition-[opacity, transform, scale] pointer-events-none"
							style={{
								opacity: threeLineAnimationDone && hasSelected ? 1 : 0,
								transform:
									threeLineAnimationDone && hasSelected
										? "translateX(0) translateY(0)"
										: "translateX(1rem) translateY(1rem)",
								scale: threeLineAnimationDone && hasSelected ? 1 : 0.95,
							}}
						>
							<Canvas
								className="bg-transparent pointer-events-none"
								gl={{ alpha: true }}
							>
								<PartPreview htmlRef={htmlRef} />
							</Canvas>
						</div>

						<div
							className="relative h-1 mb-3 rounded-full transition-width duration-500 ease-in-out"
							style={{
								background: lineColor,

								width: threeLineAnimationDone && hasSelected ? "100%" : "0%",
							}}
						/>

						<div
							id="content"
							aria-hidden={threeLineAnimationDone && hasSelected}
							className="w-full glass h-auto min-h-16 rounded-md pointer-events-auto origin-top duration-250 delay-250 ease-in-out transition-[opacity, transform, scale] p-1 pl-2"
							style={{
								opacity: threeLineAnimationDone && hasSelected ? 1 : 0,
								scale: threeLineAnimationDone && hasSelected ? 1 : 0.95,
								transform:
									threeLineAnimationDone && hasSelected
										? "translateY(0)"
										: "translateY(1rem)",
							}}
						>
							<p>
								{selectedObject?.description ||
									"No description available for this part."}
							</p>
						</div>
					</div>
				</Html>

				<Line
					ref={lineRef}
					points={[0, 0, 0, htmlPosition.x, htmlPosition.y, htmlPosition.z]}
					color={lineColor}
					lineWidth={4}
				/>
			</group>
		</>
	);
}
