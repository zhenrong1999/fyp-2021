import React from "react";
import ReactDOM from "react-dom";
import { MainMindMap } from "./MindMap";
import { EbookManagement } from "./EbookManagement";
import {
  Provider,
  teamsTheme,
  Menu,
  Header,
  MenuItemProps,
} from "@fluentui/react-northstar";
import { LoadingPage } from "./LoadingPage";

const divRef = React.createRef<HTMLDivElement>();

export const MainMenu: React.FunctionComponent = () => {
  const [MenuIndex, setMenuIndex] = React.useState(0);
  function changePage(ev: React.SyntheticEvent, props: MenuItemProps): void {
    // const index = ev.currentTarget;
    console.log(props.index);
    setMenuIndex(props.index);
  }
  return (
    <Provider theme={teamsTheme}>
      <Menu
        defaultActiveIndex={0}
        items={[
          {
            key: "MindMapCanvas",
            content: "Mind Map Canvas",
            onClick: changePage,
          },
          {
            key: "Ebook",
            content: "Ebook",
            onClick: changePage,
          },
          {
            key: "Resources",
            content: "Resources",
            onClick: changePage,
          },
        ]}
        primary
      />
      {MenuIndex === 0 && <MainMindMap />}
      {MenuIndex === 1 && <EbookManagement />}
      {MenuIndex === 2 && <LoadingPage />}
      <div ref={divRef}></div>
    </Provider>
  );
};

// import {
//   IStyleSet,
//   Label,
//   ILabelStyles,
//   Pivot,
//   PivotItem,
// } from "@fluentui/react";

// const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
//   root: { marginTop: 10 },
// };

// export const MainMenu: React.FunctionComponent = () => {
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
//     </>
//   );
// };
