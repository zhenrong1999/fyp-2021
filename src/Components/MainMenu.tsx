import React from "react";
import { MainMindMap } from "./MindMap";
import { EbookManagement } from "./EbookManagement";
import {
  Provider,
  teamsTheme,
  Menu,
  MenuItemProps,
  Button,
} from "@fluentui/react-northstar";
import { LoadingPage } from "./Utils/LoadingPage";
import { SaveMindMap } from "./Utils/SaveMindMap";
import { AddNoteButton, EditNoteButton } from "./NoteComponents";
import { EbookBlobManagement } from "./EbookManagementComponents/EbookBlobManagement";
import { OpenMindMap } from "./Utils/OpenMindMap";
import { Interface } from "./MindMapComponents";

export const MainMenu: React.FunctionComponent = () => {
  const [MenuIndex, setMenuIndex] = React.useState(0);
  const [ebookBlobList, setEbookBlobList] = React.useState<EbookBlobManagement>(
    new EbookBlobManagement()
  );
  const [selectedEbookListIndex, setSelectedEbookListIndex] =
    React.useState(-1);
  const [graph, setGraph] = React.useState<Interface.MindData>(null);
  const [note, setNote] = React.useState("");

  function changePage(ev: React.SyntheticEvent, props: MenuItemProps): void {
    // eslint-disable-next-line react/prop-types
    console.log(props.index);
    // eslint-disable-next-line react/prop-types
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
          {
            key: "Resources2",
            content: "Resources2",
            onClick: changePage,
          },
        ]}
        primary
      />
      {MenuIndex === 0 && <MainMindMap graph={graph} setGraph={setGraph} />}
      {MenuIndex === 1 && (
        <EbookManagement
          selectedEbookListIndex={selectedEbookListIndex}
          setSelectedEbookListIndex={setSelectedEbookListIndex}
          ebookBlobClassObject={ebookBlobList}
          setEbookBlobClassObject={setEbookBlobList}
        />
      )}
      {/* {MenuIndex === 0 && <LoadingPage />}
      {MenuIndex === 1 && <LoadingPage />} */}
      {MenuIndex === 2 && <LoadingPage />}
      {MenuIndex === 3 && (
        <>
          <OpenMindMap
            setGraph={setGraph}
            ebookBlobClassObject={ebookBlobList}
            setEbookBlobClassObject={setEbookBlobList}
          />
          <SaveMindMap ebookBlobList={ebookBlobList} graph={graph} />
        </>
      )}
    </Provider>
  );
};
