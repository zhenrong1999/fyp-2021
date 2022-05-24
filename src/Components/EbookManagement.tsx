import React, { useState } from "react";

import { EbookList, EbookViewer } from "./EbookManagementComponents";

import { ProviderProps, Flex } from "@fluentui/react-northstar";
import "./EbookManagement.css";

export const EbookManagement: React.FunctionComponent<ProviderProps> = (
  props
) => {
  const [filePath, setFilePath] = useState(
    "F:/Teh%20Zhen%20Rong/Downloads/PPSK_JW_Sem2_2021-2022.pdf"
  );
  const [fileBlob, setFileBlob] = useState<string>();

  return (
    <>
      {/* <Flex gap="gap.small"> */}
      <EbookList
        className="ebookPanel"
        setFilePath={setFilePath}
        setFileBlob={setFileBlob}
      />
      <EbookViewer
        className="pdfViewer"
        filePath={filePath}
        fileBlob={fileBlob}
      />
      {/* </Flex> */}
    </>
  );
};
