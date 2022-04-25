import React from "react";
import { ProviderProps } from "@fluentui/react-northstar";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "../../assets/TextLayer.css";
import Frame from "react-frame-component";
interface EbookViewerProps extends ProviderProps {
  filePath: string;
}

export const EbookViewer: React.FunctionComponent<EbookViewerProps> = (
  props
) => {
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  function onDocumentLoadSuccess(pdf: pdfjs.PDFDocumentProxy) {
    const numPages = pdf.numPages;
    setNumPages(numPages);
  }
  return (
    // <Frame
    //   initialContent='<!DOCTYPE html><html>
    //   <head><meta
    //   http-equiv="Content-Security-Policy"
    //   content="default-src "unsafe-inline" data: file: *; "
    //   />
    // </head><body><div id="mountHere"></div></body></html>'
    //   mountTarget="#mountHere"
    //   style={{ width: "70%", height: "100%" }}
    // >
    <Document
    className='DocumentRendered'
      file={props.filePath}
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
  {
    /* </Frame> */
  }
};
