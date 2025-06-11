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
import { RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import PartPreview from "./partPreview";
import { group } from "console";

interface InfoBoxProps {
	title: string;
	description: string;
	icon?: React.ReactNode;
	x?: number;
	y?: number;
	onClick?: () => void;
}

const useThreeLineAnimation = (lineRef?: RefObject<THREE.Line>) => {
	// custom hook to handle the threejs line animation
	// this hook is used to animate the line in the 3d scene
	const progress = useRef(0);
	const [finished, setFinished] = useState(false);
	const dt = useRef(0); // delta time for the animation
	const animationLength = 0.5; // Length of the animation in seconds

	useEffect(() => {
		// progress.current = 0; // Reset progress when the component mounts
		// dt.current = 0; // Reset delta time when the component mounts
		return () => {
			if (finished) {
				// Cleanup function to reset progress and delta time when the component unmounts
				progress.current = 0;
				dt.current = 0; // Reset delta time
			}
			//   dt.current = 0;
			//   setFinished(false); // Reset finished state
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
				// this is used to trigger the html/css animation
				setFinished(true); // Set the state to true when animation is done
			}
			return; // Stop updating if progress is complete
		}
		dt.current += delta; // Update delta time
		progress.current = dt.current / animationLength; // Calculate progress based on delta time
		// progress.current += 0.01; // Increment progress of line animation

		// get points of line
		// structure is [x1, y1, z1, x2, y2, z2, ...]
		const start = lineRef.current.geometry.attributes.instanceStart.array;
		// modify z value of last point
		start[5] = progress.current * 2;
		lineRef.current.geometry.attributes.instanceStart.needsUpdate = true;
	});

	return { finished, setFinished };
};

export default function InfoBox() {
	const { camera, size } = useThree();
	const selected = useScene((state) => state.selected);

	const UIScene = useUIScene();
	const groupRef = useRef<THREE.Group>(null); // Reference to the group containing the HTML element and line
	const [position, setPosition] = useState<[number, number, number]>([0, 0, 2]);
	const htmlPosition = new THREE.Vector3(0, 0, 0); // Position of the HTML element relative to the group
	const lineRef = useRef<THREE.Line>(null);
	const lineColor = "#e97d17"; // Define the color for the line
	const lineOpacity = 0.5; // Define the opacity for the line

	const { finished: threeLineAnimationDone, setFinished } =
		useThreeLineAnimation(lineRef); // Custom hook to handle the line animation

	useEffect(() => {
		setFinished(false); // Reset the animation state when a new object is selected
		// update((prev) => prev + 1); // Trigger a re-render to update the component
	}, [selected, setFinished]);

	let dupe: THREE.Mesh | null = null;
	if (selected) {
		dupe = new THREE.Mesh(
			selected.geometry.clone(),
			new THREE.MeshBasicMaterial({
				color: "red",
			})
		);
		const offset = dupe.geometry.boundingBox?.getCenter(new THREE.Vector3());
		if (offset) {
			dupe.geometry.translate(-offset.x, -offset.y, -offset.z);
		}
		dupe.position.set(0, 0, 0);
		dupe.rotation.set(0, 0, 0);

		dupe.updateMatrix();
		dupe.updateMatrixWorld(true);
	}

	const htmlRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const bilboardRef = useRef<THREE.Group>(null);

	const portalMaterialRef = useRef<typeof MeshPortalMaterial | null>(null);

	useEffect(() => {
		if (htmlRef.current && contentRef.current) {
			const contentRect = contentRef.current.getBoundingClientRect();

			htmlRef.current.style.translate = `-${contentRect.width / 2}px 0`;
		}
	});

	const neighbourPosition = new THREE.Vector3(0, 0, 2);

	useFrame(() => {
		if (groupRef.current && htmlRef.current && contentRef.current) {
			if (!UIScene) {
				console.warn("UIScene is not initialized");
				return; // Ensure UIScene is initialized before proceeding
			}

			UIScene.updateInfoBox(groupRef, htmlRef);
		}
	});
	const previewRef = useRef<THREE.Group | null>(null);
	return (
		<>
			<group position={position} ref={groupRef}>
				<Html
					userData={{ type: "info-box" }}
					name={"info-box-container"}
					ref={htmlRef}
					// center
					//   distanceFactor={10}
					// translate="yes"
					position={htmlPosition}
					// renderOrder={-1}

					//   occlusionTest={false}
					//   occlude={bilboardRef}
					// transform={true}
					className="pointer-events-none ">
					<div
						className="absolute w-auto h-auto overflow-visible translate-x-1/2  -translate-y-0.5 min-w-64 "
						ref={contentRef}>
						<span className="absolute left-0 right-0 flex flex-row items-center justify-between gap-2 -mt-12 text-2xl text-black/50 ">
							<p className="glass rounded-lg w-full p-0.5 pl-2">Title</p>
							<div className="flex items-center justify-center h-10 gap-2 p-1 rounded-lg glass ">
								<Info />
								<CircleX />
							</div>
						</span>

						{/* <div className="absolute w-32 ml-2 -mt-12 rounded-lg aspect-square left-full glass"></div> */}

						<div
							className="relative h-1 mb-3 rounded-full "
							style={{
								background: lineColor,

								width: threeLineAnimationDone ? "100%" : "0%",
								transition: threeLineAnimationDone ? "width 0.5s ease-in-out" : "none",
							}}
						/>

						<div
							id="content"
							aria-hidden={threeLineAnimationDone}
							className={`w-full glass h-auto min-h-16 rounded-md pointer-events-auto origin-top duration-100 ease-in-out 
				
              ${threeLineAnimationDone ? " opacity-100 scale-100 transition-all" : "opacity-0 translate-y-4 scale-95 transition-none"} 
              `}></div>
					</div>
				</Html>

				{/* the part preview */}
				<PartPreview meshRef={previewRef} />
			</group>
			<Line
				ref={lineRef}
				points={[0, 0, 0, htmlPosition.x, htmlPosition.y, 2]}
				color={lineColor}
				lineWidth={4}
			/>
		</>
	);
}
