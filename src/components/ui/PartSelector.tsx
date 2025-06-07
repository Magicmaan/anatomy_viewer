import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function PartSelector() {
	const [open, setOpen] = useState(false);
	const expandButtonRef = useRef<HTMLSpanElement>(null);
	const handleExpand = useCallback(() => {
		if (expandButtonRef.current) {
			// Logic to expand or collapse the part selector
			console.log("Expand button clicked");
			setOpen((prev) => !prev);
		}
	}, [expandButtonRef]);
	const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		e.preventDefault();
		handleExpand();
	};

	return (
		<div
			className="fixed top-0 right-0 z-50 w-64 h-full p-4 transition-transform duration-300 ease-in-out bg-gray-800 bg-opacity-75 shadow-lg pointer-events-auto rounded-l-md"
			id="part-selector-panel"
			style={{
				transform: open ? "translateX(0)" : "translateX(95%)",
			}}>
			<div className="flex flex-col gap-4 ">
				<h3 className="mb-2 text-lg font-medium text-white">Select Part</h3>
				<ul className="space-y-2">
					<li>
						<button className="w-full px-4 py-2 text-left text-white bg-blue-600 rounded hover:bg-blue-700">
							Select Part 1
						</button>
					</li>
					<li>
						<button className="w-full px-4 py-2 text-left text-white bg-blue-600 rounded hover:bg-blue-700">
							Select Part 2
						</button>
					</li>
					<li>
						<button className="w-full px-4 py-2 text-left text-white bg-blue-600 rounded hover:bg-blue-700">
							Select Part 3
						</button>
					</li>
				</ul>
			</div>
			<div className="fixed flex items-center justify-start w-10 h-10 text-white bg-gray-800 rounded-md -z-50 top-1/2 -translate-3/4 ">
				<span
					ref={expandButtonRef}
					className="flex items-center justify-center h-full hover:cursor-pointer"
					onPointerDown={onPointerDown}
					style={{
						transform: open ? "scaleX(-1)" : "scaleX(1)",
						transition: "transform 0.8s ease-out",
					}}>
					<ChevronLeft />
				</span>
			</div>
		</div>
	);
}
