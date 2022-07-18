import { createRoot } from "react-dom/client";
const container = document.getElementById("mainBody");
const root = createRoot(container);

import { LoadingPage } from "./Components/Utils/LoadingPage";
root.render(<LoadingPage />);

import { MainMenu } from "./Components/MainMenu";
root.render(<MainMenu />);
