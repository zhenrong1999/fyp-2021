import React from "react";
import {
  ProviderProps,
  Button,
  Dialog,
  Header,
  TrashCanIcon,
} from "@fluentui/react-northstar";
import { dbClass } from "../Global/constant";
import {
  EbookBlobManagementEditableProps,
  EbookViewerSettingProps,
  IEbooksContent,
} from "../Global/interface";
interface DeleteEbookButtonProps
  extends ProviderProps,
    EbookViewerSettingProps,
    EbookBlobManagementEditableProps {
  ebookId: number;
  setEbookSelected: (ebookSelected: IEbooksContent) => void;
}

export const DeleteEbookButton: React.FunctionComponent<
  DeleteEbookButtonProps
> = (props) => {
  return (
    <Button
      icon={<TrashCanIcon />}
      iconOnly
      title="Delete Ebook"
      onClick={async () => {
        await dbClass
          .deleteEbook(props.ebookId)
          .then(() => {
            props.setFileBlob("");
            props.ebookBlobClassObject.deleteBook(props.ebookId);
            props.setEbookSelected({
              EbookId: -1,
              title: "",
              fileName: "",
              fileHash: "",
              NoteList: [],
            });
            window.api.browserWindow.infoDialog({
              message: "Ebook Deleted",
              type: "info",
            });
          })
          .catch((err) => {
            window.api.browserWindow.infoDialog({
              message: "Deleting Ebook \n" + err,
              type: "error",
            });
          });
      }}
    />
  );
};
