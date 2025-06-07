import { createRoot } from "react-dom/client";
import App from "./src/App";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
