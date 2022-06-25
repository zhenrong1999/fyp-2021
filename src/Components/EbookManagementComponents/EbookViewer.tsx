import React, { useEffect } from "react";
import { Alert, List, ProviderProps } from "@fluentui/react-northstar";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./TextLayer.css";
import { EbookViewerRequiredProps, ebookSelected } from "../Global/interface";

interface EbookViewerProps
  extends ProviderProps,
    EbookViewerRequiredProps,
    ebookSelected {
  style?: React.CSSProperties;
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
  useEffect(() => {
    console.log("EbookViewer", props.ebookSelected);
  }, [props.ebookSelected]);

  if (props.ebookSelected && props.ebookSelected.EbookId > -1)
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
  else return <Alert info content="No ebook selected" style={props.style} />;
};
