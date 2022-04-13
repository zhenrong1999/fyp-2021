import React from "react";
import { Loader, Provider, teamsTheme } from "@fluentui/react-northstar";

const description = "System is setting up in the background.";

export const LoadingPage: React.FunctionComponent = () => (
  <Provider theme={teamsTheme}>
    <Loader label={description} size="largest" labelPosition="below" />
  </Provider>
);
export default LoadingPage;
