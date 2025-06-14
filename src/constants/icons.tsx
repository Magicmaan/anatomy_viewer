import { BicepsFlexed, Bone, Hand, StickerIcon } from "lucide-react";
import { AnatomyLayers } from "./localisation";
import { ANATOMY_PARTS } from "./strings";

export const AnatomyIcons: {
	[key in AnatomyLayers]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
	skin: Hand,
	muscle: BicepsFlexed,
	skeleton: Bone,
	bone: Bone,
	organs: StickerIcon,
};
