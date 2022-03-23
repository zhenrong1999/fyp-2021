import * as React from "react";
import * as ReactDOM from "react-dom";
import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";

export const LoadingPage: React.FunctionComponent = () => (
  <ProgressIndicator
    label="Hello, world!"
    description="System is setting up in the background."
    barHeight={20}
  />
);

function render() {
  ReactDOM.render(<LoadingPage />, document.body);
}

render();
