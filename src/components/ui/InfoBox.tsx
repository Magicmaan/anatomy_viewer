interface InfoBoxProps {
	title: string;
	description: string;
	icon?: React.ReactNode;
	x?: number;
	y?: number;
	onClick?: () => void;
}

export default function InfoBox({
	title,
	description,
	icon,
	x = 0,
	y = 0,
	onClick,
}: InfoBoxProps) {
	return (
		<div
			className="container info-box"
			style={{ position: "absolute", left: x, top: y }}
			onClick={onClick}>
			{icon && <div className="icon">{icon}</div>}
			<h3 className="title">{title}</h3>
			<p className="description">{description}</p>
		</div>
	);
}
