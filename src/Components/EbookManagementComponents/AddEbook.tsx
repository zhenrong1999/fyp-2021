import React from "react";
import { Button } from "@fluentui/react-northstar";
import { dbClass, db } from "../../Database/index";
import { SHA256 } from "crypto-js";
import {
  EbookBlobManagementEditableProps,
  EbookViewerSettingProps,
} from "../Global/interface";

export interface AddEbookProps extends EbookBlobManagementEditableProps {
  className?: string;
}

export const AddEbook: React.FunctionComponent<AddEbookProps> = (props) => {
  async function openFile() {
    // When the button is clicked, open the native file picker to select a PDF.
    const item = await window.api.files.openEbookFileDialog();
    if (item && item.filePath) {
      // eslint-disable-next-line no-useless-escape
      const fileName = item.filePath.split(/.*[\/|\\]/)[1];

      let booksCounts = await dbClass.getEbookCounts();

      const fileHashed = String(SHA256(item.blob));

      if ((await db().haveSameEbookContent(fileHashed)) === true) {
        alert(
          `This ebook is already in the database. ${fileName} has been added before.`
        );
      } else {
        booksCounts = await dbClass.addNewEbook(fileName, fileHashed);
        alert(`Ebook added successfully. ${fileName} has been added.`);
        props.ebookBlobClassObject.addBook({
          EbookId: booksCounts,
          title: fileName,
          fileHash: fileHashed,
          ebookBlob: item.blob,
          NoteList: [],
        });
        props.setEbookBlobClassObject(props.ebookBlobClassObject);
      }
    }
  }
  return <Button content="Add Ebook" onClick={openFile} />;
};
