export const stripName = (name: string): string => {
	if (!name) return "";
	// Remove numbers at the end of the name
	const strippedName = name.replace(/_\d+$/, "");
	// Remove any trailing underscores
	return strippedName.replace(/_+$/, "");
};
