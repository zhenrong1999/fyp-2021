import React from "react";
import { Button, Loader } from "@fluentui/react-northstar";
import { dbClass, db } from "../../Database/index";
import { SHA256 } from "crypto-js";
import {
  EbookBlobInterface,
  EbookBlobManagementEditableProps,
} from "../Global/interface";

export interface AddEbookProps extends EbookBlobManagementEditableProps {
  className?: string;
}

export const AddEbook: React.FunctionComponent<AddEbookProps> = (props) => {
  const [loading, setLoading] = React.useState(false);
  async function openFile() {
    setLoading(true);
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
        props.ebookBlobClassObject.addBook({
          EbookId: booksCounts,
          ebookBlob: item.blob,
        } as EbookBlobInterface);
        props.setEbookBlobClassObject(props.ebookBlobClassObject);
        alert(`Ebook added successfully. ${fileName} has been added.`);
      }
    }
    setLoading(false);
  }
  return (
    <>
      {!loading ? (
        <Button content="Add Ebook" onClick={openFile} />
      ) : (
        <Loader label="Adding Ebook" size="smallest" labelPosition="end" />
      )}
    </>
  );
};
