import React, { useState } from "react";

import { EbookList, EbookViewer } from "./EbookManagementComponents";

import { ProviderProps, Flex } from "@fluentui/react-northstar";
import "./EbookManagement.css";
import {
  EbookBlobManagementEditableProps,
  globalData,
} from "./Global/interface";

interface EbookManagementProps
  extends ProviderProps,
    EbookBlobManagementEditableProps,
    globalData {}

export const EbookManagement: React.FunctionComponent<EbookManagementProps> = (
  props
) => {
  const [fileBlob, setFileBlob] = useState<string>();

  return (
    <>
      {/* <Flex gap="gap.small"> */}
      <EbookList className="ebookPanel" setFileBlob={setFileBlob} {...props} />
      <EbookViewer className="pdfViewer" fileBlob={fileBlob} {...props} />

      {/* </Flex> */}
    </>
  );
};
