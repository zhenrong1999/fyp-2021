import * as React from "react";
import * as ReactDOM from "react-dom";

import * as fontImport from "@fluentui/font-icons-mdl2";
fontImport.initializeIcons("fonts/", {
  disableWarnings: true,
});

import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";

export const LoadingPage: React.FunctionComponent = () => (
  <ProgressIndicator
    label="Hello, world!"
    description="System is setting up in the background."
    barHeight={20}
  />
);

function render() {
  ReactDOM.render(<LoadingPage />, document.getElementById("mainBody"));
}

render();

import { DefaultButton } from "@fluentui/react/lib/Button";
import { Panel } from "@fluentui/react/lib/Panel";
import { useBoolean } from "@fluentui/react-hooks";

const explanation =
  "This panel is non-modal: even when it's open, it allows interacting with content outside the panel.";

export const PanelNonModalExample: React.FunctionComponent = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);

  return (
    <div>
      {explanation}
      <br />
      <br />
      <DefaultButton text="Open panel" onClick={openPanel} />
      <Panel
        headerText="Non-modal panel"
        // this prop makes the panel non-modal
        isBlocking={false}
        isOpen={isOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel="Close"
        hasCloseButton={true}
      >
        <p>{explanation}</p>
      </Panel>
    </div>
  );
};

import {
  IStyleSet,
  Label,
  ILabelStyles,
  Pivot,
  PivotItem,
} from "@fluentui/react";
import "./Component/MindMap";
import { MainMindMap } from "./Component/MindMap";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 },
};

export const PivotBasicExample: React.FunctionComponent = () => {
  return (
    <>
      <Pivot aria-label="Basic Pivot Example">
        <PivotItem
          headerText="My Files"
          headerButtonProps={{
            "data-order": 1,
            "data-title": "My Files Title",
          }}
        >
          <MainMindMap />
        </PivotItem>
        <PivotItem headerText="Recent">
          <Label styles={labelStyles}>Pivot #2</Label>
        </PivotItem>
        <PivotItem headerText="Shared with me">
          <Label styles={labelStyles}>Pivot #3</Label>
        </PivotItem>
      </Pivot>
      <PanelNonModalExample />
    </>
  );
};

ReactDOM.render(<PivotBasicExample />, document.getElementById("mainBody"));
