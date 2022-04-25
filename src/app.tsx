import * as React from "react";
import * as ReactDOM from "react-dom";

import { LoadingPage } from "./Component/LoadingPage";
ReactDOM.render(<LoadingPage />, document.getElementById("mainBody"));

import { MainMenu } from "./Component/MainMenu";
ReactDOM.render(<MainMenu />, document.getElementById("mainBody"));
