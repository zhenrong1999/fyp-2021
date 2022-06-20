import React from "react";
import { Loader, ProviderProps, teamsTheme } from "@fluentui/react-northstar";

const description = "System is setting up in the background.";

export const LoadingPage: React.FunctionComponent<ProviderProps> = () => (
  <Loader label={description} size="largest" labelPosition="below" />
);
