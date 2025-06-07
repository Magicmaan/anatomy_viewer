import { useFrame, useThree } from "@react-three/fiber";
import {
	Container,
	FontFamilyProvider,
	Fullscreen,
	Root,
	Text,
} from "@react-three/uikit";
import { useXRInputSourceEvent, XRDomOverlay } from "@react-three/xr";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { getCameraPosition, getCameraQuaternion } from "@/util/util";
import { Button } from "@react-three/uikit-default";
import TextBox from "@/components/ui/textBox";
import ThaleahFat from "../../assets/fonts/ThaleahFat.json";
import useScene from "@/store/store";
import { MODEL_TEXT } from "@/constants/models";

export default function UIController() {
	const ref = useRef<THREE.Group>(null!);
	const buttonRef = useRef(null!);
	const currentSelected = useRef("");
	const { scene } = useThree();
	const model = scene.getObjectByName("model");
	const [text, setText] = useState("Hello World");
	const [titleText, setTitleText] = useState("hello");

	return (
		<group ref={ref} position={[0, 0, -1]} rotation={[0, 0, 0]}>
			<Suspense fallback={null}>
				<Fullscreen
					pointerEvents={"listener"}
					flexDirection={"column"}
					justifyContent={"center"}
					alignItems={"center"}>
					{/* <FontFamilyProvider> */}

					<Text fontSize={16} color={"black"}>
						{titleText}
					</Text>
				</Fullscreen>
			</Suspense>
			{/* </Root> */}
		</group>
	);
}
