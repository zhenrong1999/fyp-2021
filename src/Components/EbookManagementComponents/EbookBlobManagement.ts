import React from "react";
import { pdfjs } from "react-pdf";
//importing types from pdfjs library
import { TypedArray, TextItem } from "pdfjs-dist/types/src/display/api";
pdfjs.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.js";
import { Buffer } from "buffer";

export interface EbookBlobInterface {
  EbookId: number;
  ebookBlob: string;
  text: string[];
}

export class EbookBlobManagement {
  ebookBlobList: EbookBlobInterface[] = [];

  constructor(ebookList?: EbookBlobManagement) {
    if (ebookList) {
      this.ebookBlobList = ebookList.exportEbookBlobList();
    }
  }
  addBook(ebook: EbookBlobInterface) {
    this.ebookBlobList.push(ebook);
  }

  deleteBook(id: number) {
    this.ebookBlobList = this.ebookBlobList.filter(
      (book) => book.EbookId !== id
    );
  }

  exportEbookBlobList() {
    return this.ebookBlobList;
  }

  importFromJson(json: string) {
    this.ebookBlobList = JSON.parse(json);
  }

  importFromArray(array: EbookBlobInterface[]) {
    this.ebookBlobList = array;
  }

  getEbookBlobById(id: number) {
    return this.ebookBlobList.find((book) => book.EbookId === id).ebookBlob;
  }

  searchEbookInit() {
    const getPageText = async (pdf: pdfjs.PDFDocumentProxy, pageNo: number) => {
      const page = await pdf.getPage(pageNo);
      const tokenizedText = await page.getTextContent();
      const pageText = tokenizedText.items
        .map((token: TextItem) => token.str)
        .join("");
      return pageText;
    };

    const getPDFText = async (source: TypedArray): Promise<string[]> => {
      const pdf = await pdfjs.getDocument(source).promise;
      const maxPages = pdf.numPages;
      const pageTextPromises = [];
      for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
        pageTextPromises.push(getPageText(pdf, pageNo));
      }
      const pageTexts = await Promise.all(pageTextPromises);
      return pageTexts;
    };

    this.ebookBlobList.forEach(async (book) => {
      book.text = await getPDFText(Buffer.from(book.ebookBlob, "base64"));
    });
  }
  searchAllText(searchText: string) {
    return this.ebookBlobList.filter((book) => {
      return book.text.join("\n").match(`/${searchText}/i`) !== undefined;
    });
  }
}

export interface EbookBlobManagementProps {
  ebookBlobClassObject: EbookBlobManagement;
}

export interface EbookBlobManagementEditableProps
  extends EbookBlobManagementProps {
  setEbookBlobClassObject: React.Dispatch<
    React.SetStateAction<EbookBlobManagement>
  >;
}
