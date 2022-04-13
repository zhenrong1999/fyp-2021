import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { MainMindMap } from "./MindMap";
import { EbookViewer } from "./EbookViewer";
import { Provider, teamsTheme, Menu, Header } from "@fluentui/react-northstar";
import LoadingPage from "./LoadingPage";

// };
// import {
//   IStyleSet,
//   Label,
//   ILabelStyles,
//   Pivot,
//   PivotItem,
// } from "@fluentui/react";
// import { MainMindMap } from "./Component/MindMap";
// import { EbookViewer } from "./Component/EbookViewer";

// const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
//   root: { marginTop: 10 },
// };

// export const PivotBasicExample: React.FunctionComponent = () => {
//   return (
//     <>
//       <Pivot style={{ width: "100%" }} aria-label="Navigation">
//         <PivotItem
//           headerText="Mind Map Canvas"
//           headerButtonProps={{
//             "data-order": 1,
//             "data-title": "Mind Map Title",
//           }}
//         >
//           <MainMindMap />
//         </PivotItem>
//         <PivotItem headerText="Ebook">
//           <Label styles={labelStyles}>Ebook Management</Label>
//           <EbookViewer />
//         </PivotItem>
//         <PivotItem headerText="Resources">
//           <Label styles={labelStyles}>Pivot #3</Label>
//         </PivotItem>
//       </Pivot>
//       {/* <PanelNonModalExample /> */}
//     </>
//   );
// };
const divRef = React.createRef<HTMLDivElement>();

export const MainMenu: React.FunctionComponent = () => {
  function changePage(key: string): void {
    if (key === "MindMapCanvas") {
      ReactDOM.render(<MainMindMap />, divRef.current);
    } else if (key === "Ebook") {
      ReactDOM.render(<EbookViewer />, divRef.current);
    } else if (key === "Resources") {
      ReactDOM.render(
        <>
          <Header content="Under Construction" />
          <LoadingPage />
        </>,
        divRef.current
      );
    }
  }
  useEffect(() => {
    changePage("MindMapCanvas");
  }, []);
  return (
    <Provider theme={teamsTheme}>
      <Menu
        defaultActiveIndex={0}
        items={[
          {
            key: "MindMapCanvas",
            content: "Mind Map Canvas",
            onClick: () => changePage("MindMapCanvas"),
          },
          {
            key: "Ebook",
            content: "Ebook",
            onClick: () => changePage("Ebook"),
          },
          {
            key: "Resources",
            content: "Resources",
            onClick: () => changePage("Resources"),
          },
        ]}
        primary
      />
      <div ref={divRef}></div>
    </Provider>
  );
};
