import React, { useState } from "react";

import { EbookList, EbookViewer } from "./EbookManagementComponents";

import { ProviderProps } from "@fluentui/react-northstar";
import "./EbookManagement.css";

export const EbookManagement: React.FunctionComponent<ProviderProps> = (
  props
) => {
  const buttonRef = React.useRef(null);
  const [filePath, setFilePath] = useState(
    "F:/Teh%20Zhen%20Rong/Downloads/PPSK_JW_Sem2_2021-2022.pdf"
  );

  async function openFile() {
    // When the button is clicked, open the native file picker to select a PDF.
    setFilePath(await window.api.files.openFile());
  }

  return (
    <>
      <EbookList className="ebookPanel" setFilePath={setFilePath} />
      {/* <button ref={buttonRef} onClick={openFile}>
        Open PDF
      </button> */}
      {/* <object data={filePath} type="application/pdf">
        <embed src={filePath} type="application/pdf" />x
        <div>No online PDF viewer installed</div>
      </object> */}
      {/* <iframe
        src={filePath}
        // referrerPolicy="unsafe-url"
        width="70%"
        height="100%"
      ></iframe> */}

      <EbookViewer className="pdfViewer" filePath={filePath} />
    </>
  );
};
