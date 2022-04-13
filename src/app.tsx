import * as React from "react";
import * as ReactDOM from "react-dom";

import * as fontImport from "@fluentui/font-icons-mdl2";
fontImport.initializeIcons("fonts/", {
  disableWarnings: true,
});

import { LoadingPage } from "./Component/LoadingPage";
ReactDOM.render(<LoadingPage />, document.getElementById("mainBody"));

// import { DefaultButton } from "@fluentui/react/lib/Button";
// import { Panel } from "@fluentui/react/lib/Panel";
// import { useBoolean } from "@fluentui/react-hooks";

// const explanation =
//   "This panel is non-modal: even when it's open, it allows interacting with content outside the panel.";

// export const PanelNonModalExample: React.FunctionComponent = () => {
//   const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
//     useBoolean(false);

//   return (
//     <div>
//       {explanation}
//       <br />
//       <br />
//       <DefaultButton text="Open panel" onClick={openPanel} />
//       <Panel
//         headerText="Non-modal panel"
//         // this prop makes the panel non-modal
//         isBlocking={false}
//         isOpen={isOpen}
//         onDismiss={dismissPanel}
//         closeButtonAriaLabel="Close"
//         hasCloseButton={true}
//       >
//         <p>{explanation}</p>
//       </Panel>
//     </div>
//   );
// };

import { MainMenu } from "./Component/MainMenu";
ReactDOM.render(<MainMenu />, document.getElementById("mainBody"));
