import { useEffect, useRef } from "react";

const drawBodyPreview = (canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	const scale = 1;
	const spacing = 10;

	// Calculate the canvas center
	const canvasWidth = canvas.width / scale;
	const canvasHeight = canvas.height / scale;
	const centerX = canvasWidth / 2;
	const centerY = canvasHeight / 2;

	// Define body part dimensions (based on Minecraft skin proportions)
	const headWidth = 64; // 8 pixels in Minecraft * 8 scale factor
	const headHeight = 64; // 8 pixels in Minecraft * 8 scale factor
	const bodyWidth = 48; // 8 (torso) * 6 scale factor
	const bodyHeight = 72; // 12 pixels in Minecraft * 6 scale factor
	const armWidth = 24; // 4 pixels in Minecraft * 6 scale factor
	const armHeight = 72; // 12 pixels in Minecraft * 6 scale factor
	const legWidth = 24; // 4 pixels in Minecraft * 6 scale factor
	const legHeight = 72; // 12 pixels in Minecraft * 6 scale factor

	// Calculate positions relative to center
	const head: [number, number, number, number] = [
		centerX - headWidth / 2,
		centerY - (headHeight + bodyHeight + spacing + legHeight + spacing * 2) / 2,
		headWidth,
		headHeight,
	];

	const body: [number, number, number, number] = [
		centerX - bodyWidth / 2,
		head[1] + head[3] + spacing,
		bodyWidth,
		bodyHeight,
	];

	const leftArm: [number, number, number, number] = [
		body[0] - armWidth - spacing,
		body[1],
		armWidth,
		armHeight,
	];

	const rightArm: [number, number, number, number] = [
		body[0] + bodyWidth + spacing,
		body[1],
		armWidth,
		armHeight,
	];

	const leftLeg: [number, number, number, number] = [
		centerX - legWidth - spacing / 2,
		body[1] + bodyHeight + spacing,
		legWidth,
		legHeight,
	];

	const rightLeg: [number, number, number, number] = [
		centerX + spacing / 2,
		body[1] + bodyHeight + spacing,
		legWidth,
		legHeight,
	];

	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw a simple body preview (a red square for demonstration)
	ctx.fillStyle = "red";
	ctx.scale(scale, scale);
	ctx.fillRect(...head);
	ctx.fillRect(...body);
	ctx.fillRect(...leftArm);
	ctx.fillRect(...rightArm);
	ctx.fillRect(...leftLeg);
	ctx.fillRect(...rightLeg);
	ctx.scale(1 / scale, 1 / scale);
};

export default function BodyPreview() {
	const headSize = 24;
	const torsoHeight = 48;
	const appendageWidth = 12;
	const gap = 4;

	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (ref.current) {
			const rightPanel = document.getElementById("part-selector-panel");
			if (!rightPanel) return;
		}
	}, []);

	return (
		<div
			ref={ref}
			className="absolute bottom-0 right-0 z-50 w-auto h-auto p-2 m-5 bg-white bg-opacity-75 rounded shadow-lg">
			<div className="relative w-auto h-auto bg-gray-300 aspect-square">
				<div className="flex flex-col items-center w-32 h-32 gap-1 p-1 justify-evenly">
					<div
						className="bg-red-500 rounded-xs aspect-square"
						style={{ width: `auto`, height: `25%` }}
					/>

					<div className="flex flex-row w-1/2 gap-1 h-3/8 ">
						<div
							className="bg-red-400 rounded-xs "
							style={{ width: `25%`, height: `100%` }}
						/>
						<div
							className="bg-red-500 rounded-xs "
							style={{ width: `50%`, height: `100%` }}
						/>
						<div
							className="bg-red-400 rounded-xs "
							style={{ width: `25%`, height: `100%` }}
						/>
					</div>
					<div className="flex flex-row w-1/4 gap-1 px-0.5 h-3/8 ">
						<div
							className="bg-red-500 rounded-xs "
							style={{ width: `50%`, height: `100%` }}
						/>
						<div
							className="bg-red-500 rounded-xs "
							style={{ width: `50%`, height: `100%` }}
						/>
					</div>
				</div>
			</div>
		</div>
		// </div>
	);
}
