import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import path from "path";
import fs from "fs";

export const EbookViewer: React.FunctionComponent = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [filePath, setFilePath] = useState(
    "file:///F:/Teh%20Zhen%20Rong/Downloads/PPSK_JW_Sem2_2021-2022.pdf"
  );
  function onDocumentLoadSuccess(numPages?: number) {
    setNumPages(numPages);
  }
  const buttonRef = React.useRef(null);

  async function openFile() {
    // @ts-expect-error
    let filePath = await window.electronAPI.openFile();
    setFilePath(filePath);
    // When the button is clicked, open the native file picker to select a PDF.
  }

  return (
    <div>
      <button ref={buttonRef} onClick={openFile}>
        Open PDF
      </button>
      <Document file={filePath}>
        <Page pageNumber={pageNumber} />
      </Document>

      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
};
