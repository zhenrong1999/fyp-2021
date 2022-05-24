import * as React from "react";
import * as ReactDOM from "react-dom";

import { LoadingPage } from "./Components/LoadingPage";
ReactDOM.render(<LoadingPage />, document.getElementById("mainBody"));

import { MainMenu } from "./Components/MainMenu";
ReactDOM.render(<MainMenu />, document.getElementById("mainBody"));
