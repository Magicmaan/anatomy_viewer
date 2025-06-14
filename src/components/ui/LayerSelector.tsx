import { Slider } from "@/components/ui/slider";
import SkinIcon from "@/assets/textures/skin.png";
import MuscleIcon from "@/assets/textures/muscle.png";
import BoneIcon from "@/assets/textures/bone.png";
import OrganIcon from "@/assets/textures/organ.png";
import { useEffect, useRef, useState } from "react";
import useScene from "@/store/store";

export default function LayerSelector() {
	const store = useScene();

	const iconStyleBG =
		"w-8 aspect-square m-l-auto pixel-img pointer-events-none select-none bg-slider-track border-1 border-slider-border p-0.5 rounded-full shadow-lg bg-no-repeat bg-center bg-contain flex justify-center items-center first:[&_span]:mt-2 last:[&_span]:mb-2";
	const iconMask = "fixed bg-slider-track w-[0.9rem] h-8";
	const iconStyle =
		"w-full z-10 aspect-square pixel-img pointer-events-none select-none p-0.5 ";

	const largeLine = <div className="w-10 h-0.5 bg-white/50 " />;
	const SmallLine = <div className="w-4 h-0.5 bg-white/25" />;

	const [currentValue, setCurrentValue] = useState(50);

	return (
		<>
			<div className="fixed flex flex-col justify-between w-full pointer-events-auto group h-96">
				<div
					id="slider-tags-container"
					className="absolute z-10 flex flex-col justify-between w-auto h-full py-16 transition-opacity duration-500 ease-in-out opacity-0 pointer-events-none group group-hover:opacity-100 "
					style={{
						maskImage: `linear-gradient(to bottom, transparent, black ${100 - currentValue}%, transparent)`,
						maskSize: "100% 100%",
					}}
				>
					<div className="flex flex-row items-center justify-start w-full h-0.5 gap-4">
						{largeLine} <span>Skin</span>
					</div>
					{SmallLine}
					{SmallLine}
					{SmallLine}
					<div className="flex flex-row items-center justify-start w-full h-0.5 gap-4">
						{largeLine} <span>Muscle</span>
					</div>
					{SmallLine}
					{SmallLine}
					{SmallLine}

					<div className="flex flex-row items-center justify-start w-full h-0.5 gap-4">
						{largeLine} <span>Skeleton</span>
					</div>
					{SmallLine}
					{SmallLine}
					{SmallLine}
					<div className="flex flex-row items-center justify-start w-full h-0.5 gap-4">
						{largeLine} <span className="text-nowrap">Organs</span>
					</div>
				</div>
				<div
					id="slider-images-container "
					className="absolute z-10 flex flex-col items-center justify-between w-full h-full px-1 py-12 pointer-events-none group "
					style={{
						maskImage: `linear-gradient(to bottom, transparent, black ${100 - currentValue}%)`,
						maskSize: "100% 100%",
					}}
				>
					<div className={iconStyleBG}>
						<img src={SkinIcon} alt="Skin Layer" className={iconStyle} />
						<span className={iconMask} />
					</div>
					<div className={iconStyleBG}>
						<img src={MuscleIcon} alt="Skin Layer" className={iconStyle} />
						<div className={iconMask} />
					</div>
					<div className={iconStyleBG}>
						<img src={BoneIcon} alt="Skin Layer" className={iconStyle} />
						<span className={iconMask} />
					</div>

					<div className={iconStyleBG}>
						<img src={OrganIcon} alt="Skin Layer" className={iconStyle} />
						<span className={iconMask} />
					</div>

					{/* <img src={MuscleIcon} alt="Muscle Layer" className={iconStyle} />

					<img src={BoneIcon} alt="Bone Layer" className={iconStyle} /> */}
				</div>
				<Slider
					id="layer-slider"
					defaultValue={[100]}
					max={100}
					step={1}
					orientation="vertical"
					className="my-12"
					onValueChange={(value) => {
						console.log("Slider value changed:", value);
						setCurrentValue(value[0]);
						store.setLayer(1 - value[0] / 100);
					}}
				></Slider>
			</div>
			{/* <p className="absolute top-40 left-20">Currently selected: {store.anatomyLayer}</p> */}
		</>
	);
}
