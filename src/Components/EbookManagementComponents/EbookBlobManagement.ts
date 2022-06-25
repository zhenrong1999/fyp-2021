import React from "react";

export interface EbookBlobInterface {
  EbookId: number;
  ebookBlob: string;
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
