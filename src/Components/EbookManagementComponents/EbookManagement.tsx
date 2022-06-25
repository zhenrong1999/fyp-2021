import React, { useState } from "react";

import { EbookList, EbookViewer } from ".";

import { ProviderProps, Flex } from "@fluentui/react-northstar";
import "./EbookManagement.css";
import {
  IEbooksContent,
  EbookBlobManagementEditableProps,
  ebookSelected,
  MindMapEditorContextProps,
  MindMapInterface,
} from "../Global/interface";
import { EbookManagementRightPanel } from "./EbookManagementRightPanel";

interface EbookManagementProps
  extends ProviderProps,
    EbookBlobManagementEditableProps,
    MindMapEditorContextProps {
  setGraphClass: (graph: MindMapInterface.Graph) => void;
  // ebookSelected
}

export const EbookManagement: React.FunctionComponent<EbookManagementProps> = (
  props
) => {
  const [ebookSelected, setEbookSelected] = useState<IEbooksContent>({
    EbookId: -1,
    title: "",
    fileHash: "",
    NoteList: [],
  });
  const [fileBlob, setFileBlob] = useState<string>();
  React.useEffect(() => {
    console.log("Selected Ebook Index is ", ebookSelected);
  }, [ebookSelected]);
  const divStyle = {
    flex: 1,
    overflow: "hidden",
    height: "100%",
  };
  return (
    <>
      {/* <Flex fill style={divStyle}> */}
      {/* <Flex.Item className="ebookManagementLeftPanel"> */}
      <EbookList
        className="ebookManagementLeftPanel"
        ebookSelected={ebookSelected}
        setEbookSelected={setEbookSelected}
        setFileBlob={setFileBlob}
        {...props}
      />
      {/* </Flex.Item> */}
      {/* </Flex> */}
      {/* <Flex.Item grow className="pdfViewer"> */}

      <EbookManagementRightPanel
        className="ebookManagementRightPanel"
        ebookSelected={ebookSelected}
        setEbookSelected={setEbookSelected}
        {...props}
      />

      <EbookViewer
        className="pdfViewer"
        // style={divStyle}
        fileBlob={fileBlob}
        ebookSelected={ebookSelected}
        setEbookSelected={setEbookSelected}
        {...props}
      />
      {/* <Flex fill style={divStyle}> */}
      {/* <Flex.Item push className="ebookManagementRightPanel"> */}

      {/* </Flex.Item> */}
      {/* </Flex> */}
    </>
  );
};
