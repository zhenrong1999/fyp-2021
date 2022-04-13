import React, { useState } from "react";

import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

export const EbookViewer: React.FunctionComponent = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  function onDocumentLoadSuccess(numPages?: number) {
    setNumPages(numPages);
  }

  const buttonRef = React.useRef(null);
  const [filePath, setFilePath] = useState(
    "F:/Teh%20Zhen%20Rong/Downloads/PPSK_JW_Sem2_2021-2022.pdf"
  );
  async function openFile() {
    // When the button is clicked, open the native file picker to select a PDF.
    setFilePath(await window.api.files.openFile());
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
        Page {pageNumber} of {numPages}{" "}
      </p>
    </div>
  );
};
