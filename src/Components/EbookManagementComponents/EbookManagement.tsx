import React, { useState } from "react";

import { EbookList, EbookViewer } from ".";

import { ProviderProps, Flex } from "@fluentui/react-northstar";
import "./EbookManagement.css";
import {
  IEbooksContent,
  EbookBlobManagementEditableProps,
  MindMapEditorContextProps,
  MindMapInterface,
  ebookSelected,
} from "../Global/interface";
import { EbookManagementRightPanel } from "./EbookManagementRightPanel";

interface EbookManagementProps
  extends ProviderProps,
    EbookBlobManagementEditableProps,
    MindMapEditorContextProps,
    ebookSelected {
  setGraphClass: (graph: MindMapInterface.Graph) => void;
  setEbookSelectedMain: (ebookSelected: IEbooksContent) => void;
}

export const EbookManagement: React.FunctionComponent<EbookManagementProps> = (
  props
) => {
  const [fileBlob, setFileBlob] = useState<string>();

  const divStyle = {
    flex: 1,
    overflow: "hidden",
    height: "100%",
  };
  const [ebookSelected, setEbookSelected] = React.useState<string>(
    props.ebookSelected
  );
  React.useEffect(() => {
    console.log("Selected Ebook Index is ", ebookSelected);
  }, [ebookSelected]);
  React.useEffect(() => {
    return () => {
      props.setEbookSelectedMain(JSON.parse(ebookSelected));
    };
  });
  function onChange(ebook: IEbooksContent) {
    setEbookSelected(JSON.stringify(ebook));
  }

  return (
    <div style={divStyle}>
      <EbookList
        {...props}
        className="ebookManagementLeftPanel"
        ebookSelected={ebookSelected}
        setEbookSelected={onChange}
        setFileBlob={setFileBlob}
      />

      <EbookManagementRightPanel
        {...props}
        className="ebookManagementRightPanel"
        ebookSelected={ebookSelected}
        // setEbookSelected={onChange}
      />

      <EbookViewer
        {...props}
        className="pdfViewer"
        fileBlob={fileBlob}
        ebookSelected={ebookSelected}
        // setEbookSelected={onChange}
      />
    </div>
  );
};
