// import * as React from "react";
// import * as ReactDOM from "react-dom";

// import { LoadingPage } from "./Components/LoadingPage";
// ReactDOM.render(<LoadingPage />, document.getElementById("mainBody"));

// import { MainMenu } from "./Components/MainMenu";
// ReactDOM.render(<MainMenu />, document.getElementById("mainBody"));

import { createRoot } from "react-dom/client";
const container = document.getElementById("mainBody");
const root = createRoot(container);

import { LoadingPage } from "./Components/LoadingPage";
root.render(<LoadingPage />);

import { MainMenu } from "./Components/MainMenu";
root.render(<MainMenu />);
