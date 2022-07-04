import React, { useState } from "react";

import { EbookList, EbookViewer } from ".";

import { ProviderProps, Flex } from "@fluentui/react-northstar";
import "./EbookManagement.css";
import {
  IEbooksContent,
  EbookBlobManagementEditableProps,
  MindMapEditorContextProps,
  MindMapInterface,
} from "../Global/interface";
import { EbookManagementRightPanel } from "./EbookManagementRightPanel";

interface EbookManagementProps
  extends ProviderProps,
    EbookBlobManagementEditableProps,
    MindMapEditorContextProps {
  setGraphClass: (graph: MindMapInterface.Graph) => void;
  ebookSelected: IEbooksContent;
  setEbookSelected: (ebook: IEbooksContent) => void;
}

export const EbookManagement: React.FunctionComponent<EbookManagementProps> = (
  props
) => {
  const [fileBlob, setFileBlob] = useState<string>();

  React.useEffect(() => {
    console.log("Selected Ebook Index is ", props.ebookSelected);
  }, [props.ebookSelected]);
  const divStyle = {
    flex: 1,
    overflow: "hidden",
    height: "100%",
  };
  return (
    <div style={divStyle}>
      {/* <Flex fill style={divStyle}> */}
      {/* <Flex.Item className="ebookManagementLeftPanel"> */}
      <EbookList
        className="ebookManagementLeftPanel"
        ebookSelected={props.ebookSelected}
        setEbookSelected={props.setEbookSelected}
        setFileBlob={setFileBlob}
        {...props}
      />
      {/* </Flex.Item> */}
      {/* </Flex> */}
      {/* <Flex.Item grow className="pdfViewer"> */}

      <EbookManagementRightPanel
        className="ebookManagementRightPanel"
        ebookSelected={props.ebookSelected}
        setEbookSelected={props.setEbookSelected}
        {...props}
      />

      <EbookViewer
        className="pdfViewer"
        fileBlob={fileBlob}
        ebookSelected={props.ebookSelected}
        setEbookSelected={props.setEbookSelected}
        {...props}
      />
      {/* <Flex fill style={divStyle}> */}
      {/* <Flex.Item push className="ebookManagementRightPanel"> */}

      {/* </Flex.Item> */}
      {/* </Flex> */}
    </div>
  );
};
