import React from "react";
import { Alert, ProviderProps } from "@fluentui/react-northstar";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./TextLayer.css";
import { EbookViewerRequiredProps, globalData } from "../Global/interface";

interface EbookViewerProps
  extends ProviderProps,
    EbookViewerRequiredProps,
    globalData {}

export const EbookViewer: React.FunctionComponent<EbookViewerProps> = (
  props
) => {
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  function onDocumentLoadSuccess(pdf: pdfjs.PDFDocumentProxy) {
    const numPages = pdf.numPages;
    setNumPages(numPages);
  }

  if (props.selectedEbookListIndex > -1)
    return (
      <Document
        className="DocumentRendered"
        file={`data:application/pdf;base64,${props.fileBlob}`}
        onLoadSuccess={onDocumentLoadSuccess}
        renderMode="canvas"
        options={{
          cMapUrl: "/pdfjs-dist/cmaps/",
          cMapPacked: true,
        }}
      >
        {Array.from(new Array(numPages), (_el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    );
  else return <Alert info content="No ebook selected" />;
};
