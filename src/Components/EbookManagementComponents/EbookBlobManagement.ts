import { IEbooksContent } from "../../Database";
import React from "react";

interface EbookBlobManagementInterface extends IEbooksContent {
  ebookBlob: string;
}

export class EbookBlobManagement {
  ebookBlobList: EbookBlobManagementInterface[] = [];

  constructor(ebookList?: EbookBlobManagement) {
    if (ebookList) {
      this.ebookBlobList = ebookList.export();
    }
  }
  addBook(ebook: EbookBlobManagementInterface) {
    this.ebookBlobList.push(ebook);
  }

  deleteBook(id: number) {
    this.ebookBlobList = this.ebookBlobList.filter(
      (book) => book.EbookId !== id
    );
  }

  updateBook(ebook: EbookBlobManagementInterface) {
    this.ebookBlobList = this.ebookBlobList.map((book) => {
      if (book.fileHash === ebook.fileHash) {
        return ebook;
      }
      return book;
    });
  }

  export() {
    return this.ebookBlobList;
  }

  exportToJson() {
    return JSON.stringify(this.export());
  }

  importFromJson(json: string) {
    this.ebookBlobList = JSON.parse(json);
  }

  importFromArray(array: EbookBlobManagementInterface[]) {
    this.ebookBlobList = array;
  }

  getEbookBlobById(id: number) {
    return this.ebookBlobList.find((book) => book.EbookId === id).ebookBlob;
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
