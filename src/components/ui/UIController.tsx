import BodyPreview from "./BodyPreview";
import SelectedInfoBox from "./infoBox";
import LayerSelector from "./LayerSelector";
import AnatomyList from "./AnatomyList";
import ToolBar from "./ToolBar";
import { SidebarProvider, SidebarTrigger } from "./sidebar";

export default function UIController() {
	return (
		<div className="fixed top-0 left-0 z-50 w-full h-full pointer-events-none">
			{/* <InfoBox
          title="Model Info"
          description="This is a 3D model of a skeleton."
          x={10}
          y={10}
          onClick={() => console.log("Info Box Clicked")}
        /> */}
			<ToolBar />
			<div className="absolute h-3/4 top-1/8 rounded-lg  left-4  w-12 glass">
				<LayerSelector />
			</div>

			<SidebarProvider>
				<SidebarTrigger
					size={"lg"}
					className="pointer-events-auto right-64 absolute"
				/>
				<AnatomyList />
			</SidebarProvider>
			<BodyPreview />
		</div>
	);
}
