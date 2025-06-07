export default function ToolBar() {
	return (
		<div className="fixed z-50 w-1/4 h-10 bg-red-500 rounded-4xl left-3/8 top-4">
			<div className="flex flex-row items-center justify-between h-full px-4">
				<button className="px-4 py-2 text-black bg-white rounded">Button 1</button>
				<button className="px-4 py-2 text-black bg-white rounded">Button 2</button>
				<button className="px-4 py-2 text-black bg-white rounded">Button 3</button>
			</div>
		</div>
	);
}
